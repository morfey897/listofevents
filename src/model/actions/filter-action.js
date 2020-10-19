import { request } from "../../api/graphQL";
import { STATE_ERROR, STATE_LOADING, STATE_NONE, STATE_READY } from "../../enums/states";

export const CHANGE_VIEW = "filter_view";
export const CHANGE_DATE = "filter_date";
export const TOGGLE_CATEGORY_ID = "filter_togle_category_id";
export const TOGGLE_CITY_ID = "filter_toggle_city_id";
export const TOGGLE_TAG_ID = "filter_toggle_tag_id";

export function filterViewActionCreator(view) {
  return (dispatch) => {
    return dispatch({ type: CHANGE_VIEW, payload: {view} });
  };
}

export function filterDatesActionCreator(num) {
  return (dispatch) => {
    return dispatch({ type: CHANGE_DATE, payload: {num} });
  };
}

export function filterToggleCityIdActionCreator(city_id) {
  return (dispatch) => {
    return dispatch({ type: TOGGLE_CITY_ID, payload: {city_id} });
  };
}

export function filterToggleCategoryIdActionCreator(category_id) {
  return (dispatch) => {
    return dispatch({ type: TOGGLE_CATEGORY_ID, payload: {category_id} });
  };
}

export function filterToggleTagIdActionCreator(tags_id) {
  return (dispatch) => {
    return dispatch({ type: TOGGLE_TAG_ID, payload: {tags_id} });
  };
}