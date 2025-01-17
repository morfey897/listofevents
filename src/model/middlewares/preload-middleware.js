import { STATUSES } from "../../enums";
import { fetchConfigActionCreator } from "../actions";
import { USER_SIGNED_IN, STORE_INIT } from "../actions";

function preloadMiddleware({ dispatch, getState }) {
  return next => action => {
    switch (action.type) {
      case STORE_INIT:
      case USER_SIGNED_IN: {
        const returnValue = next(action);
        const { user, config } = getState();

        if (user.isLogged && (config.status == STATUSES.STATUS_NONE)) {
          fetchConfigActionCreator()(dispatch);
        }
        return returnValue;
      }
    }
    return next(action);
  };
}

export default preloadMiddleware;