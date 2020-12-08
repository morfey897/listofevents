import { signin, signout, signup, rename } from "../../api";
import { ErrorEmitter } from "../../emitters";
import { ERRORTYPES } from "../../errors";

export const USER_PENDING = "user_pending";
export const USER_SIGNED_IN = "user_signed_in";
export const USER_SIGNED_OUT = "user_signed_out";
export const USER_UPDATE_ERROR = "user_update_error";

function actionCreator(params, successType, apiMethod) {
  return (dispatch) => {
    dispatch({ type: USER_PENDING });
    return apiMethod(params)
      .then(({ success, errorCode, data }) => {
        if (success) {
          dispatch({ type: successType, payload: { ...data } });
        } else {
          dispatch({ type: USER_UPDATE_ERROR });
          ErrorEmitter.emit(ERRORTYPES.USER_UPDATE_ERROR, errorCode);
        }
      })
      .catch(() => {
        dispatch({ type: USER_UPDATE_ERROR });
        ErrorEmitter.emit(ERRORTYPES.USER_UPDATE_ERROR);
      });
  };
}

export function signinActionCreator({ username, password }) {
  return actionCreator({ username, password }, USER_SIGNED_IN, signin);
}

export function signupActionCreator({ username, name, code, password }) {
  return actionCreator({ username, name, code, password }, USER_SIGNED_IN, signup);
}

export function renameActionCreator({ name, surname, phone, email, code, password }) {
  return actionCreator({ surname, name, phone, email, code, password }, USER_SIGNED_IN, rename);
}

export function signoutActionCreator() {
  return actionCreator({}, USER_SIGNED_OUT, signout);
}