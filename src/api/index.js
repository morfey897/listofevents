import axios from 'axios';
import { encode } from 'js-base64';
import { logRequestInterceptor, logResponseInterceptor } from './interceptors';
import store from "store2";
import { STORAGEKEYS } from '../enums';
import { USER_TIME_OUT } from '../model/actions/user-action';

const basicToken = encode(process.env.BASIC_AUTH);

const FAIL = "fail";
const SUCCESS = "success";

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
    .then(result => {
      let status, data;
      if (result.status === 200) {
        status = SUCCESS;
        data = result.data.data;
      } else {
        status = FAIL;
        data = {};
      }
      return { status, data, success: status === SUCCESS };
    })
    .catch(() => Promise.resolve({ status: FAIL, data: {}, success: false }));
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
        return { status: SUCCESS, ...result.data };
      } else {
        throw new Error("Can't load");
      }
    })
    .catch(() => Promise.resolve({ status: FAIL, success: false }));
}

function signin({ username, password }) {
  return userAction('/signin', { username, password }, `Basic ${basicToken}`);
}

function signup(name, surname, email, phone, password) {
  return userAction('/signup', { name, surname, email, phone, password }, `Basic ${basicToken}`);
}

function signout() {
  return userAction('/signout', {}, `Bearer ${store.get(STORAGEKEYS.JWT_ACCESS_TOKEN)}`);
}

export {
  FAIL,
  SUCCESS,
  request,
  signin,
  signout,
  signup,
};