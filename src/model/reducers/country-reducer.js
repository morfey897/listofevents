import {LOADED_COUNTRIES, SAVE_COUNTRY, UPDATE_COUNTRIES_STATE} from "../actions/country-action";
import { STATE_NONE } from "../enums";

const initState = {
  list: [],
  state: STATE_NONE,
};

export function countries(state = initState, action) {
  switch (action.type) {
    case SAVE_COUNTRY:
      return {
        ...state,
        list: state.list.find(({_id}) => _id === action.payload._id) ? 
                state.list.map((v) => v._id === action.payload._id ? action.payload : v) : 
                state.list.concat(action.payload)
      };
    case LOADED_COUNTRIES:
      return {
        ...state,
        state: action.state,
        list: action.payload
      };
    case UPDATE_COUNTRIES_STATE:
      return {
        ...state,
        state: action.state,
      };
    default:
      return state;
  }
}