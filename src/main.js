import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.css';
import initI18n from './lib/i18n.js';
import RSSReader from './lib/rss-reader.js';
import { stopUpdater } from './lib/updater.js';

let app = null;

initI18n()
  .then(() => {
    document.addEventListener('DOMContentLoaded', () => {
      app = new RSSReader();
    });
  })
  .catch((error) => {
    console.error('Failed to initialize i18next:', error);
  });

window.addEventListener('beforeunload', () => {
  stopUpdater();
});
