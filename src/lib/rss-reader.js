import i18next from 'i18next';
import { validateRssUrl } from './validation.js';
import { loadRSS } from './rss-loader.js';
import { state, actions } from './state.js';
import { renderFeeds, renderPosts } from './view.js';
import { startUpdater, stopUpdater } from './updater.js';

class RSSReader {
  constructor() {
    this.init();
  }

  init() {
    const form = document.getElementById('rss-form');
    const urlInput = document.getElementById('url-input');
    
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleSubmit();
      });
    }
    
    if (urlInput) {
      urlInput.addEventListener('input', (e) => {
        actions.setCurrentUrl(e.target.value);
        this.clearInputError();
      });
      
      actions.setCurrentUrl(urlInput.value);
    }
    
    this.updateUIWithTranslations();
    
    renderFeeds();
    renderPosts();
    
    if (state.feeds.length > 0) {
      startUpdater();
    }
  }

  updateUIWithTranslations() {
    const title = document.querySelector('h1');
    const subtitle = document.querySelector('.subtitle');
    const label = document.querySelector('label[for="url-input"]');
    const button = document.querySelector('#rss-form button');
    const placeholder = document.querySelector('#url-input');
    const example = document.querySelector('.example');
    
    if (title) title.textContent = i18next.t('app.title');
    if (subtitle) subtitle.textContent = i18next.t('app.subtitle');
    if (label) label.textContent = i18next.t('form.label');
    if (button) button.textContent = i18next.t('form.button');
    if (placeholder) placeholder.placeholder = i18next.t('form.placeholder');
    if (example) example.textContent = i18next.t('form.example');
  }

  handleSubmit() {
    const url = state.currentUrl.trim();
    
    if (!url) {
      this.showInputError(i18next.t('errors.required'));
      return;
    }
    
    actions.setSubmitting(true);
    actions.setLoading(true);
    this.updateSubmitButton();
    
    validateRssUrl(url)
      .then(() => loadRSS(url))
      .then(({ feed, posts }) => {
        const feedId = Date.now().toString();
        const feedWithId = { ...feed, id: feedId, url };
        
        const postsWithFeedId = posts.map(post => ({
          ...post,
          feedId: feedId,
        }));
        
        actions.addFeed(feedWithId);
        actions.addPosts(postsWithFeedId);
        actions.clearForm();
        this.clearInputError();
        
        this.showSuccessMessage();
        this.focusInput();
        
        renderFeeds();
        renderPosts();
        
        if (state.feeds.length === 1) {
          startUpdater();
        }
      })
      .catch((error) => {
        let errorMessage = error.message;
        if (error.type === 'required') errorMessage = i18next.t('errors.required');
        if (error.type === 'url') errorMessage = i18next.t('errors.url');
        if (error.type === 'unique') errorMessage = i18next.t('errors.duplicate');
        
        this.showInputError(errorMessage);
        this.showErrorMessage(errorMessage);
      })
      .finally(() => {
        actions.setSubmitting(false);
        actions.setLoading(false);
        this.updateSubmitButton();
      });
  }

  showSuccessMessage() {
    const statusDiv = document.getElementById('feed-status');
    if (!statusDiv) return;
    
    statusDiv.innerHTML = `
      <div class="success-message-text">
        RSS успешно загружен
      </div>
    `;
  }

  showErrorMessage(message) {
    const statusDiv = document.getElementById('feed-status');
    if (!statusDiv) return;
    
    statusDiv.innerHTML = `
      <div class="error-message-text">
        ${message}
      </div>
    `;
  }

  showInputError(message) {
    const urlInput = document.getElementById('url-input');
    const feedback = document.getElementById('url-feedback');
    
    if (urlInput) {
      urlInput.classList.add('is-invalid');
    }
    
    if (feedback) {
      feedback.textContent = message;
      feedback.classList.add('error');
    }
  }

  clearInputError() {
    const urlInput = document.getElementById('url-input');
    const feedback = document.getElementById('url-feedback');
    
    if (urlInput) {
      urlInput.classList.remove('is-invalid');
    }
    
    if (feedback) {
      feedback.textContent = '';
      feedback.classList.remove('error');
    }
  }

  focusInput() {
    const urlInput = document.getElementById('url-input');
    if (urlInput) {
      urlInput.focus();
    }
  }

  updateSubmitButton() {
    const submitButton = document.querySelector('#rss-form button');
    if (submitButton) {
      submitButton.disabled = state.isSubmitting || state.loading;
    }
  }
}

export default RSSReader;
