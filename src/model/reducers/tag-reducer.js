import { TAG_PENDING, TAG_INITED } from "../actions/tag-action";
import { STATUSES } from "../../enums";

const initState = {
  list: [],
  offset: 0,
  total: 0,
  status: STATUSES.STATUS_NONE,
};

export function tags(state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case TAG_PENDING:
      return {
        ...state,
        status: STATUSES.STATUS_PENDING,
      };
    case TAG_INITED:
      return {
        ...state,
        status: STATUSES.STATUS_SUCCESS,
        ...payload,
      };
    default:
      return state;
  }
}