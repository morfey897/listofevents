import {CITY_LOADED, CITY_UPDATE_STATE} from "../actions/city-action";
import { STATUSES } from "../../enums";

const initState = {
  list: [],
  status: STATUSES.STATUS_NONE
};

export function cities(state = initState, action) {
  const {type, payload} = action;

  switch (type) {
    case CITY_LOADED:
      return {
        ...state,
        status: payload.state,
        list: payload.list
      };
    case CITY_UPDATE_STATE:
      return {
        ...state,
        status: payload.state
      };
    default:
      return state;
  }
}