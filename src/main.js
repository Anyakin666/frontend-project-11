import './style.css';
import initI18n from './lib/i18n.js';
import RSSReader from './lib/rss-reader.js';

initI18n()
  .then(() => {
    console.log('i18next initialized');
    document.addEventListener('DOMContentLoaded', () => {
      new RSSReader();
    });
  })
  .catch((error) => {
    console.error('Failed to initialize i18next:', error);
  });
