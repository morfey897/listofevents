import { request } from "../../api";
import { STATUSES } from "../../enums";

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
    if (state === STATUSES.STATUS_NONE) {
      dispatch({type: COUNTRY_UPDATE_STATE, payload: {status: STATUSES.STATUS_PENDING}});
      return request(countriesQuery())
              .then(({success, data}) => {
                if (success) return data;
                throw new Error("Can't loaded");
              })
              .then(({list}) => list.map(processing))
              .then((list) => dispatch({ type: COUNTRY_LOADED, payload: {list, status: STATUSES.STATUS_INITED} }))
              .catch(() => {
                dispatch({ type: COUNTRY_UPDATE_STATE, payload: {status: STATUSES.STATUS_ERROR} });
              });
    }
    return Promise.resolve();
  };
}