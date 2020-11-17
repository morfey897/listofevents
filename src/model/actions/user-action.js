import { signin, signout, signup } from "../../api";
import { STATES } from "../../enums";

export const USER_SIGN_IN = "user_sign_in";
export const USER_SIGN_OUT = "user_sign_out";
export const USER_TIME_OUT = "user_time_out";

export function signinActionCreator({ username, password }) {
  return (dispatch) => signin({ username, password })
    .then(({ success, data }) => {
      if (success) return data;
      throw new Error("Can't loaded");
    })
    .then(({user, token}) => dispatch({ type: USER_SIGN_IN, payload: { user, token, state: STATES.STATE_READY } }))
    .catch(() => {
      dispatch({ type: USER_SIGN_IN, payload: { state: STATES.STATE_ERROR } });
    });
}

export function signupActionCreator({ name, surname, email, phone, password }) {
  return (dispatch) => signup({ name, surname, email, phone, password })
    .then(({ success, data }) => {
      if (success) return data;
      throw new Error("Can't loaded");
    })
    .then(({user, token}) => dispatch({ type: USER_SIGN_IN, payload: { user, token, state: STATES.STATE_READY } }))
    .catch(() => {
      dispatch({ type: USER_SIGN_IN, payload: { state: STATES.STATE_ERROR } });
    });
}

export function signoutActionCreator() {
  return (dispatch) => signout()
    .then(({ success, data }) => {
      if (success) return data;
      throw new Error("Can't loaded");
    })
    .then(({user, token}) => dispatch({ type: USER_SIGN_OUT, payload: { user, token, state: STATES.STATE_READY } }))
    .catch(() => {
      dispatch({ type: USER_SIGN_OUT, payload: { state: STATES.STATE_ERROR } });
    });
}