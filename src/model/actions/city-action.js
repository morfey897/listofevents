import { request } from "../../api";
import { STATUSES } from "../../enums";

export const CITY_LOADED = "city_loaded";
export const CITY_UPDATE_STATE = "city_update_state";

const citiesQuery = () => `query {
  list: getCities {
    _id,
    country{
      _id,
      iso_code,
      name{ru, en}
    },
    name{ru,en}
  }
}`;

function processing(data) {
  return {
    ...data,
    name: data.name.ru,
    country: {
      ...data.country,
      name: data.country.name.ru,
    }
  };
}

export function fetchCitiesActionCreator() {
  return (dispatch, getState) => {
    const { state } = getState().cities;
    if (state === STATUSES.STATUS_NONE) {
      dispatch({type: CITY_UPDATE_STATE, payload: {status: STATUSES.STATUS_PENDING}});
      return request(citiesQuery())
              .then(({success, data}) => {
                if (success) return data;
                throw new Error("Can't load");
              })
              .then(({list}) => list.map(processing))
              .then((list) => dispatch({ type: CITY_LOADED, payload: {list, status: STATUSES.STATUS_INITED}}))
              .catch(() => {
                dispatch({type: CITY_UPDATE_STATE, payload: {status: STATUSES.STATUS_ERROR}});
              });
    }
    return Promise.resolve();
  };
}