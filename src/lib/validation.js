import yup from './yup-config.js';
import i18next from 'i18next';
import { actions } from './state.js';

const createRssUrlSchema = () => {
  return yup.string()
    .required()
    .url()
    .test('unique', i18next.t('errors.duplicate'), (value) => {
      return !actions.isUrlExists(value);
    });
};

export const validateRssUrl = (url) => {
  const schema = createRssUrlSchema();
  return schema.validate(url);
};
