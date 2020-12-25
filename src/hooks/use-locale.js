
import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-US';

import { LANGS } from '../enums';
import { useEffect, useState } from 'react';

function getLocale(lang) {
  let loc = enLocale;
  if (lang === LANGS.RU) {
    loc = ruLocale;
  }
  return loc;
}

function useLocale(i18n) {
  const [locale, setLocale] = useState(getLocale(i18n.language));

  useEffect(() => {
    setLocale(getLocale(i18n.language));
  }, [i18n, i18n.language]);

  return locale;
}

export default useLocale;