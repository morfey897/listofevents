import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import ruJson from "../../static/i18n/ru.json";
import ukJson from "../../static/i18n/uk.json";
import Service from "./service";

import { LANGS } from "../enums";

class I18nService extends Service {

  run() {
    return new Promise((resolve, reject) => {
      i18n
        // .use(LanguageDetector)
        .use(initReactI18next) // bind react-i18next to the instance
        .init({
          fallbackLng: LANGS.UK,
          debug: process.env.DEBUG === "true",
          lowerCaseLng: true,
          lng: LANGS.RU,
          supportedLngs: [LANGS.UK, LANGS.RU],
          nonExplicitSupportedLngs: true,

          resources: {
            [LANGS.UK]: { ...ukJson },
            [LANGS.RU]: { ...ruJson },
          },

          ns: [...new Set([].concat(Object.keys(ruJson)))],
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
          resolve({ [this.name]: i18n });
        });
    });
  }
}

export default I18nService;