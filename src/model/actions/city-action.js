import { request } from "../../api";
import { ErrorEmitter } from "../../emitters";
import { ERRORTYPES } from "../../errors";

export const CITY_PENDING = "city_pending";
export const CITY_INITED = "city_inited";

const citiesQuery = () => `query {
  result: getCities(paginate:{limit:100}) {
    list{
      _id,
      place_id,
      name{ru},
      description{ru}
    },
    offset,
    total
  }
}`;

function processing(data) {
  return {
    ...data,
    name: data.name.ru,
    description: data.description.ru
  };
}

export function fetchCitiesActionCreator() {
  return (dispatch) => {
    dispatch({ type: CITY_PENDING });
    return request(citiesQuery())
      .then(({ success, data, errorCode  }) => {
        if (success) {
          dispatch({ type: CITY_INITED, payload: { ...data.result, list: data.result.list.map(processing) } });
        } else {
          dispatch({ type: CITY_INITED });
          ErrorEmitter.emit(ERRORTYPES.CITY_INIT_ERROR, errorCode);
        }
      })
      .catch(() => {
        dispatch({ type: CITY_INITED });
        ErrorEmitter.emit(ERRORTYPES.CITY_INIT_ERROR);
      });
  };
}