import { USER_SIGN_IN, USER_SIGN_OUT, USER_TIME_OUT, USER_UPDATE_STATE } from "../actions/user-action";
import store from "store2";
import { STATES, STORAGEKEYS } from "../../enums";

const initState = {
  state: STATES.STATE_NONE,
  errorCode: 0,
  isLogged: false,
  user: {
    id: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    role: 0,
  }
};

function getUser() {
  const expireIn = parseInt(store.get(STORAGEKEYS.JWT_EXPIRES_IN));
  const userStr = store.get(STORAGEKEYS.USER_STATE);
  const isLogged = !isNaN(expireIn) && parseInt(Date.now() / 1000) < expireIn;
  if (!isLogged || !userStr) return initState;

  let userLocalState = {};
  const userInitState = initState.user;
  try {
    userLocalState = JSON.parse(userStr);
  } catch (e) {
    return initState;
  }

  const user = {};
  for (let name in userInitState) {
    user[name] = typeof userLocalState[name] === typeof userInitState[name] ? userLocalState[name] : userInitState[name];
  }

  return {
    ...initState,
    state: STATES.STATE_READY,
    isLogged: true,
    user
  };
}

export function user(state = { ...getUser() }, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_UPDATE_STATE: {
      return {
        ...state,
        state: payload.state,
        errorCode: payload.errorCode
      };
    }
    case USER_SIGN_IN: {
      if (payload.state == STATES.STATE_READY) {
        store.set(STORAGEKEYS.USER_STATE, JSON.stringify(payload.user));
        store.set(STORAGEKEYS.JWT_ACCESS_TOKEN, payload.token.accessToken);
        store.set(STORAGEKEYS.JWT_EXPIRES_IN, payload.token.expiresIn);
        return {
          ...state,
          state: payload.state,
          errorCode: payload.errorCode,
          isLogged: true,
          user: payload.user
        };
      }
      return {
        ...state,
        state: payload.state,
        errorCode: payload.errorCode,
      };
    }
    case USER_SIGN_OUT:
      if (payload.state == STATES.STATE_READY) {
        store.set(STORAGEKEYS.USER_STATE, JSON.stringify(payload.user || {}));
        store.set(STORAGEKEYS.JWT_ACCESS_TOKEN, payload.token && payload.token.accessToken || "");
        store.set(STORAGEKEYS.JWT_EXPIRES_IN, payload.token && payload.token.expiresIn || 0);
        return {
          ...state,
          state: payload.state,
          errorCode: payload.errorCode,
          isLogged: false,
          user: payload.user,
        };
      }
      return {
        ...state,
        state: payload.state,
        errorCode: payload.errorCode,
      };
    case USER_TIME_OUT:
      store.set(STORAGEKEYS.JWT_ACCESS_TOKEN, "");
      store.set(STORAGEKEYS.JWT_EXPIRES_IN, 0);
      return {
        ...state,
        isLogged: false
      };
    default:
      return state;
  }
}