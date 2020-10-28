import {CATEGORY_LOADED, CATEGORY_UPDATE_STATE} from "../actions/category-action";
import { STATES } from "../../enums";

const initState = {
  list: [],
  state: STATES.STATE_NONE
};

export function categories(state = initState, action) {
  const {type, payload} = action;

  switch (type) {
    case CATEGORY_LOADED:
      return {
        ...state,
        state: payload.state,
        list: payload.list
      };
    case CATEGORY_UPDATE_STATE:
      return {
        ...state,
        state: payload.state
      };
    default:
      return state;
  }
}