import { request } from "../../api";
import { ErrorEmitter } from "../../emitters";
import { ERRORTYPES } from "../../errors";

export const CATEGORY_PENDING = "category_pending";
export const CATEGORY_INITED = "category_inited";
export const CATEGORY_UPDATING = "category_updating";

export const CATEGORY_UPDATED = "category_updated";
export const CATEGORY_CREATING = "category_creating";
export const CATEGORY_CREATED = "category_created";

const _body = `
  _id,
  url,
  name{{{LOCALE}}},
  tags,
  description{{{LOCALE}}},
  images {
    _id,
    url
  }
`;

const categoriesQuery = `
query($ids: [String], $limit: Int, $sortBy: String, $sort: Int) {
  result: getCategories(ids: $ids, paginate:{limit: $limit}, sortBy:{field: $sortBy, sort: $sort}){
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
  category: createCategory(url: $url, name:{{{LOCALE}}: $name}, description:{{{LOCALE}}: $description}, tags: $tags, images: $images) {
    ${_body}
  }
}`;

const updateCategoryMutation = `
mutation($_id: String!, $url: String!, $name: String!, $description: String!, $tags: [String], $images: [String], $add_images: [Upload]) {
  category: updateCategory(_id: $_id, url: $url, name:{{{LOCALE}}: $name}, description:{{{LOCALE}}: $description}, tags: $tags, images: $images, add_images: $add_images) {
    ${_body}
  }
}`;

function processing(data) {
  return {
    ...data,
    name: Object.values(data.name)[0],
    description: Object.values(data.description)[0],
  };
}

export function fetchCategoriesActionCreator(paginate = { limit: 0, offset: 0 }, sortBy = { sortBy: "updated_at", sort: -1 }) {
  return (dispatch) => {
    dispatch({ type: CATEGORY_PENDING });
    return request(categoriesQuery, { ...paginate, ...sortBy })
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

export function updateCategoryActionCreator(inputData) {
  return (dispatch) => {
    dispatch({ type: CATEGORY_UPDATING });
    return request(updateCategoryMutation, { ...inputData })
      .then(({ success, data, errorCode }) => {
        if (success && data.category) {
          let category = { ...data.category };
          dispatch({ type: CATEGORY_UPDATED, payload: { list: [category].map(processing) } });
        } else {
          dispatch({ type: CATEGORY_UPDATED, payload: { list: [] } });
          ErrorEmitter.emit(ERRORTYPES.CATEGORY_UPDATE_ERROR, errorCode);
        }
      })
      .catch(() => {
        dispatch({ type: CATEGORY_UPDATED, payload: { list: [] } });
        ErrorEmitter.emit(ERRORTYPES.CATEGORY_UPDATE_ERROR);
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