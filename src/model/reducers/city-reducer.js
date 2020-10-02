import {LOADED_CITIES, SAVE_CITY, UPDATE_CITIES_STATE} from "../actions/city-action";
import { STATE_NONE } from "../enums";

const initState = {
  list: [],
  state: STATE_NONE
};

export function cities(state = initState, action) {
  switch (action.type) {
    case SAVE_CITY:
      return {
        ...state,
        list: state.list.find(({_id}) => _id === action.payload._id) ? 
                state.list.map((v) => v._id === action.payload._id ? action.payload : v) : 
                state.list.concat(action.payload)
      };
    case LOADED_CITIES:
      return {
        ...state,
        state: action.state,
        list: action.payload
      };
    case UPDATE_CITIES_STATE:
      return {
        ...state,
        state: action.state
      };
    default:
      return state;
  }
}