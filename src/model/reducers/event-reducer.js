import {EVENT_LOADED, EVENT_UPDATE_STATE} from "../actions/event-action";
import { STATES } from "../../enums";

const initState = {
  list: [],
  state: STATES.STATE_NONE,
};

export function events(state = initState, action) {
  const {type, payload} = action;

  switch (type) {
    case EVENT_LOADED:
      return {
        ...state,
        state: payload.state,
        list: payload.list
      };
    case EVENT_UPDATE_STATE:
      return {
        ...state,
        state: payload.state,
      };
    default:
      return state;
  }
}