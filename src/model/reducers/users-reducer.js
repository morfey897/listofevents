import { USERS_LOADED, USERS_UPDATE_STATE, USERS_UPDATED, USERS_DELETED } from "../actions/users-action";
import { STATES } from "../../enums";

const initState = {
  list: [],
  state: STATES.STATE_NONE
};

export function users(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case USERS_UPDATED:
      return {
        ...state,
        state: payload.state,
        list: state.list.map(user => payload.list.find(({_id}) => user._id === _id) || user)
      };
    case USERS_DELETED:
      return {
        ...state,
        state: payload.state,
        list: state.list.filter(user => payload.list.indexOf(user._id) == -1)
      };
    case USERS_LOADED:
      return {
        ...state,
        state: payload.state,
        list: payload.list
      };
    case USERS_UPDATE_STATE:
      return {
        ...state,
        state: payload.state
      };
    default:
      return state;
  }
}