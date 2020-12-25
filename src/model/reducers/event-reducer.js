import { EVENT_PENDING, EVENT_INITED, EVENT_CREATED, EVENT_CREATING } from "../actions/event-action";
import { STATUSES } from "../../enums";

const initState = {
  list: [],
  offset: 0,
  total: 0,
  status: STATUSES.STATUS_NONE,
};

export function events(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case EVENT_PENDING:
    case EVENT_CREATING:
      return {
        ...state,
        status: STATUSES.STATUS_PENDING
      };
    case EVENT_INITED:
      return {
        ...state,
        status: STATUSES.STATUS_SUCCESS,
        ...payload
      };
    case EVENT_CREATED:
      return {
        ...state,
        status: STATUSES.STATUS_SUCCESS,
        list: [... new Set(state.list.concat(payload.list).map(({ _id }) => _id))].map(id => payload.list.find(({ _id }) => id === _id) || state.list.find(({ _id }) => id === _id)),
      };
    default:
      return state;
  }
}