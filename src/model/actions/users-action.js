import { request } from "../../api";
import { STATES } from "../../enums";

export const USERS_LOADED = "users_loaded";
export const USERS_UPDATED = "users_updated";
export const USERS_DELETED = "users_deleted";
export const USERS_UPDATE_STATE = "users_update_state";

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
    dispatch({ type: USERS_UPDATE_STATE, payload: { state: STATES.STATE_LOADING } });
    return request(usersQuery(), dispatch)
      .then(({ success, data }) => {
        if (success) return data;
        throw new Error("Can't load");
      })
      .then(({ list }) => (list || []))
      .then((list) => dispatch({ type: USERS_LOADED, payload: { list, state: STATES.STATE_READY } }))
      .catch(() => {
        dispatch({ type: USERS_UPDATE_STATE, payload: { state: STATES.STATE_ERROR } });
      });
  };
}

export function updateUserActionCreator(id, role) {
  return (dispatch) => {
    dispatch({ type: USERS_UPDATE_STATE, payload: { state: STATES.STATE_UPDATING } });
    return request(updateUserQuery(id, role), dispatch)
      .then(({ success, data }) => {
        if (success) return data;
        throw new Error("Can't load");
      })
      .then(({ user }) => (user ? [user] : []))
      .then((list) => dispatch({ type: USERS_UPDATED, payload: { list, state: STATES.STATE_READY } }))
      .catch(() => {
        dispatch({ type: USERS_UPDATE_STATE, payload: { state: STATES.STATE_ERROR } });
      });
  };
}

export function deleteUsersActionCreator(ids) {
  return (dispatch) => {
    dispatch({ type: USERS_UPDATE_STATE, payload: { state: STATES.STATE_UPDATING } });
    return request(deleteUsersQuery(ids), dispatch)
      .then(({ success, data }) => {
        if (success) return data;
        throw new Error("Can't load");
      })
      .then(({ count }) => (count > 0 ? ids : []))
      .then((list) => dispatch({ type: USERS_DELETED, payload: { list, state: STATES.STATE_READY } }))
      .catch(() => {
        dispatch({ type: USERS_UPDATE_STATE, payload: { state: STATES.STATE_ERROR } });
      });
  };
}