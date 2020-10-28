import { request } from "../../api/graphQL";
import { STATES } from "../../enums";

export const COUNTRY_LOADED = "country_loaded";
export const COUNTRY_UPDATE_STATE = "country_update_state";

const countriesQuery = () => `{
  list: getCountries {
    _id,
    iso_code,
    name{ru,en}
  }
}`;

function processing(data) {
  return {
    ...data,
    name: data.name.ru,
  };
}

export function fetchCountriesActionCreator() {
  return (dispatch, getState) => {
    const { state } = getState().countries;
    if (state === STATES.STATE_NONE) {
      dispatch({type: COUNTRY_UPDATE_STATE, payload: {state: STATES.STATE_LOADING}});
      return request(countriesQuery())
              .then(({success, data}) => {
                if (success) return data;
                throw new Error("Can't loaded");
              })
              .then(({list}) => list.map(processing))
              .then((list) => dispatch({ type: COUNTRY_LOADED, payload: {list, state: STATES.STATE_READY} }))
              .catch(() => {
                dispatch({ type: COUNTRY_UPDATE_STATE, payload: {state: STATES.STATE_ERROR} });
              });
    }
    return Promise.resolve();
  };
}