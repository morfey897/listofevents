import { checkFilter } from "../util";

export const getCategory = (id) => `{
  event: getCategory(id:'${id}') {
    ru,
    en
  }
}`;

export const filterCategories = (args) => {

  const filter = [];
  checkFilter(args && args.filter, "filter", filter);

  return `{
    events: filterCategories(filter:{${filter.join(',')}}) {
      date,
      country {_id, ru, en},
      city {_id, ru, en},
      category {_id, ru, en},
      place {name, lat, lon},
      description
    }
  }`;
};