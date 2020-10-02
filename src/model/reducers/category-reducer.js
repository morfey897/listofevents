import {LOADED_CATEGORIES, SAVE_CATEGORY, UPDATE_CATEGORIES_STATE} from "../actions/category-action";
import { STATE_NONE } from "../enums";

const initState = {
  list: [],
  state: STATE_NONE
};

export function categories(state = initState, action) {
  switch (action.type) {
    case SAVE_CATEGORY:
      return {
        ...state,
        list: state.list.find(({_id}) => _id === action.payload._id) ? 
                state.list.map((v) => v._id === action.payload._id ? action.payload : v) : 
                state.list.concat(action.payload)
      };
    case LOADED_CATEGORIES:
      return {
        ...state,
        state: action.state,
        list: action.payload
      };
    case UPDATE_CATEGORIES_STATE:
      return {
        ...state,
        state: action.state
      };
    default:
      return state;
  }
}