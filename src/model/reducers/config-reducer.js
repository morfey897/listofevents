import { STATUSES } from "../../enums";
import { CONFIG_PENDING, CONFIG_INITED, CONFIG_ERROR } from "../actions/config-action";

const initState = {
  errorCode: 0,
  langs: [],
  roles: {},
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
        errorCode: payload.errorCode,
      };  
    case CONFIG_INITED: {
      return {
        ...state,
        ...payload.data,
        errorCode: 0,
        status: STATUSES.STATUS_INITED
      };
    }
    default:
      return state;
  }
}