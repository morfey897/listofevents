import axios from 'axios';

const axiosGraphQL = axios.create({
  baseURL: process.env.API_URL,
  headers: {},
});

const request = (query) => {
  return axiosGraphQL
          .post('', {query})
          .then(result => ({status: result.status === 200 ? 'success' : 'fail', data: result.status === 200 ? result.data.data : {}}))
          .catch(() => Promise.resolve({status: "fail", data: {}}));
};

export {
  request
};