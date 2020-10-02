import { request } from "../../api/graphQL";
import { STATE_ERROR, STATE_LOADING, STATE_NONE, STATE_READY } from "../enums";

export const SAVE_COUNTRY = "save_country";
export const LOADED_COUNTRIES = "loaded_countries";
export const UPDATE_COUNTRIES_STATE = "update_countries_state";

const countryQuery = (_id) => `{
  country: getCountry(id:'${_id}') {
    _id,
    iso_code,
    name{ru, en}
  }
}`;

const countriesQuery = () => `{
  countries: getCountries {
    _id,
    iso_code,
    name{ru,en}
  }
}`;

export function fetchCountryActionCreator(_id) {
  return (dispatch) => {
    return request(countryQuery(_id)).then(({success, data}) => success && dispatch({ type: SAVE_COUNTRY, payload: data.country }));
  };
}

export function fetchCountriesActionCreator() {
  return (dispatch, getState) => {
    const { state } = getState().cities;
    if (state === STATE_NONE) {
      dispatch({type: UPDATE_COUNTRIES_STATE, state: STATE_LOADING});
      return request(countriesQuery()).then(({success, data}) => success ? dispatch({ type: LOADED_COUNTRIES, payload: data.countries, state: STATE_READY }) : dispatch({ type: UPDATE_COUNTRIES_STATE, state: STATE_ERROR }));
    }
    return Promise.resolve();
  };
}