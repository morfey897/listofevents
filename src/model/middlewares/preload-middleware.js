import { STATUSES } from "../../enums";
import { fetchConfigActionCreator, fetchCategoriesActionCreator } from "../actions";
import { USER_SIGNED_IN, STORE_INIT, EVENT_INITED } from "../actions";

function preloadMiddleware({ dispatch, getState }) {
  return next => action => {
    switch (action.type) {
      case STORE_INIT: {
        const returnValue = next(action);
        const { user, config, events, categories } = getState();

        if (user.isLogged && (config.status == STATUSES.STATUS_NONE)) {
          fetchConfigActionCreator()(dispatch);
        }

        // const haveCateg = categories.list.map(({ _id }) => _id);
        // let preloadCategoryIds = events.list.map(({ category }) => category._id);
        // preloadCategoryIds = [...(new Set(preloadCategoryIds))].filter(id => haveCateg.indexOf(id) == -1);
        // if (preloadCategoryIds.length) {
        //   fetchCategoriesActionCreator({ ids: preloadCategoryIds })(dispatch);
        // }
        return returnValue;
      }
      case USER_SIGNED_IN: {
        const returnValue = next(action);
        const { user, config } = getState();
        if (user.isLogged && (config.status == STATUSES.STATUS_NONE)) {
          fetchConfigActionCreator()(dispatch);
        }
        return returnValue;
      }
      // case EVENT_INITED: {
      //   const returnValue = next(action);
      //   const { events, categories } = getState();
      //   const haveCateg = categories.list.map(({ _id }) => _id);
      //   let preloadCategoryIds = events.list.map(({ category }) => category._id);
      //   preloadCategoryIds = [...(new Set(preloadCategoryIds))].filter(id => haveCateg.indexOf(id) == -1);
      //   if (preloadCategoryIds.length) {
      //     fetchCategoriesActionCreator({ ids: preloadCategoryIds })(dispatch);
      //   }
      //   return returnValue;
      // }
    }
    return next(action);
  };
}

export default preloadMiddleware;