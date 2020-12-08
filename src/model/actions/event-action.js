import { request } from "../../api";
import { ErrorEmitter } from "../../emitters";
import { STATUSES } from "../../enums";
import { ERRORTYPES } from "../../errors";

export const EVENT_PENDING = "event_pending";
export const EVENT_INITED = "event_inited";

export const EVENT_CREATING = "event_creating";
export const EVENT_CREATED = "event_created";

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

const createMutation = ({ url, name, location, date, category_id, city, description = "", tags = [] }) => `mutation {
  category: createEvent(url:"${url}", name:{ru:"${name}"}, location:{ru:"${location}"}, date:"${date}", category_id:"${category_id}", city:{_id:"${city._id}", place_id:"${city.place_id}", name:{ru:"${city.name}"}, description:{ru:"${city.description}"}}, description:{ru:"${description}"}, tags:${JSON.stringify(tags)}) {
    _id,
    url,
    name{ru},
    location{ru},
    description{ru},
    tags,
    images {
      _id,
      url
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
  // return (dispatch, getState) => {
  //   const { dateTo, dateFrom, categories_id, cities_id } = getState().filter;
  //   dispatch({type: EVENT_UPDATE_STATE, payload: {status: STATUSES.STATUS_PENDING}});
  //   const req = eventsQuery({categories_id, cities_id, dateTo, dateFrom});
  //   return request(req)
  //           .then(({success, data}) => {
  //             if (success) return data;
  //             throw new Error("Can't loaded");
  //           })
  //           .then(({list}) => list.map(processing))
  //           .then((list) => dispatch({ type: EVENT_LOADED, payload: {list, status: STATUSES.STATUS_SUCCESS} }))
  //           .catch(() => {
  //             dispatch({ type: EVENT_UPDATE_STATE, payload: {status: STATUSES.STATUS_ERROR} });
  //           });
  // };
}

export function createEventActionCreator(inputData) {
  return (dispatch) => {
    dispatch({ type: EVENT_CREATING });
    return request(createMutation({ ...inputData }))
      .then(({ success, data, errorCode }) => {
        if (success && data.category) {
          let category = {...data.category};
          dispatch({ type: EVENT_CREATED, payload: { list: [category].map(processing) } });
        } else {
          dispatch({ type: EVENT_CREATED, payload: { list: [] } });
          ErrorEmitter.emit(ERRORTYPES.EVENT_CREATE_ERROR, errorCode);
        }
      })
      .catch(() => {
        dispatch({ type: EVENT_CREATED, payload: { list: [] } });
        ErrorEmitter.emit(ERRORTYPES.EVENT_CREATE_ERROR);
      });
  };
}