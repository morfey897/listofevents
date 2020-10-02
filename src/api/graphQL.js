import axios from 'axios';
import { logRequestInterceptor, logResponseInterceptor } from './interceptors';

const FAIL = "fail";
const SUCCESS = "succes";

const axiosGraphQL = axios.create({
  baseURL: process.env.API_URL,
  headers: {},
});

axiosGraphQL.interceptors.request.use(logRequestInterceptor);
axiosGraphQL.interceptors.response.use(logResponseInterceptor);

const request = (query) => {
  return axiosGraphQL
          .post('', {query})
          .then(result => {
            let status, data;
            if (result.status === 200) {
              status = SUCCESS;
              data = result.data.data;
            } else {
              status = FAIL;
              data = {};
            }
            return {status, data, success: status === SUCCESS};
          })
          .catch(() => Promise.resolve({status: FAIL, data: {}, succes: false}));
};

export {
  FAIL,
  SUCCESS,
  request
};