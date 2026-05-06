import yup from './yup-config.js';
import i18next from 'i18next';

const createRssUrlSchema = (existingUrls) => {
  return yup.string()
    .required()
    .url()
    .test('unique', i18next.t('errors.duplicate'), (value) => {
      return !existingUrls.includes(value);
    });
};

export const validateRssUrl = (url, existingUrls) => {
  const schema = createRssUrlSchema(existingUrls);
  return schema.validate(url);
};
