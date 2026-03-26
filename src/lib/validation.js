import * as yup from 'yup';

const rssUrlSchema = yup.string()
  .required('Не должно быть пустым')
  .url('Ссылка должна быть валидным URL');

export const validateRssUrl = (url, existingUrls) => {
  return rssUrlSchema.validate(url)
    .then((validUrl) => {
      if (existingUrls.includes(validUrl)) {
        throw new Error('RSS уже добавлен');
      }
      return validUrl;
    });
};
