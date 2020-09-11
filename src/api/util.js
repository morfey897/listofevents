export const checkFilter = (f, name, filter) => {
  if (!Array.isArray(f)) {
    f = [f];
  }
  f = f.filter(c => c && typeof c === "string");
  if (f.length) {
    filter.push(`${name}: ${f}`);
  }
};