import i18next from 'i18next';
import { validateRssUrl } from './validation.js';
import { loadRSS } from './rss-loader.js';
import { state, actions } from './state.js';
import { renderFeeds, renderPosts } from './view.js';
import { startUpdater } from './updater.js';

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
    const feedsTitle = document.querySelector('.feeds-section h2');
    const postsTitle = document.querySelector('.posts-section h2');
    const readMoreLink = document.getElementById('readMoreLink');
    const closeButton = document.querySelector('.modal-footer .btn-secondary');
    
    if (title) title.textContent = i18next.t('app.title');
    if (subtitle) subtitle.textContent = i18next.t('app.subtitle');
    if (label) label.textContent = i18next.t('form.label');
    if (button) button.textContent = i18next.t('form.button');
    if (placeholder) placeholder.placeholder = i18next.t('form.placeholder');
    if (example) example.textContent = i18next.t('form.example');
    if (feedsTitle) feedsTitle.textContent = i18next.t('sections.feeds');
    if (postsTitle) postsTitle.textContent = i18next.t('sections.posts');
    if (readMoreLink) readMoreLink.textContent = i18next.t('buttons.readFull');
    if (closeButton) closeButton.textContent = i18next.t('buttons.close');
  }

  handleSubmit() {
    const url = state.currentUrl.trim();
    
    if (!url) {
      this.showFeedback(i18next.t('errors.required'), true);
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
        
        this.showFeedback(i18next.t('notifications.success'));
        this.focusInput();
        
        renderFeeds();
        renderPosts();
        
        if (state.feeds.length === 1) {
          startUpdater();
        }
      })
      .catch((error) => {
        let errorMessage = error.message;
        
        if (error.message.includes('Невалидный RSS') || error.message.includes('не содержит канала')) {
          errorMessage = i18next.t('errors.invalidRss');
        } else if (error.type === 'required') {
          errorMessage = i18next.t('errors.required');
        } else if (error.type === 'url') {
          errorMessage = i18next.t('errors.url');
        } else if (error.type === 'unique') {
          errorMessage = i18next.t('errors.duplicate');
        } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          errorMessage = i18next.t('errors.networkError');
        }
        
        this.showFeedback(errorMessage, true);
        this.showInputError(errorMessage);
      })
      .finally(() => {
        actions.setSubmitting(false);
        actions.setLoading(false);
        this.updateSubmitButton();
      });
  }

  showFeedback(message, isError = false) {
    const feedbackDiv = document.querySelector('.feedback');
    if (!feedbackDiv) return;
    
    feedbackDiv.innerHTML = message;
    feedbackDiv.style.color = isError ? '#f87171' : '#22c55e';
    feedbackDiv.style.marginTop = '0.5rem';
    feedbackDiv.style.fontSize = '0.8rem';
    
    setTimeout(() => {
      if (feedbackDiv.innerHTML === message) {
        feedbackDiv.innerHTML = '';
      }
    }, 5000);
  }

  showInputError(message) {
    const urlInput = document.getElementById('url-input');
    if (urlInput) {
      urlInput.classList.add('is-invalid');
    }
  }

  clearInputError() {
    const urlInput = document.getElementById('url-input');
    if (urlInput) {
      urlInput.classList.remove('is-invalid');
    }
    const feedbackDiv = document.querySelector('.feedback');
    if (feedbackDiv && feedbackDiv.innerHTML !== '') {
      setTimeout(() => {
        if (feedbackDiv.innerHTML === feedbackDiv.innerHTML) {
          feedbackDiv.innerHTML = '';
        }
      }, 3000);
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
