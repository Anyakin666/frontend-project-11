import i18next from 'i18next';
import { validateRssUrl } from './validation.js';
import { state, actions } from './state.js';

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

  async handleSubmit() {
    const url = state.currentUrl.trim();
    
    if (!url) {
      this.showInputError(i18next.t('errors.required'));
      return;
    }
    
    actions.setSubmitting(true);
    this.updateSubmitButton();
    
    validateRssUrl(url, state.urls)
      .then((validUrl) => {
        actions.addUrl(validUrl);
        actions.clearForm();
        this.clearInputError();
        this.showMessage(i18next.t('notifications.success'), false, validUrl);
        this.focusInput();
      })
      .catch((error) => {
        let errorMessage = error.message;
        if (error.type === 'required') errorMessage = i18next.t('errors.required');
        if (error.type === 'url') errorMessage = i18next.t('errors.url');
        if (error.type === 'unique') errorMessage = i18next.t('errors.duplicate');
        
        this.showInputError(errorMessage);
        this.showMessage(errorMessage, true);
      })
      .finally(() => {
        actions.setSubmitting(false);
        this.updateSubmitButton();
      });
  }

  showMessage(message, isError = false, url = '') {
    const statusDiv = document.getElementById('feed-status');
    if (!statusDiv) return;
    
    const displayMessage = url ? `${message} (${url})` : message;
    
    statusDiv.innerHTML = `
      <div class="alert alert-${isError ? 'danger' : 'success'} alert-custom">
        ${displayMessage}
      </div>
    `;
    
    setTimeout(() => {
      const alert = statusDiv.querySelector('.alert');
      if (alert) {
        alert.remove();
      }
    }, 5000);
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
      submitButton.disabled = state.isSubmitting;
    }
  }
}

export default RSSReader;
