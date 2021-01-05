import { request } from "../../api";
import { ErrorEmitter } from "../../emitters";
import { ERRORTYPES } from "../../errors";

export const USERS_PENDING = "users_pending";
export const USERS_INITED = "users_inited";

export const USERS_UPDATING = "users_updating";
export const USERS_DELETED = "users_deleted";
export const USERS_UPDATED = "users_updated";
export const USERS_UPDATE_ERROR = "users_updated_error";

const usersQuery = `
query {
  list: getUsers {
    _id,
    email,
    phone,
    name,
    surname,
    role
  }
}`;

const updateUserQuery = `
mutation($id: String, $role: Int) {
  user: updateUser(id: $id, role: $role) {
    _id,
    email,
    phone,
    name,
    surname,
    role
  }
}`;

const deleteUsersQuery = `
mutation($ids: [String]) {
  count: deleteUser(ids: $ids)
}`;

export function fetchUsersActionCreator() {
  return (dispatch) => {
    dispatch({ type: USERS_PENDING });
    return request(usersQuery, {})
      .then(({ success, data, errorCode }) => {
        if (success) {
          dispatch({ type: USERS_INITED, payload: { list: data.list } });
        } else {
          dispatch({ type: USERS_INITED, payload: { list: [] } });
          ErrorEmitter.emit(ERRORTYPES.USERS_INIT_ERROR, errorCode);
        }
      })
      .catch(() => {
        dispatch({ type: USERS_INITED, payload: { list: [] } });
        ErrorEmitter.emit(ERRORTYPES.USERS_INIT_ERROR);
      });
  };
}

export function updateUserActionCreator(id, role) {
  return (dispatch) => {
    dispatch({ type: USERS_UPDATING, payload: { list: [id] } });
    return request(updateUserQuery, { id, role })
      .then(({ success, data, errorCode }) => {
        if (success) {
          dispatch({ type: USERS_UPDATED, payload: { list: data.user ? [data.user] : [] } });
        } else {
          dispatch({ type: USERS_UPDATE_ERROR, payload: { list: [id] } });
          ErrorEmitter.emit(ERRORTYPES.USERS_DELETE_ERROR, errorCode);
        }
      })
      .catch(() => {
        dispatch({ type: USERS_UPDATE_ERROR, payload: { list: [id] } });
        ErrorEmitter.emit(ERRORTYPES.USERS_DELETE_ERROR);
      });
  };
}

export function deleteUsersActionCreator(ids) {
  return (dispatch) => {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    dispatch({ type: USERS_UPDATING, payload: { list: ids } });
    return request(deleteUsersQuery, { ids })
      .then(({ success, data, errorCode }) => {
        if (success) {
          dispatch({ type: USERS_DELETED, payload: { list: data.count > 0 ? ids : [] } });
        } else {
          dispatch({ type: USERS_UPDATE_ERROR, payload: { list: ids } });
          ErrorEmitter.emit(ERRORTYPES.USERS_UPDATE_ERROR, errorCode);
        }
      })
      .catch(() => {
        dispatch({ type: USERS_UPDATE_ERROR, payload: { list: ids } });
        ErrorEmitter.emit(ERRORTYPES.USERS_UPDATE_ERROR);
      });
  };
}