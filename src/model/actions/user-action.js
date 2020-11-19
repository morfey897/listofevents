import { signin, signout, signup } from "../../api";
import { STATES } from "../../enums";

export const USER_UPDATE_STATE = "user_update_state";
export const USER_SIGN_IN = "user_sign_in";
export const USER_SIGN_OUT = "user_sign_out";
export const USER_TIME_OUT = "user_time_out";

function actionCreator(params, apiMethod) {
  return (dispatch) => {
    dispatch({ type: USER_UPDATE_STATE, payload: { state: STATES.STATE_LOADING } });
    return apiMethod(params)
      .then(({ success, data }) => {
        if (success) return data;
        throw new Error("Can't loaded");
      })
      .then(({ user, token }) => dispatch({ type: USER_SIGN_IN, payload: { user, token, state: STATES.STATE_READY } }))
      .catch(() => {
        dispatch({ type: USER_SIGN_IN, payload: { state: STATES.STATE_ERROR } });
      });
  };
}

export function signinActionCreator({ username, password }) {
  return actionCreator({ username, password }, signin);
}

export function signupActionCreator({ name, surname, email, phone, password }) {
  return actionCreator({ name, surname, email, phone, password }, signup);
}

export function signoutActionCreator() {
  return actionCreator({ }, signout);
}