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

const eventsQuery = ({ dateFrom = null, dateTo = null, cities_id = [], categories_id = [], tags = [] }, { limit = 0, offset = 0 }, { field = "date", sort = 1 }) => `{
  result: getEvents(filter:{tags:${JSON.stringify(tags)}, cities_id:${JSON.stringify(cities_id)}, categories_id:${JSON.stringify(categories_id)}, dateFrom:${JSON.stringify(dateFrom)}, dateTo:${JSON.stringify(dateTo)}},paginate:{limit:${limit},offset:${offset}},sortBy:{field:"${field}",sort:${sort}}) {
    list {
      ${_body}
    },
    offset,
    total
  }
}`;

const createMutation = ({ url, name, location, date, duration, category_id, city, description = "", tags = [] }) => `mutation {
  event: createEvent(url:"${url}", name:{ru:"${name}"}, location:{ru:"${location}"}, date:"${date}", duration:${duration}, category_id:"${category_id}", city:{_id:"${city._id}", place_id:"${city.place_id}", name:{ru:"${city.name}"}, description:{ru:"${city.description}"}}, description:{ru:"${description}"}, tags:${JSON.stringify(tags)}) {
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
    },
    tags: ["#first", "#second", "#competition"]
  };
}

export function fetchEventsActionCreator(filter, paginate, sortBy) {
  return (dispatch) => {
    dispatch({ type: EVENT_PENDING });
    return request(eventsQuery({ ...filter }, { ...paginate }, { ...sortBy }))
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
    return request(createMutation({ ...inputData }))
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