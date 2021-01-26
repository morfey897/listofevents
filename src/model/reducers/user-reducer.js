import { USER_SIGNED_IN, USER_SIGNED_OUT, USER_PENDING, USER_ACTION_ERROR } from "../actions/user-action";
import store from "store2";
import { STATUSES, STORAGEKEYS } from "../../enums";

const initState = {
  status: STATUSES.STATUS_NONE,
  isLogged: false,
  user: {
    _id: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    facebook: {},
    instagram: {},
    google: {},
    role: 0,
  }
};

function getUser() {
  const expireIn = parseInt(store.get(STORAGEKEYS.JWT_EXPIRES_IN));
  const userStr = store.get(STORAGEKEYS.USER_STATE);
  const isLogged = !isNaN(expireIn) && parseInt(Date.now() / 1000) < expireIn;

  if (!isLogged || !userStr) return initState;

  let userLocalState = {};
  try {
    userLocalState = JSON.parse(userStr);
  } catch (e) {
    return initState;
  }

  const user = {};
  const userInitState = { ...initState.user };
  for (let name in userInitState) {
    user[name] = typeof userLocalState[name] === typeof userInitState[name] ? userLocalState[name] : userInitState[name];
  }

  return {
    ...initState,
    status: STATUSES.STATUS_SUCCESS,
    isLogged: true,
    user
  };
}

export function user(state = { ...getUser() }, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_PENDING: {
      return {
        ...state,
        status: STATUSES.STATUS_PENDING,
      };
    }
    case USER_ACTION_ERROR:
      return {
        ...state,
        status: STATUSES.STATUS_SUCCESS,
      };
    case USER_SIGNED_IN: {
      store.set(STORAGEKEYS.USER_STATE, JSON.stringify(payload.user));
      store.set(STORAGEKEYS.JWT_ACCESS_TOKEN, payload.token.accessToken);
      store.set(STORAGEKEYS.JWT_EXPIRES_IN, payload.token.expiresIn);
      return {
        ...state,
        status: STATUSES.STATUS_SUCCESS,
        isLogged: true,
        user: payload.user
      };
    }
    case USER_SIGNED_OUT:
      store.set(STORAGEKEYS.USER_STATE, JSON.stringify(payload.user || {}));
      store.set(STORAGEKEYS.JWT_ACCESS_TOKEN, payload.token && payload.token.accessToken || "");
      store.set(STORAGEKEYS.JWT_EXPIRES_IN, payload.token && payload.token.expiresIn || 0);
      return {
        ...state,
        status: STATUSES.STATUS_NONE,
        isLogged: false,
        user: payload.user,
      };
    default:
      return state;
  }
}