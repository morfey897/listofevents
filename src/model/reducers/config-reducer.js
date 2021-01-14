import { STATUSES } from "../../enums";
import { CONFIG_PENDING, CONFIG_INITED, CONFIG_ERROR } from "../actions/config-action";

const initState = {
  langs: [],
  roles: {},
  apps: {},
  status: STATUSES.STATUS_NONE
};

export function config(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case CONFIG_PENDING:
      return {
        ...state,
        status: STATUSES.STATUS_PENDING
      };
    case CONFIG_ERROR:
      return {
        ...state,
        status: STATUSES.STATUS_ERROR,
      };
    case CONFIG_INITED: {
      return {
        ...state,
        ...payload.data,
        status: STATUSES.STATUS_SUCCESS
      };
    }
    default:
      return state;
  }
}