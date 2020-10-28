import { request } from "../../api/graphQL";
import { STATES } from "../../enums";

export const CATEGORY_LOADED = "category_loaded";
export const CATEGORY_UPDATE_STATE = "category_update_state";

const categoriesQuery = () => `query {
  list: getCategories{
    _id,
    url,
    name{ru, en}
    tags{
      _id,
      label
    },
    description{ru, en}
    images {
      _id,
      url
    }
  } 
}`;

function processing(data) {
  return {
    ...data,
    name: data.name.ru,
    description: data.description.ru,
  };
}

export function fetchCategoriesActionCreator() {
  return (dispatch, getState) => {
    const { state } = getState().categories;
    if (state === STATES.STATE_NONE) {
      dispatch({ type: CATEGORY_UPDATE_STATE, payload: {state: STATES.STATE_LOADING} });
      return request(categoriesQuery())
              .then(({ success, data }) => {
                if (success) return data;
                throw new Error("Can't load");
              })
              .then(({list}) => list.map(processing))
              .then((list) => dispatch({ type: CATEGORY_LOADED, payload: {list, state: STATES.STATE_READY} }))
              .catch(() => {
                dispatch({ type: CATEGORY_UPDATE_STATE, payload: {state: STATES.STATE_ERROR} });
              });
    }
    return Promise.resolve();
  };
}