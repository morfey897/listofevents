import { request } from "../../api";
import { ErrorEmitter } from "../../emitters";
import { ERRORTYPES } from "../../errors";

export const CATEGORY_PENDING = "category_pending";
export const CATEGORY_INITED = "category_inited";

export const CATEGORY_CREATING = "category_creating";
export const CATEGORY_CREATED = "category_created";

const categoriesQuery = () => `query {
  result: getCategories(paginate:{limit:100}){
    list{
      _id,
      url,
      name{ru},
      tags,
      description{ru},
      images {
        _id,
        url
      }
    },
    offset,
    total
  } 
}`;

const createMutation = ({ url, name, description = "", tags = [] }) => `mutation {
  category: createCategory(url:"${url}", name:{ru:"${name}"}, description:{ru:"${description}"}, tags:${JSON.stringify(tags)}) {
    _id,
    url,
    name{ru},
    tags,
    description{ru},
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
  return (dispatch) => {
    dispatch({ type: CATEGORY_PENDING });
    return request(categoriesQuery())
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
    return request(createMutation({ ...inputData }))
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