import I18nService from "./i18n-service";
import StoreService from "./store-service";

const microServices = [
  new I18nService(),  
  new StoreService()
];

export const initServices = () => {
  return Promise.all([].concat(microServices).map(s => s.init()));
};

export const runServices = () => {
  return Promise.all([].concat(microServices).map(s => s.run()));
};