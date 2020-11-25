import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enJson from "../../public/i18n/en.json";
import ruJson from "../../public/i18n/ru.json";

class I18nService {

  init() {
    return Promise.resolve();
  }

  run() {
    return new Promise((resolve, reject) => {
      i18n
        .use(LanguageDetector)
        .use(initReactI18next) // bind react-i18next to the instance
        .init({
          fallbackLng: 'ru',
          debug: true,
          lowerCaseLng: true,
          lng: 'ru',
          supportedLngs: ['ru'],
          nonExplicitSupportedLngs: true,

          resources: {
            // en: { ...enJson },
            ru: { ...ruJson },
          },

          ns: [...new Set([].concat(Object.keys(enJson)).concat(Object.keys(ruJson)))],
          interpolation: {
            escapeValue: false, // not needed for react!!
          },

          // react i18next special options (optional)
          // override if needed - omit if ok with defaults
          /*
          react: {
            bindI18n: 'languageChanged',
            bindI18nStore: '',
            transEmptyNodeValue: '',
            transSupportBasicHtmlNodes: true,
            transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
            useSuspense: true,
          }
          */
        }).then(() => {
          resolve({i18n});
        });
    });
  }
}

export default I18nService;