import { request } from "../../api/graphQL";
import { STATE_ERROR, STATE_LOADING, STATE_NONE, STATE_READY } from "../enums";

export const SAVE_CATEGORY = "save_category";
export const LOADED_CATEGORIES = "save_categories";
export const UPDATE_CATEGORIES_STATE = "update_categories_state";

const categoryQuery = (_id) => `query {
  category: getCategory(id:'${_id}') {
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

const categoriesQuery = () => `query {
  categories: getCategories{
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

export function fetchCategoryActionCreator(_id) {
  return (dispatch) => {
    return request(categoryQuery(_id)).then(({ success, data }) => success && dispatch({ type: SAVE_CATEGORY, payload: data.category }));
  };
}

export function fetchCategoriesActionCreator() {
  return (dispatch, getState) => {
    const { state } = getState().categories;
    if (state === STATE_NONE) {
      dispatch({ type: UPDATE_CATEGORIES_STATE, state: STATE_LOADING });
      return request(categoriesQuery()).then(({ success, data }) => success ? dispatch({ type: LOADED_CATEGORIES, state: STATE_READY, payload: data.categories }) : dispatch({ type: UPDATE_CATEGORIES_STATE, state: STATE_ERROR }));
    }
    return Promise.resolve();
  };
}