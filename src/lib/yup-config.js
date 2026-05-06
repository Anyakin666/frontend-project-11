import * as yup from 'yup';
import i18next from 'i18next';

yup.setLocale({
  mixed: {
    required: () => i18next.t('errors.required'),
    notType: () => i18next.t('errors.url'),
  },
  string: {
    url: () => i18next.t('errors.url'),
    required: () => i18next.t('errors.required'),
  },
});

export default yup;
