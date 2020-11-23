import { signin, signout, signup } from "../../api";
import { ERRORCODES, STATES } from "../../enums";

export const USER_UPDATE_STATE = "user_update_state";
export const USER_SIGN_IN = "user_sign_in";
export const USER_SIGN_OUT = "user_sign_out";
export const USER_TIME_OUT = "user_time_out";

function actionCreator(params, dispatchType, apiMethod) {
  return (dispatch) => {
    dispatch({ type: USER_UPDATE_STATE, payload: { state: STATES.STATE_LOADING, errorCode: 0 } });
    return apiMethod(params)
      .then(({ success, errorCode, data }) => {
        if (success) {
          dispatch({ type: dispatchType, payload: { user: data.user, token: data.token, state: STATES.STATE_READY, errorCode: 0 } });
        } else {
          dispatch({ type: dispatchType, payload: { state: STATES.STATE_ERROR, errorCode } });
        }
      })
      .catch(() => dispatch({ type: dispatchType, payload: { state: STATES.STATE_ERROR, errorCode: ERRORCODES.ERROR_WRONG } }));
  };
}

export function signinActionCreator({ username, password }) {
  return actionCreator({ username, password }, USER_SIGN_IN, signin);
}

export function signupActionCreator({ username, name, code, password }) {
  return actionCreator({ username, name, code, password }, USER_SIGN_IN, signup);
}

export function signoutActionCreator() {
  return actionCreator({}, USER_SIGN_OUT, signout);
}