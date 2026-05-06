import i18next from 'i18next';
import resources from '../locales/index.js';

const initI18n = () => {
  return i18next.init({
    lng: 'ru',
    debug: false,
    resources,
    interpolation: {
      escapeValue: false,
    },
  });
};

export default initI18n;
