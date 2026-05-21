import { state } from './state.js';

export const renderFeeds = () => {
  const feedsContainer = document.getElementById('feeds-container');
  if (!feedsContainer) return;
  
  if (state.feeds.length === 0) {
    feedsContainer.innerHTML = '<p class="text-muted text-center small">Нет добавленных фидов</p>';
    return;
  }
  
  const feedsHtml = state.feeds.map(feed => `
    <div class="feed-item">
      <div class="feed-title">${escapeHtml(feed.title)}</div>
      <div class="feed-description">${escapeHtml(feed.description)}</div>
      <div class="feed-url small">${escapeHtml(feed.url)}</div>
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
  
  const postsToRender = state.posts.slice().sort((a, b) => {
    const dateA = new Date(a.pubDate);
    const dateB = new Date(b.pubDate);
    return dateB - dateA; 
  });
  
  const postsHtml = postsToRender.map(post => `
    <div class="post-item d-flex justify-content-between align-items-start">
      <div class="post-content flex-grow-1">
        <a href="${escapeHtml(post.link)}" target="_blank" class="post-link">
          ${escapeHtml(post.title)}
        </a>
        <div class="post-date">${formatDate(post.pubDate)}</div>
      </div>
      <button 
        type="button" 
        class="btn btn-sm btn-outline-primary view-post-btn" 
        data-post-id="${post.id}"
        data-bs-toggle="modal" 
        data-bs-target="#postModal"
      >
        Просмотр
      </button>
    </div>
  `).join('');
  
  postsContainer.innerHTML = postsHtml;
  attachViewHandlers();
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
  if (post) openModal(post);
};

const openModal = (post) => {
  const modalTitle = document.getElementById('postModalLabel');
  const modalBody = document.getElementById('postModalBody');
  const readMoreLink = document.getElementById('readMoreLink');
  
  if (modalTitle) modalTitle.textContent = post.title;
  if (modalBody) modalBody.innerHTML = post.description || 'Нет описания';
  if (readMoreLink) readMoreLink.href = post.link;
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
