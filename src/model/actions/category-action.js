import i18n from 'i18next';
import { request } from "../../api";
import { ErrorEmitter } from "../../emitters";
import { ERRORTYPES } from "../../errors";

export const CATEGORY_PENDING = "category_pending";
export const CATEGORY_INITED = "category_inited";

export const CATEGORY_CREATING = "category_creating";
export const CATEGORY_CREATED = "category_created";

const _body = `
  _id,
  url,
  name{${i18n.language}},
  tags,
  description{${i18n.language}},
  images {
    _id,
    url
  }
`;

const categoriesQuery = `
query($ids: [String], $limit: Int) {
  result: getCategories(ids: $ids, paginate:{limit: $limit}){
    list{
      ${_body}
    },
    offset,
    total
  } 
}`;

const categoryQuery = `
query($id: String, $url: String) {
  category: getCategory(id:$id, url:$url) {
    ${_body}
  }
}`;

const createCategoryMutation = `
mutation($url: String!, $name: String!, $description: String!, $tags: [String], $images: [Upload]) {
  category: createCategory(url: $url, name:{${i18n.language}: $name}, description:{${i18n.language}: $description}, tags: $tags, images: $images) {
    ${_body}
  }
}`;

function processing(data) {
  return {
    ...data,
    name: data.name[i18n.language],
    description: data.description[i18n.language],
  };
}

export function fetchCategoriesActionCreator(inputData) {
  return (dispatch) => {
    dispatch({ type: CATEGORY_PENDING });
    return request(categoriesQuery, { ...inputData })
      .then(({ success, data, errorCode }) => {
        if (success) {
          dispatch({ type: CATEGORY_INITED, payload: { ...data.result, list: data.result.list.map(processing) } });
        } else {
          dispatch({ type: CATEGORY_INITED });
          ErrorEmitter.emit(ERRORTYPES.CATEGORY_INIT_ERROR, errorCode);
        }
      })
      .catch(() => {
        dispatch({ type: CATEGORY_INITED });
        ErrorEmitter.emit(ERRORTYPES.CATEGORY_INIT_ERROR);
      });
  };
}

export function createCategoryActionCreator(inputData, secretKey) {
  return (dispatch) => {
    dispatch({ type: CATEGORY_CREATING });
    return request(createCategoryMutation, { ...inputData })
      .then(({ success, data, errorCode }) => {
        if (success && data.category) {
          let category = { ...data.category };
          if (secretKey) {
            category.secretKey = secretKey;
          }
          dispatch({ type: CATEGORY_CREATED, payload: { list: [category].map(processing) } });
        } else {
          dispatch({ type: CATEGORY_CREATED, payload: { list: [] } });
          ErrorEmitter.emit(ERRORTYPES.CATEGORY_CREATE_ERROR, errorCode);
        }
      })
      .catch(() => {
        dispatch({ type: CATEGORY_CREATED, payload: { list: [] } });
        ErrorEmitter.emit(ERRORTYPES.CATEGORY_CREATE_ERROR);
      });
  };
}

export function fetchCategory(inputDAta) {
  return request(categoryQuery, { ...inputDAta })
    .then(({ success, data }) => {
      if (success && data.category) {
        let category = { ...data.category };
        return Promise.resolve({ categories: { list: [category].map(processing) } });
      } else {
        return Promise.resolve({});
      }
    })
    .catch(() => {
      return Promise.resolve({});
    });
}