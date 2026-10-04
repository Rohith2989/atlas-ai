export const facets = [
  { key: "industry", label: "Industry" },
  { key: "country", label: "Country" },
  { key: "builders", label: "Venture builder" },
  { key: "stage", label: "Stage" },
  { key: "status", label: "Status" },
];

const valuesFor = (company, key) =>
  Array.isArray(company[key]) ? company[key] : [company[key]];
export function optionsFor(companies, key) {
  return [...new Set(companies.flatMap((c) => valuesFor(c, key)))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}
export function emptyFilters() {
  return { q: "", ...Object.fromEntries(facets.map(({ key }) => [key, []])) };
}
export function readFilters(search, companies) {
  const params = new URLSearchParams(search),
    state = emptyFilters();
  state.q = (params.get("q") || "").trim().slice(0, 160);
  for (const { key } of facets) {
    const allowed = optionsFor(companies, key);
    state[key] = [...new Set(params.getAll(key))].filter((value) =>
      allowed.includes(value),
    );
  }
  return state;
}
export function writeFilters(state) {
  const params = new URLSearchParams();
  if (state.q.trim()) params.set("q", state.q.trim());
  for (const { key } of facets)
    for (const value of state[key]) params.append(key, value);
  return params.toString();
}
export function filterCompanies(companies, state, ignoreFacet) {
  const words = state.q.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return companies.filter((c) => {
    const text = [
      c.name,
      c.sector,
      c.description,
      c.industry,
      c.country,
      ...c.builders,
      c.stage,
      c.status,
    ]
      .join(" ")
      .toLocaleLowerCase();
    return (
      words.every((word) => text.includes(word)) &&
      facets.every(
        ({ key }) =>
          key === ignoreFacet ||
          !state[key].length ||
          state[key].some((value) => valuesFor(c, key).includes(value)),
      )
    );
  });
}
export function countOption(companies, state, key, value) {
  return filterCompanies(companies, state, key).filter((c) =>
    valuesFor(c, key).includes(value),
  ).length;
}
