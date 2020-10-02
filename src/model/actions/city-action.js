import { request } from "../../api/graphQL";
import { STATE_ERROR, STATE_LOADING, STATE_NONE, STATE_READY } from "../enums";

export const SAVE_CITY = "save_city";
export const LOADED_CITIES = "save_cities";
export const UPDATE_CITIES_STATE = "update_cities_state";

const cityQuery = (_id) => `query {
  city: getCity(id:'${_id}') {
    _id,
    country{
      _id,
      iso_code,
      name: {ru, en}
    },
    name: {ru, en}
  }
}`;

const citiesQuery = () => `query {
  cities: getCities {
    _id,
    country{
      _id,
      iso_code,
      name{ru, en}
    },
    name{ru,en}
  }
}`;

export function fetchCityActionCreator(_id) {
  return (dispatch) => {
    return request(cityQuery(_id)).then(({success, data}) => success && dispatch({ type: SAVE_CITY, payload: data.city }));
  };
}

export function fetchCitiesActionCreator() {
  return (dispatch, getState) => {
    const { state } = getState().cities;
    if (state === STATE_NONE) {
      dispatch({type: UPDATE_CITIES_STATE, state: STATE_LOADING});
      return request(citiesQuery()).then(({success, data}) => success ? dispatch({ type: LOADED_CITIES, state: STATE_READY, payload: data.cities}) : dispatch({type: UPDATE_CITIES_STATE, state: STATE_ERROR}));
    }
    return Promise.resolve();
  };
}