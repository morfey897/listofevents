import {EVENT_LOADED, EVENT_UPDATE_STATE} from "../actions/event-action";
import { STATUSES } from "../../enums";

const initState = {
  list: [],
  status: STATUSES.STATUS_NONE,
};

export function events(state = initState, action) {
  const {type, payload} = action;

  switch (type) {
    case EVENT_LOADED:
      return {
        ...state,
        status: payload.state,
        list: payload.list
      };
    case EVENT_UPDATE_STATE:
      return {
        ...state,
        status: payload.state,
      };
    default:
      return state;
  }
}