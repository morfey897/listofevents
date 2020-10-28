import {COUNTRY_LOADED, COUNTRY_UPDATE_STATE} from "../actions/country-action";
import { STATES } from "../../enums";

const initState = {
  list: [],
  state: STATES.STATE_NONE,
};

export function countries(state = initState, action) {
  const {type, payload} = action;

  switch (type) {
    case COUNTRY_LOADED:
      return {
        ...state,
        state: payload.state,
        list: payload.list
      };
    case COUNTRY_UPDATE_STATE:
      return {
        ...state,
        state: payload.state,
      };
    default:
      return state;
  }
}