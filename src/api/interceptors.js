export const logRequestInterceptor = (config) => {
  console.groupCollapsed(`Request: ${config.baseURL}/${config.url.split('?')[0]}`);
  config.url.split('?')[1] && console.info('%c get_params:', 'color:cyan', config.url.split('?')[1]);
  console.info('%c method:', 'color:cyan', `${config.method}`.toUpperCase());
  console.info('%c headers:', 'color:cyan', config.headers || {});
  console.info('%c data:', 'color:cyan', config.data || {});
  console.groupEnd();
  return config;
};

/* log response data */
export const logResponseInterceptor = (response) => {
  console.groupCollapsed(`Response: ${response.config.baseURL}/${response.config.url.split('?')[0]}`);
  response.config.url.split('?')[1] && console.info('%c get_params:', 'color:cyan', response.config.url.split('?')[1]);
  console.info('%c status:', 'color:cyan', `${response.status}`.toUpperCase());
  console.info('%c headers:', 'color:cyan', response.headers);
  console.info('%c data:', 'color:cyan', response.data || {});
  console.groupEnd();
  return response;
};