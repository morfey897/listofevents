import { request } from "../../api/graphQL";
import { STATE_ERROR, STATE_LOADING, STATE_NONE, STATE_READY } from "../../enums/states";

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
    if (state === STATE_NONE) {
      dispatch({type: CITY_UPDATE_STATE, payload: {state: STATE_LOADING}});
      return request(citiesQuery())
              .then(({success, data}) => {
                if (success) return data;
                throw new Error("Can't load");
              })
              .then(({list}) => list.map(processing))
              .then((list) => dispatch({ type: CITY_LOADED, payload: {list, state: STATE_READY}}))
              .catch(e => {
                dispatch({type: CITY_UPDATE_STATE, payload: {state: STATE_ERROR}});
              });
    }
    return Promise.resolve();
  };
}