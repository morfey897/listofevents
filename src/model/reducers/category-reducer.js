import { CATEGORY_PENDING, CATEGORY_INITED, CATEGORY_CREATING, CATEGORY_CREATED } from "../actions/category-action";
import { STATUSES } from "../../enums";

const initState = {
  list: [],
  offset: 0,
  total: 0,
  status: STATUSES.STATUS_NONE,
};

export function categories(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case CATEGORY_PENDING:
    case CATEGORY_CREATING:
      return {
        ...state,
        status: STATUSES.STATUS_PENDING,
      };
    case CATEGORY_INITED:
      return {
        ...state,
        status: STATUSES.STATUS_SUCCESS,
        ...payload,
      };
    case CATEGORY_CREATED:
      return {
        ...state,
        status: STATUSES.STATUS_SUCCESS,
        list: [... new Set(state.list.concat(payload.list).map(({ _id }) => _id))].map(id => payload.list.find(({ _id }) => id === _id) || state.list.find(({ _id }) => id === _id)),
      };
    default:
      return state;
  }
}