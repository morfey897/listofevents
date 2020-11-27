import {CATEGORY_LOADED, CATEGORY_UPDATE_STATE} from "../actions/category-action";
import { STATUSES } from "../../enums";

const initState = {
  list: [],
  status: STATUSES.STATUS_NONE
};

export function categories(state = initState, action) {
  const {type, payload} = action;

  switch (type) {
    case CATEGORY_LOADED:
      return {
        ...state,
        status: payload.state,
        list: payload.list
      };
    case CATEGORY_UPDATE_STATE:
      return {
        ...state,
        status: payload.state
      };
    default:
      return state;
  }
}