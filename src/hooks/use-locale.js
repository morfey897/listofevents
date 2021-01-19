
import ruLocale from 'date-fns/locale/ru';
import ukLocale from 'date-fns/locale/uk';
import enLocale from 'date-fns/locale/en-US';

import { LANGS } from '../enums';
import { useEffect, useState } from 'react';

function getLocale(lang) {
  switch(lang) {
    case LANGS.UK: return ukLocale;
    case LANGS.RU: return ruLocale;
    default: return enLocale;
  }
}

function useLocale(i18n) {
  const [locale, setLocale] = useState(getLocale(i18n.language));

  useEffect(() => {
    setLocale(getLocale(i18n.language));
  }, [i18n, i18n.language]);

  return locale;
}

export default useLocale;