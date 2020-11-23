import axios from 'axios';
import { encode } from 'js-base64';
import { logRequestInterceptor, logResponseInterceptor } from './interceptors';
import store from "store2";
import { ERRORCODES, STORAGEKEYS } from '../enums';
import { USER_TIME_OUT } from '../model/actions/user-action';

const basicToken = encode(process.env.BASIC_AUTH);

const axiosInstance = axios.create({
  baseURL: process.env.API_URL
});

axiosInstance.interceptors.request.use(logRequestInterceptor);
axiosInstance.interceptors.response.use(logResponseInterceptor);

function request(query, dispatch) {

  let expiresIn = parseInt(store.get(STORAGEKEYS.JWT_EXPIRES_IN));
  if (isNaN(expiresIn)) {
    expiresIn = 0;
  } else if (parseInt(Date.now() / 1000) >= expiresIn) {
    expiresIn = 0;
    if (typeof dispatch === "function") {
      dispatch({ type: USER_TIME_OUT });
    }
    if (/^mutation/.test(query)) {
      //todo need open wnd login
    }
  }

  return axiosInstance
    .post('/api/graphql', { query }, {
      headers: {
        Authorization: expiresIn > 0 ? `Bearer ${store.get(STORAGEKEYS.JWT_ACCESS_TOKEN)}` : `Basic ${basicToken}`
      }
    })
    .then(({status, data}) => {
      if (status === 200) {
        return { data: data.data, success: true };
      } 
      throw new Error("Can't load");
    })
    .catch(() => Promise.resolve({ data: {}, success: false }));
}

function userAction(url, data, Authorization) {
  return axiosInstance
    .post(`/oauth${url}`, data, {
      headers: {
        Authorization
      }
    })
    .then(result => {
      if (result.data.success) {
        return { success: true, data: result.data.data };
      } else {
        return { success: false, data: {}, errorCode: result.data.errorCode };
      }
    })
    .catch(() => ({ success: false, data: {}, errorCode: ERRORCODES.ERROR_WRONG }));
}

function signin({ username, password }) {
  return userAction('/signin', { username, password }, `Basic ${basicToken}`);
}

function signup({ username, name, code, password }) {
  return userAction('/signup', { name, username, code, password }, `Basic ${basicToken}`);
}

function signout() {
  return userAction('/signout', {}, `Bearer ${store.get(STORAGEKEYS.JWT_ACCESS_TOKEN)}`);
}

function outhcode({ username }) {
  return userAction('/outhcode', { username, isNew: true }, `Basic ${basicToken}`);
}

export {
  request,
  signin,
  signout,
  signup,
  outhcode,
};