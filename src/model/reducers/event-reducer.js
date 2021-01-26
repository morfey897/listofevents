import { EVENT_PENDING, EVENT_INITED, EVENT_CREATED, EVENT_CREATING, EVENT_UPDATING, EVENT_UPDATED, EVENT_DELETED } from "../actions/event-action";
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
    case EVENT_UPDATING:
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
    case EVENT_UPDATED:
    case EVENT_CREATED:
      return {
        ...state,
        status: STATUSES.STATUS_SUCCESS,
        list: [... new Set(state.list.concat(payload.list).map(({ _id }) => _id))].map(id => payload.list.find(({ _id }) => id === _id) || state.list.find(({ _id }) => id === _id)),
      };
    case EVENT_DELETED:
      return {
        ...state,
        status: STATUSES.STATUS_SUCCESS,
        list: state.list.filter(event => payload.list.indexOf(event._id) == -1),
      };
    default:
      return state;
  }
}