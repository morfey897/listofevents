import {CITY_LOADED, CITY_UPDATE_STATE} from "../actions/city-action";
import { STATES } from "../../enums";

const initState = {
  list: [],
  state: STATES.STATE_NONE
};

export function cities(state = initState, action) {
  const {type, payload} = action;

  switch (type) {
    case CITY_LOADED:
      return {
        ...state,
        state: payload.state,
        list: payload.list
      };
    case CITY_UPDATE_STATE:
      return {
        ...state,
        state: payload.state
      };
    default:
      return state;
  }
}