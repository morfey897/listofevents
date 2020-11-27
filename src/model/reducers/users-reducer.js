import { USERS_PENDING, USERS_INITED, USERS_ERROR, USERS_DELETED, USERS_UPDATING, USERS_UPDATED, USERS_UPDATE_ERROR } from "../actions/users-action";
import { STATUSES } from "../../enums";

const initState = {
  list: [],
  updating: [],
  status: STATUSES.STATUS_NONE
};

export function users(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case USERS_PENDING:
      return {
        ...state,
        status: STATUSES.STATUS_PENDING
      };
    case USERS_INITED:
      return {
        ...state,
        status: STATUSES.STATUS_INITED,
        list: payload.list
      };
    case USERS_UPDATED:
      return {
        ...state,
        status: STATUSES.STATUS_UPDATED,
        list: state.list.map(user => payload.list.find(({ _id }) => user._id === _id) || user),
        updating: state.updating.filter(id => !payload.list.some(({_id}) => _id != id))
      };
    case USERS_DELETED:
      return {
        ...state,
        status: STATUSES.STATUS_UPDATED,
        list: state.list.filter(user => payload.list.indexOf(user._id) == -1),
        updating: state.updating.filter(id => !payload.list.some(({_id}) => _id != id))
      };
    case USERS_UPDATING:
      return {
        ...state,
        status: STATUSES.STATUS_UPDATING,
        updating: state.updating.concat(payload.list).filter((v, i, a) => a.indexOf(v) === i)
      };
    case USERS_UPDATE_ERROR:
      return {
        ...state,
        status: STATUSES.STATUS_ERROR,
        updating: state.updating.filter(id => payload.list.indexOf(id) == -1)
      };
    case USERS_ERROR:
      return {
        ...state,
        status: STATUSES.STATUS_ERROR
      };
    default:
      return state;
  }
}