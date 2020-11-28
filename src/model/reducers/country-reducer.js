import {COUNTRY_LOADED, COUNTRY_UPDATE_STATE} from "../actions/country-action";
import { STATUSES } from "../../enums";

const initState = {
  list: [],
  status: STATUSES.STATUS_NONE,
};

export function countries(state = initState, action) {
  const {type, payload} = action;

  switch (type) {
    case COUNTRY_LOADED:
      return {
        ...state,
        status: payload.state,
        list: payload.list
      };
    case COUNTRY_UPDATE_STATE:
      return {
        ...state,
        status: payload.state,
      };
    default:
      return state;
  }
}