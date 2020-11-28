import { signin, signout, signup, rename } from "../../api";
import { ERRORCODES } from "../../enums";

export const USER_PENDING = "user_pending";
export const USER_SIGNED_IN = "user_signed_in";
export const USER_SIGNED_OUT = "user_signed_out";
export const USER_SIGN_IN_ERROR = "user_sign_in_error";
export const USER_SIGN_OUT_ERROR = "user_sign_out_error";

export const USER_RENAMED = "user_renamed";
export const USER_RENAME_ERROR = "user_rename_error";

export const USER_RESET_STATUS = "user_reset_status";

function actionCreator(params, successType, errorType, apiMethod) {
  return (dispatch) => {
    dispatch({ type: USER_PENDING });
    return apiMethod(params)
      .then(({ success, errorCode, data }) => {
        if (success) {
          dispatch({ type: successType, payload: { ...data } });
        } else {
          dispatch({ type: errorType, payload: { errorCode } });
        }
      })
      .catch(() => dispatch({ type: errorType, payload: { errorCode: ERRORCODES.ERROR_WRONG } }));
  };
}

export function signinActionCreator({ username, password }) {
  return actionCreator({ username, password }, USER_SIGNED_IN, USER_SIGN_IN_ERROR, signin);
}

export function signupActionCreator({ username, name, code, password }) {
  return actionCreator({ username, name, code, password }, USER_SIGNED_IN, USER_SIGN_IN_ERROR, signup);
}

export function renameActionCreator({ name, surname, phone, email, code, password }) {
  return actionCreator({ surname, name, phone, email, code, password }, USER_RENAMED, USER_RENAME_ERROR, rename);
}

export function resetUserStatusActionCreator() {
  return (dispatch) => {
    dispatch({ type: USER_RESET_STATUS });
  };
}

export function signoutActionCreator() {
  return actionCreator({}, USER_SIGNED_OUT, USER_SIGN_OUT_ERROR, signout);
}