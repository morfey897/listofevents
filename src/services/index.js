import I18nService from "./i18n-service";
import UrlCheckService from "./urlcheck-service";
import StoreService from "./store-service";

const collectData = (list) => list.reduce((prev, obj) => {
  for (let name in obj) {
    prev[name] = obj[name];
  }
  return prev;
}, {});

export const runServices = () => {
  return Promise.all([new I18nService("i18n")].map(s => s.run()))
    .then((result) => {
      const data = collectData(result);
      return Promise.all([new UrlCheckService("checkData")].map(s => s.run()));
    })
    .then(result => {
      const data = collectData(result);
      return Promise.all([new StoreService("store", data["checkData"])].map(s => s.run()));
    })
    .then(result => Promise.resolve(collectData(result)));
};