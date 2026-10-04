const records = import.meta.glob("./data/companies/*.json", {
  eager: true,
  import: "default",
});
export const companies = Object.values(records).sort(
  (a, b) => a.order - b.order,
);
