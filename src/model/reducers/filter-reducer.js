import { addDays, addMonths, addWeeks, getMonth, getYear, startOfWeek } from "date-fns";
import { VIEWS } from "../../enums";
import { CHANGE_VIEW, CHANGE_DATE, TOGGLE_CITY_ID, TOGGLE_CATEGORY_ID, TOGGLE_TAG_ID } from "../actions/filter-action";

const initState = {
  now: new Date(),
  startDate: new Date(),
  dailyRange: [-1, 0, 1],
  view: VIEWS.MONTH,

  date: null,
  dateFrom: null,
  dateTo: null,
  cities_id: [],
  categories_id: [],
  tags_id: [],
};

function getRange(state, overState) {
  let dateFrom, dateTo;
  const view = overState && overState.view || state.view;
  const date = overState && overState.date || state.date;

  if (view === VIEWS.MONTH) {
    const y = getYear(date), m = getMonth(date);
    dateFrom = new Date(y, m, 1);
    dateTo = new Date(y, m + 1, 0);
  } else if (view === VIEWS.WEEK) {
    dateFrom = startOfWeek(date, { weekStartsOn: 1 });
    dateTo = addDays(dateFrom, 6);
  } else if (view === VIEWS.DAY) {
    dateFrom = addDays(date, state.dailyRange[0] || 0);
    dateTo = addDays(date, state.dailyRange[state.dailyRange.length - 1] || 0);
  }
  return { dateFrom, dateTo };
}

export function filter(state = { ...initState, date: initState.startDate, ...getRange(initState, { date: initState.startDate }) }, action) {
  const { type, payload } = action;

  switch (type) {
    case CHANGE_VIEW:
    case CHANGE_DATE: {
      const { date, startDate } = state;
      const view = payload.view || state.view;
      const num = parseInt(payload.num);

      let newDate = date;
      if (!isNaN(num)) {
        if (num === 0) {
          newDate = startDate;
        } else if (view === VIEWS.MONTH) {
          newDate = addMonths(newDate, num);
        } else if (view === VIEWS.WEEK) {
          newDate = addWeeks(newDate, num);
        } else if (view === VIEWS.DAY) {
          newDate = addDays(newDate, num);
        }
      }

      return {
        ...state,
        date: newDate,
        view,
        ...getRange(state, { view, date: newDate })
      };
    }
    case TOGGLE_CITY_ID: {
      const {city_id: id} = payload;
      const {cities_id: list} = state;
      return {
        ...state,
        cities_id: list.indexOf(id) !== -1 ? list.filter((v) => id !== v) : list.concat(id)
      };
    }
    case TOGGLE_CATEGORY_ID: {
      const {category_id: id} = payload;
      const {categories_id: list} = state; 
      return {
        ...state,
        categories_id: list.indexOf(id) !== -1 ? list.filter((v) => id !== v) : list.concat(id)
      };
    }
    case TOGGLE_TAG_ID: {
      const {tag_id: id} = payload;
      const {tags_id: list} = state; 
      return {
        ...state,
        tags_id: list.indexOf(id) !== -1 ? list.filter((v) => id !== v) : list.concat(id)
      };
    }
    default:
      return state;
  }
}