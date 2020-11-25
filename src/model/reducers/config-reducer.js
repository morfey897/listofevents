import { STATES } from "../../enums";
import { CONFIG_UPDATE_STATE } from "../actions/config-action";

const initState = {
  langs: [],
  roles: {},
  state: STATES.STATE_NONE
};

export function config(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case CONFIG_UPDATE_STATE: {
      return {
        ...state,
        ...payload.data,
        state: payload.state
      };
    }
    default:
      return state;
  }
}