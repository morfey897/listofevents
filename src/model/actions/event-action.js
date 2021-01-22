import { request } from "../../api";
import { ErrorEmitter } from "../../emitters";
import { ERRORTYPES } from "../../errors";

export const EVENT_PENDING = "event_pending";
export const EVENT_INITED = "event_inited";

export const EVENT_CREATING = "event_creating";
export const EVENT_UPDATING = "event_updating";

export const EVENT_UPDATED = "event_updated";
export const EVENT_CREATED = "event_created";
export const EVENT_DELETED = "event_deleted";

const _body = `
  _id,
  date,
  duration,
  url,
  name{{{LOCALE}}},
  description{{{LOCALE}}},
  location{{{LOCALE}}},
  author{
    _id
  },
  images {
    _id,
    url
  },
  tags,
  city{
    _id,
    place_id,
    name{{{LOCALE}}},
    description{{{LOCALE}}}
  },
  category{
    _id,
    url,
    name{{{LOCALE}}}
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
mutation($url: String!, $name: String!, $location: String!, $date: DateTime!, $duration: Int!, $category_id: String!, $description: String!, $tags: [String], $city_id: String, $place_id: String, $city_name: String!, $city_description: String!, $images: [Upload]) {
  event: createEvent(url: $url, name:{{{LOCALE}}: $name}, location:{{{LOCALE}}: $location}, date: $date, duration: $duration, category_id: $category_id, city:{_id: $city_id, place_id: $place_id, name:{{{LOCALE}}: $city_name}, description:{{{LOCALE}}: $city_description}}, description:{{{LOCALE}}: $description}, tags: $tags, images: $images) {
    ${_body}
  }
}`;

const updateEventMutation = `
mutation($_id: String!, $url: String!, $name: String!, $location: String!, $date: DateTime!, $duration: Int!, $category_id: String!, $description: String!, $tags: [String], $city_id: String, $place_id: String, $city_name: String!, $city_description: String!, $images: [String], $add_images: [Upload]) {
  event: updateEvent(_id: $_id, url: $url, name:{{{LOCALE}}: $name}, location:{{{LOCALE}}: $location}, date: $date, duration: $duration, category_id: $category_id, city:{_id: $city_id, place_id: $place_id, name:{{{LOCALE}}: $city_name}, description:{{{LOCALE}}: $city_description}}, description:{{{LOCALE}}: $description}, tags: $tags, images: $images, add_images: $add_images) {
    ${_body}
  }
}`;

const deleteEventMutation = `
mutation($ids: [String]) {
  count: deleteEvent(ids: $ids)
}`;

function processing(data) {
  return {
    ...data,
    date: new Date(data.date.replace("Z", "")),
    name: Object.values(data.name)[0],
    description: Object.values(data.description)[0],
    location: Object.values(data.location)[0],
    city: {
      ...data.city,
      name: Object.values(data.city.name)[0],
      description: Object.values(data.city.description)[0],
    },
    category: {
      ...data.category,
      name: Object.values(data.category.name)[0],
    }
  };
}

export function fetchEventsActionCreator(filter, paginate = { limit: 0, offset: 0 }, sortBy = { sortBy: "date", sort: -1 }) {
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

export function updateEventActionCreator(inputData) {
  return (dispatch) => {
    dispatch({ type: EVENT_UPDATING });
    return request(updateEventMutation, { ...inputData })
      .then(({ success, data, errorCode }) => {
        if (success && data.event) {
          let event = { ...data.event };
          dispatch({ type: EVENT_UPDATED, payload: { list: [event].map(processing) } });
        } else {
          dispatch({ type: EVENT_UPDATED, payload: { list: [] } });
          ErrorEmitter.emit(ERRORTYPES.EVENT_UPDATE_ERROR, errorCode);
        }
      })
      .catch(() => {
        dispatch({ type: EVENT_UPDATED, payload: { list: [] } });
        ErrorEmitter.emit(ERRORTYPES.EVENT_UPDATE_ERROR);
      });
  };
}

export function deleteEventActionCreator(ids) {
  return (dispatch) => {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    dispatch({ type: EVENT_UPDATING, payload: { list: ids } });
    return request(deleteEventMutation, { ids })
      .then(({ success, data, errorCode }) => {
        if (success) {
          dispatch({ type: EVENT_DELETED, payload: { list: data.count > 0 ? ids : [] } });
        } else {
          dispatch({ type: EVENT_UPDATED, payload: { list: [] } });
          ErrorEmitter.emit(ERRORTYPES.EVENT_DELETE_ERROR, errorCode);
        }
      })
      .catch(() => {
        dispatch({ type: EVENT_UPDATED, payload: { list: [] } });
        ErrorEmitter.emit(ERRORTYPES.EVENT_DELETE_ERROR);
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