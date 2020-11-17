import { request } from "../../api";
import { STATES } from "../../enums";

export const EVENT_LOADED = "event_loaded";
export const EVENT_UPDATE_STATE = "event_update_state";

const eventsQuery = ({dateFrom, dateTo, cities_id, categories_id}) => `{
  list: getEvents(filter:{cities_id:${JSON.stringify(cities_id)}, categories_id:${JSON.stringify(categories_id)}, dateFrom:${dateFrom ? '"' + dateFrom.toISOString() + '"' : null}, dateTo:${dateTo ? '"' + dateTo.toISOString() + '"' : null}}) {
    _id,
    date,
    url,
    name{ru,en},
    description{ru,en},
    place{ru,en},
    tags{_id,label},
    images{_id,url},
    city{
      _id,
      name{ru,en}
    },
    category{
      _id,
      name{ru,en}
    }
  }
}`;

function processing(data) {
  return {
    ...data,
    date: new Date(data.date),
    name: data.name.ru,
    description: data.description.ru,
    place: data.place.ru,
    city: {
      ...data.city,
      name: data.city.name.ru,
    },
    category: {
      ...data.category,
      name: data.category.name.ru,
    }
  };
}

export function fetchEventsActionCreator() {
  return (dispatch, getState) => {
    const { dateTo, dateFrom, categories_id, cities_id } = getState().filter;
    dispatch({type: EVENT_UPDATE_STATE, payload: {state: STATES.STATE_LOADING}});
    const req = eventsQuery({categories_id, cities_id, dateTo, dateFrom});
    return request(req, dispatch)
            .then(({success, data}) => {
              if (success) return data;
              throw new Error("Can't loaded");
            })
            .then(({list}) => list.map(processing))
            .then((list) => dispatch({ type: EVENT_LOADED, payload: {list, state: STATES.STATE_READY} }))
            .catch(() => {
              dispatch({ type: EVENT_UPDATE_STATE, payload: {state: STATES.STATE_ERROR} });
            });
  };
}