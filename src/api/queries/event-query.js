const checkFilter = (f, name, filter) => {
  if (!Array.isArray(f)) {
    f = [f];
  }
  f = f.filter(c => c && typeof c === "string");
  if (f.length) {
    filter.push(`${name}: ${f}`);
  }
};

export const getEvent = (id) => `{
  event: getEvent(id:'${id}') {
    date,
    country {_id, ru, en},
    city {_id, ru, en},
    category {_id, ru, en},
    place {name, lat, lon},
    description
  }
}`;

export const filterEvents = (args) => {

  const filter = [];
  checkFilter(args && args.country, "country", filter);
  checkFilter(args && args.city, "city", filter);
  checkFilter(args && args.category, "category", filter);
  filter.push(`dateFrom: ${args && args.from instanceof Date ? args.from.toISOString() : null}`);
  filter.push(`dateTo: ${args && args.to instanceof Date ? args.to.toISOString() : null}`);

  return `{
    events: filterEvents(sortBy: 1, filter:{${filter.join(',')}}) {
      date,
      country {_id, ru, en},
      city {_id, ru, en},
      category {_id, ru, en},
      place {name, lat, lon},
      description
    }
  }`;
};