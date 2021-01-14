import axios from 'axios';
import { encode } from 'js-base64';
import { logRequestInterceptor, logResponseInterceptor } from './interceptors';
import store from "store2";
import { STORAGEKEYS } from '../enums';
import { ERRORCODES } from "../errors";

const basicToken = encode(process.env.BASIC_AUTH);

const axiosInstance = axios.create({
  baseURL: process.env.API_URL
});

axiosInstance.interceptors.request.use(logRequestInterceptor);
axiosInstance.interceptors.response.use(logResponseInterceptor);

function request(query, variables) {
  const files = [];
  for (let n in variables) {
    let v = variables[n];
    if (v instanceof File) {
      files.push({ name: `variables.${n}`, file: v });
      variables[n] = null;
    } else if (Array.isArray(v)) {
      for (let i = 0; i < v.length; i++) {
        let f = v[i];
        if (f instanceof File) {
          files.push({ name: [`variables.${n}.${i}`], file: f });
          v[i] = null;
        }
      }
    }
  }

  let contentType = "application/json";
  let data = { query, variables };
  if (files.length) {
    contentType = "multipart/form-data";
    data = new FormData();
    data.append("operations", JSON.stringify({ query, variables }));
    data.append("map", JSON.stringify(files.reduce((prev, { name }, index) => {
      prev[index] = name;
      return prev;
    }, {})));
    files.forEach(({ file }, i) => {
      data.append(String(i), file);
    });
  }

  let expiresIn = parseInt(store.get(STORAGEKEYS.JWT_EXPIRES_IN));
  return axiosInstance
    .post('api/graphql', data, {
      headers: {
        'Content-Type': contentType,
        Authorization: expiresIn > 0 ? `Bearer ${store.get(STORAGEKEYS.JWT_ACCESS_TOKEN)}` : `Basic ${basicToken}`
      }
    })
    .then(({ status, data }) => {
      if (status === 200 && (!data.errors || !data.errors.length)) {
        return { data: data.data, success: true };
      } else {
        return { success: false, data: {}, errorCode: data.errors[0].errorCode };
      }
    })
    .catch(() => ({ success: false, data: {}, errorCode: ERRORCODES.ERROR_WRONG }));
}

function config() {
  return axiosInstance
    .get("api/config", {
      headers: {
        Authorization: `Basic ${basicToken}`,
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

function userAction(url, data, Authorization) {
  return axiosInstance
    .post(`oauth/${url}`, data, {
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

function signin(data) {
  return userAction('signin', data, `Basic ${basicToken}`);
}

function signup(data) {
  return userAction('signup', data, `Basic ${basicToken}`);
}

function signout(data) {
  return userAction('signout', data, `Bearer ${store.get(STORAGEKEYS.JWT_ACCESS_TOKEN)}`);
}

function rename(data) {
  return userAction('rename', data, `Bearer ${store.get(STORAGEKEYS.JWT_ACCESS_TOKEN)}`);
}

function outhcode(data) {
  return userAction('outhcode', data, `Basic ${basicToken}`);
}

export {
  request,
  signin,
  signout,
  signup,
  rename,
  outhcode,
  config
};