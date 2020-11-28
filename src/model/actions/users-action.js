import { request } from "../../api";

export const USERS_PENDING = "users_pending";
export const USERS_INITED = "users_inited";
export const USERS_ERROR = "users_error";
export const USERS_DELETED = "users_deleted";

export const USERS_UPDATING = "users_updating";
export const USERS_UPDATED = "users_updated";
export const USERS_UPDATE_ERROR = "users_update_error";

const usersQuery = () => `query {
  list: getUsers {
    _id,
    email,
    phone,
    name,
    surname,
    role
  }
}`;

const updateUserQuery = (id, role) => `mutation {
  user: updateUser(id:"${id}", role:${role}) {
    _id,
    email,
    phone,
    name,
    surname,
    role
  }
}`;

const deleteUsersQuery = (ids) => `mutation {
  count: deleteUser(ids:${JSON.stringify(ids)})
}`;

export function fetchUsersActionCreator() {
  return (dispatch) => {
    dispatch({ type: USERS_PENDING });
    return request(usersQuery())
      .then(({ success, data }) => {
        if (success) return data;
        throw new Error("Can't load");
      })
      .then(({ list }) => (list || []))
      .then((list) => dispatch({ type: USERS_INITED, payload: { list } }))
      .catch(() => {
        dispatch({ type: USERS_ERROR });
      });
  };
}

export function updateUserActionCreator(id, role) {
  return (dispatch) => {
    dispatch({ type: USERS_UPDATING, payload: { list: [id] } });
    return request(updateUserQuery(id, role))
      .then(({ success, data }) => {
        if (success) return data;
        throw new Error("Something wrong");
      })
      .then(({ user }) => (user ? [user] : []))
      .then((list) => dispatch({ type: USERS_UPDATED, payload: { list } }))
      .catch(() => {
        dispatch({ type: USERS_UPDATE_ERROR, payload: { list: [id] } });
      });
  };
}

export function deleteUsersActionCreator(ids) {
  return (dispatch) => {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    dispatch({ type: USERS_UPDATING, payload: { list: ids } });
    return request(deleteUsersQuery(ids))
      .then(({ success, data }) => {
        if (success) return data;
        throw new Error("Something wrong");
      })
      .then(({ count }) => (count > 0 ? ids : []))
      .then((list) => dispatch({ type: USERS_DELETED, payload: { list } }))
      .catch((e) => {
        dispatch({ type: USERS_UPDATE_ERROR, payload: { list: ids } });
      });
  };
}