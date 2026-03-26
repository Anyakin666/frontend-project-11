import { validateRssUrl } from './validation.js';
import { state, actions } from './state.js';

class RSSReader {
  constructor() {
    console.log('RSSReader initialized');
    this.init();
  }

  init() {
    const form = document.getElementById('rss-form');
    const urlInput = document.getElementById('url-input');
    
    console.log('Form found:', !!form);
    console.log('Input found:', !!urlInput);
    
    if (form) {
      form.addEventListener('submit', (e) => {
        console.log('Submit event triggered');
        e.preventDefault();
        e.stopPropagation();
        this.handleSubmit();
      });
    }
    
    if (urlInput) {
      urlInput.addEventListener('input', (e) => {
        console.log('Input changed:', e.target.value);
        actions.setCurrentUrl(e.target.value);
        this.clearInputError();
      });
      
      // Синхронизация начального значения
      actions.setCurrentUrl(urlInput.value);
    }
  }

  handleSubmit() {
    const url = state.currentUrl.trim();
    console.log('Submitting URL:', url);
    console.log('Existing URLs:', state.urls);
    
    if (!url) {
      console.log('Empty URL');
      this.showInputError('Не должно быть пустым');
      return;
    }
    
    actions.setSubmitting(true);
    this.updateSubmitButton();
    
    validateRssUrl(url, state.urls)
      .then((validUrl) => {
        console.log('Validation passed:', validUrl);
        actions.addUrl(validUrl);
        actions.clearForm();
        this.clearInputError();
        this.showMessage(`RSS поток "${validUrl}" успешно добавлен!`);
        this.focusInput();
      })
      .catch((error) => {
        console.log('Validation error:', error.message);
        this.showInputError(error.message);
        this.showMessage(error.message, true);
      })
      .finally(() => {
        actions.setSubmitting(false);
        this.updateSubmitButton();
      });
  }

  showMessage(message, isError = false) {
    const statusDiv = document.getElementById('feed-status');
    if (!statusDiv) return;
    
    statusDiv.innerHTML = `
      <div class="alert alert-${isError ? 'danger' : 'success'} alert-custom">
        ${message}
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
