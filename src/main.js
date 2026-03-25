import 'bootstrap/dist/css/bootstrap.min.css';

class RSSReader {
  constructor() {
    this.form = document.getElementById('rss-form');
    this.urlInput = document.getElementById('url-input');
    this.statusDiv = document.getElementById('feed-status');
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }
  }

  showMessage(message, isError = false) {
    if (!this.statusDiv) return;
    
    this.statusDiv.innerHTML = `
      <div class="alert alert-${isError ? 'danger' : 'success'} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    
    setTimeout(() => {
      const alert = this.statusDiv.querySelector('.alert');
      if (alert) {
        alert.remove();
      }
    }, 5000);
  }

  validateUrl(url) {
    if (!url) {
      return 'URL не может быть пустым';
    }
    
    try {
      new URL(url);
      return null;
    } catch {
      return 'Пожалуйста, введите корректный URL';
    }
  }

  handleSubmit() {
    const url = this.urlInput.value.trim();
    const validationError = this.validateUrl(url);
    
    if (validationError) {
      this.showMessage(validationError, true);
      this.urlInput.classList.add('is-invalid');
      return;
    }
    
    this.urlInput.classList.remove('is-invalid');
    this.urlInput.disabled = true;
    this.form.querySelector('button').disabled = true;
    
    this.addRssFeed(url)
      .then((result) => {
        this.showMessage(`RSS поток "${result.title}" успешно добавлен!`);
        this.urlInput.value = '';
      })
      .catch((error) => {
        this.showMessage(error.message, true);
      })
      .finally(() => {
        this.urlInput.disabled = false;
        this.form.querySelector('button').disabled = false;
        this.urlInput.focus();
      });
  }

  addRssFeed(url) {
    return new Promise((resolve, reject) => {
      // Временная заглушка для демонстрации
      setTimeout(() => {
        if (url.includes('example.com') || !url) {
          reject(new Error('Не удалось загрузить RSS поток. Проверьте URL и попробуйте снова.'));
        } else {
          resolve({
            title: 'Пример RSS потока',
            description: 'Это демонстрационный RSS поток'
          });
        }
      }, 1000);
    });
  }
}

// Инициализация после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new RSSReader();
  });
} else {
  new RSSReader();
}
