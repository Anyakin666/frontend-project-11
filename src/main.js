import './style.css';
import RSSReader from './lib/rss-reader.js';

document.addEventListener('DOMContentLoaded', () => {
  new RSSReader();
});
