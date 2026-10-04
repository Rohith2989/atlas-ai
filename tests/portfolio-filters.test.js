import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import {
  facets,
  optionsFor,
  emptyFilters,
  readFilters,
  writeFilters,
  filterCompanies,
  countOption,
} from "../src/portfolio-filters.js";

const companies = readdirSync(
  new URL("../src/data/companies/", import.meta.url),
).map((file) =>
  JSON.parse(
    readFileSync(new URL(`../src/data/companies/${file}`, import.meta.url)),
  ),
);

test("all 28 portfolio companies have source-backed facets and local artwork", () => {
  assert.equal(companies.length, 28);
  assert.equal(new Set(companies.map((c) => c.id)).size, 28);
  for (const c of companies) {
    for (const { key } of facets)
      assert.ok(c[key]?.length, `${c.id}: missing ${key}`);
    assert.ok(c.description);
    assert.equal(new URL(c.website).protocol, "https:");
    assert.equal(c.source.portfolio, "https://www.atlasaivbfund.com/portfolio");
    for (const asset of [c.cover, c.logo])
      assert.ok(
        existsSync(new URL(`../public${asset}`, import.meta.url)),
        `${c.id}: ${asset}`,
      );
  }
});

test("filters combine alternatives within a facet and intersections between facets", () => {
  const state = {
    ...emptyFilters(),
    industry: ["Biotech", "Healthcare"],
    country: ["United Kingdom"],
    stage: ["Pre-seed"],
  };
  const result = filterCompanies(companies, state)
    .map((c) => c.id)
    .sort();
  assert.deepEqual(result, ["axiom", "bioleap", "genie-fertility"]);
});

test("a company associated with two builders appears under either builder once", () => {
  assert.ok(optionsFor(companies, "builders").includes("Founders Factory"));
  assert.ok(
    !optionsFor(companies, "builders").includes("Antler, Founders Factory"),
  );
  const state = { ...emptyFilters(), builders: ["Founders Factory", "Antler"] };
  const result = filterCompanies(companies, state);
  assert.equal(result.filter((c) => c.id === "claro").length, 1);
});

test("option counts respect other facets while allowing alternatives in their own facet", () => {
  const state = {
    ...emptyFilters(),
    country: ["United Kingdom"],
    industry: ["Biotech"],
  };
  assert.equal(countOption(companies, state, "industry", "Gaming"), 1);
  assert.equal(countOption(companies, state, "industry", "Construction"), 0);
  assert.equal(countOption(companies, state, "country", "Singapore"), 0);
});

test("search matches all words across company metadata regardless of case", () => {
  const state = { ...emptyFilters(), q: "  photonic   KINGDOM " };
  assert.deepEqual(
    filterCompanies(companies, state).map((c) => c.id),
    ["sekkari"],
  );
  state.q = "no-such-company";
  assert.equal(filterCompanies(companies, state).length, 0);
  assert.equal(filterCompanies(companies, emptyFilters()).length, 28);
});

test("shared filter URLs round trip and reject unknown or duplicated values", () => {
  const state = {
    ...emptyFilters(),
    q: "AI & biology",
    country: ["United Kingdom", "United States"],
    builders: ["Antler"],
    status: ["In portfolio"],
  };
  assert.deepEqual(readFilters(writeFilters(state), companies), state);
  const parsed = readFilters(
    "?stage=Seed&stage=Seed&stage=NotReal&country=France&unexpected=value&q=" +
      "a".repeat(300),
    companies,
  );
  assert.deepEqual(parsed.stage, ["Seed"]);
  assert.deepEqual(parsed.country, []);
  assert.equal(parsed.q.length, 160);
});

test("exit status and actual stage both return the exited holding", () => {
  for (const key of ["status", "stage"])
    assert.deepEqual(
      filterCompanies(companies, { ...emptyFilters(), [key]: ["Exited"] }).map(
        (c) => c.id,
      ),
      ["tylo-ai"],
    );
});
