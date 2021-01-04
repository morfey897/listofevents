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
  name{ru},
  tags,
  description{ru},
  images {
    _id,
    url
  }
`;

const categoriesQuery = `
query($limit: Int) {
  result: getCategories(paginate:{limit: $limit}){
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
  category: createCategory(url: $url, name:{ru: $name}, description:{ru: $description}, tags: $tags, images: $images) {
    ${_body}
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
  return (dispatch) => {
    dispatch({ type: CATEGORY_PENDING });
    return request(categoriesQuery, { limit: 100 })
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