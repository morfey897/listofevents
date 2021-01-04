import { request } from "../../api";
import { ErrorEmitter } from "../../emitters";
import { ERRORTYPES } from "../../errors";

export const EVENT_PENDING = "event_pending";
export const EVENT_INITED = "event_inited";

export const EVENT_CREATING = "event_creating";
export const EVENT_CREATED = "event_created";

const _body = `
  _id,
  date,
  duration,
  url,
  name{ru},
  description{ru},
  location{ru},
  images {
    _id,
    url
  },
  tags,
  city{
    _id,
    name{ru},
    description{ru}
  },
  category{
    _id,
    url,
    name{ru}
  }`;

const eventsQuery = `
query($tags: [String], $cities_id: [String], $categories_id: [String], $dateFrom: Date, $dateTo: Date, $limit: Int, $offset: Int, $sortBy: String, $sort: Int) {
  result: getEvents(filter:{tags: $tags, cities_id: $cities_id, categories_id: $categories_id, dateFrom: $dateFrom, dateTo: $dateTo}, paginate:{limit: $limit, offset: $offset}, sortBy:{field: $sortBy, sort: $sort}) {
    list {
      ${_body}
    },
    offset,
    total
  }
}`;

const eventQuery = `
query($id: String, $url: String) {
  event: getEvent(id: $id, url:$url) {
    ${_body}
  }
}`;

const createEventMutation = `
mutation($url: String!, $name: String!, $location: String!, $date: DateTime!, $duration: Int!, $category_id: String!, $description: String!, $tags: [String], $city_id: String!, $place_id: String!, $city_name: String!, $city_description: String!, $images: [Upload]) {
  event: createEvent(url: $url, name:{ru: $name}, location:{ru: $location}, date: $date, duration: $duration, category_id: $category_id, city:{_id: $city_id, place_id: $place_id, name:{ru: $city_name}, description:{ru: $city_description}}, description:{ru: $description}, tags: $tags, images: $images) {
    ${_body}
  }
}`;

function processing(data) {
  return {
    ...data,
    date: new Date(data.date.replace("Z", "")),
    name: data.name.ru,
    description: data.description.ru,
    location: data.location.ru,
    city: {
      ...data.city,
      name: data.city.name.ru,
      description: data.city.description.ru,
    },
    category: {
      ...data.category,
      name: data.category.name.ru,
    }
  };
}

export function fetchEventsActionCreator(filter, paginate = { limit: 0, offset: 0 }, sortBy = { sortBy: "date", sort: 1 }) {
  return (dispatch) => {
    dispatch({ type: EVENT_PENDING });
    return request(eventsQuery, { ...filter, ...paginate, ...sortBy })
      .then(({ success, data, errorCode }) => {
        if (success) {
          dispatch({ type: EVENT_INITED, payload: { ...data.result, list: data.result.list.map(processing) } });
        } else {
          dispatch({ type: EVENT_INITED });
          ErrorEmitter.emit(ERRORTYPES.EVENT_INIT_ERROR, errorCode);
        }
      })
      .catch(() => {
        dispatch({ type: EVENT_INITED });
        ErrorEmitter.emit(ERRORTYPES.EVENT_INIT_ERROR);
      });
  };
}

export function createEventActionCreator(inputData) {
  return (dispatch) => {
    dispatch({ type: EVENT_CREATING });
    return request(createEventMutation, { ...inputData })
      .then(({ success, data, errorCode }) => {
        if (success && data.event) {
          let event = { ...data.event };
          dispatch({ type: EVENT_CREATED, payload: { list: [event].map(processing) } });
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

export function fetchEvent(inputDAta) {
  return request(eventQuery, { ...inputDAta })
    .then(({ success, data }) => {
      if (success && data.event) {
        let event = { ...data.event };
        return Promise.resolve({ events: { list: [event].map(processing) } });
      } else {
        return Promise.resolve({});
      }
    })
    .catch(() => {
      return Promise.resolve({});
    });
}