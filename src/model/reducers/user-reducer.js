import { USER_SIGN_IN, USER_SIGN_OUT, USER_TIME_OUT } from "../actions/user-action";
import store from "store2";
import { STATES, STORAGEKEYS } from "../../enums";

const initState = {
  id: 0,
  name: "",
  surname: "",
  email: "",
  phone: "",
  role: 0,
  isLogging: false
};

function getUser() {
  const userStr = store.get(STORAGEKEYS.USER_STATE);
  let user = {};
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      user = {};
    }
  }

  const state = {};
  for (let name in initState) {
    state[name] = typeof user[name] === typeof initState[name] ? user[name] : initState[name];
  }

  const expireIn = parseInt(store.get(STORAGEKEYS.JWT_EXPIRES_IN));
  return {
    ...state,
    isLogging: !isNaN(expireIn) && parseInt(Date.now() / 1000) < expireIn
  };
}

export function user(state = { ...getUser() }, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_SIGN_IN: {
      if (payload.state == STATES.STATE_READY) {
        store.set(STORAGEKEYS.USER_STATE, JSON.stringify(payload.user));
        store.set(STORAGEKEYS.JWT_ACCESS_TOKEN, payload.token.accessToken);
        store.set(STORAGEKEYS.JWT_EXPIRES_IN, payload.token.expiresIn);
        return {
          ...state,
          ...payload.user,
          isLogging: true,
        };
      }
      return {
        ...state,
      };
    }
    case USER_SIGN_OUT:
      if (payload.state == STATES.STATE_READY) {
        store.set(STORAGEKEYS.USER_STATE, JSON.stringify(payload.user || {}));
        store.set(STORAGEKEYS.JWT_ACCESS_TOKEN, payload.token && payload.token.accessToken || "");
        store.set(STORAGEKEYS.JWT_EXPIRES_IN, payload.token && payload.token.expiresIn || 0);
        return {
          ...payload.user,
          isLogging: false,
        };
      }
      return {
        ...state,
      };
    case USER_TIME_OUT:
      store.set(STORAGEKEYS.JWT_ACCESS_TOKEN, "");
      store.set(STORAGEKEYS.JWT_EXPIRES_IN, 0);
      return {
        ...state,
        isLogging: false,
      };
    default:
      return state;
  }
}