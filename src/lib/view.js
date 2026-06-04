import i18next from 'i18next';
import { state, actions } from './state.js';
import { Modal } from 'bootstrap';

export const renderFeeds = () => {
  const feedsContainer = document.getElementById('feeds-container');
  if (!feedsContainer) return;
  
  if (state.feeds.length === 0) {
    feedsContainer.innerHTML = '<p class="text-muted text-center small">Нет добавленных фидов</p>';
    return;
  }
  
  const feedsHtml = state.feeds.map(feed => `
    <div class="feed-item">
      <h3 class="feed-title h6">${escapeHtml(feed.title)}</h3>
      <p class="feed-description text-muted small">${escapeHtml(feed.description)}</p>
    </div>
  `).join('');
  
  feedsContainer.innerHTML = feedsHtml;
};

export const renderPosts = () => {
  const postsContainer = document.getElementById('posts-container');
  if (!postsContainer) return;
  
  if (state.posts.length === 0) {
    postsContainer.innerHTML = '<p class="text-muted text-center small">Нет добавленных постов</p>';
    return;
  }
  
  const postsToRender = [...state.posts].sort((a, b) => {
    const dateA = new Date(a.pubDate);
    const dateB = new Date(b.pubDate);
    return dateB - dateA;
  });
  
  const postsHtml = `
    <div class="list-unstyled">
      ${postsToRender.map(post => {
        const isRead = actions.isPostRead(post.id);
        const titleClass = isRead ? 'fw-normal' : 'fw-bold';
        
        return `
          <li class="post-item d-flex justify-content-between align-items-start mb-2" data-post-id="${post.id}">
            <div class="post-content flex-grow-1">
              <a href="${escapeHtml(post.link)}" target="_blank" class="post-link ${titleClass}">
                ${escapeHtml(post.title)}
              </a>
              <div class="post-date small text-muted">${formatDate(post.pubDate)}</div>
            </div>
            <button 
              type="button" 
              class="btn btn-sm btn-outline-primary view-post-btn" 
              data-post-id="${post.id}"
            >
              ${i18next.t('buttons.view')}
            </button>
          </li>
        `;
      }).join('')}
    </div>
  `;
  
  postsContainer.innerHTML = postsHtml;
  attachViewHandlers();
};

let modalInstance = null;

const getModal = () => {
  if (!modalInstance) {
    const modalElement = document.getElementById('postModal');
    modalInstance = new Modal(modalElement);
  }
  return modalInstance;
};

const attachViewHandlers = () => {
  const viewButtons = document.querySelectorAll('.view-post-btn');
  viewButtons.forEach(button => {
    button.removeEventListener('click', handleViewClick);
    button.addEventListener('click', handleViewClick);
  });
};

const handleViewClick = (event) => {
  const button = event.currentTarget;
  const postId = button.getAttribute('data-post-id');
  const post = state.posts.find(p => p.id === postId);
  
  if (post) {
    actions.markPostAsRead(post.id);
    
    const postItem = document.querySelector(`.post-item[data-post-id="${post.id}"]`);
    if (postItem) {
      const link = postItem.querySelector('.post-link');
      if (link) {
        link.classList.remove('fw-bold');
        link.classList.add('fw-normal');
      }
    }
    
    const modalTitle = document.getElementById('postModalLabel');
    const modalBody = document.getElementById('postModalBody');
    const readMoreLink = document.getElementById('readMoreLink');
    
    if (modalTitle) {
      modalTitle.textContent = post.title;
    }
    
    if (modalBody) {
      modalBody.innerHTML = post.description || 'Описание отсутствует';
    }
    
    if (readMoreLink) {
      readMoreLink.href = post.link;
    }
    
    const modal = getModal();
    modal.show();
  }
};

const escapeHtml = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  } catch {
    return '';
  }
};
