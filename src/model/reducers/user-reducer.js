import { USER_SIGNED_IN, USER_SIGNED_OUT, USER_PENDING, USER_SIGN_IN_ERROR, USER_SIGN_OUT_ERROR, USER_RENAME_ERROR, USER_RENAMED, USER_RESET_STATUS } from "../actions/user-action";
import store from "store2";
import { STATUSES, STORAGEKEYS } from "../../enums";

const initState = {
  status: STATUSES.STATUS_NONE,
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
    status: STATUSES.STATUS_INITED,
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
        errorCode: 0
      };
    }
    case USER_SIGN_IN_ERROR:
    case USER_SIGN_OUT_ERROR:
    case USER_RENAME_ERROR:
      return {
        ...state,
        status: STATUSES.STATUS_ERROR,
        errorCode: payload.errorCode,
      };
    case USER_RENAMED:
    case USER_SIGNED_IN: {
      store.set(STORAGEKEYS.USER_STATE, JSON.stringify(payload.user));
      store.set(STORAGEKEYS.JWT_ACCESS_TOKEN, payload.token.accessToken);
      store.set(STORAGEKEYS.JWT_EXPIRES_IN, payload.token.expiresIn);
      return {
        ...state,
        status: type === USER_SIGNED_IN ? STATUSES.STATUS_INITED : STATUSES.STATUS_UPDATED,
        errorCode: 0,
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
        errorCode: 0,
        isLogged: false,
        user: payload.user,
      };
    case USER_RESET_STATUS:
      return {
        ...state,
        status: state.isLogged ? STATUSES.STATUS_INITED : STATUSES.STATUS_NONE,
      };
    default:
      return state;
  }
}