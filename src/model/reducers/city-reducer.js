import { CITY_PENDING, CITY_INITED } from "../actions/city-action";
import { STATUSES } from "../../enums";

const initState = {
  list: [],
  offset: 0,
  total: 0,
  status: STATUSES.STATUS_NONE
};

export function cities(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case CITY_PENDING:
      return {
        ...state,
        status: STATUSES.STATUS_PENDING,
      };
    case CITY_INITED:
      return {
        ...state,
        status: STATUSES.STATUS_SUCCESS,
        ...payload,
      };
    default:
      return state;
  }
}