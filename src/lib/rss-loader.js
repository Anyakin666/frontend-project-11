import axios from 'axios';
import { parseRSS } from './parser/rss-parser.js';

const PROXY_URL = 'https://allorigins.hexlet.app/get';

export const loadRSS = (url) => {
  return axios.get(PROXY_URL, {
    params: {
      url: url,
      disableCache: true,
    },
    timeout: 10000, 
  })
    .then((response) => {
      if (!response.data || !response.data.contents) {
        throw new Error('Не удалось загрузить RSS поток');
      }
      
      return parseRSS(response.data.contents, url);
    });
};
