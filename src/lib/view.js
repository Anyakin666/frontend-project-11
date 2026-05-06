import { state } from './state.js';

export const renderFeeds = () => {
  const feedsContainer = document.getElementById('feeds-container');
  if (!feedsContainer) return;
  
  if (state.feeds.length === 0) {
    feedsContainer.innerHTML = '<p class="text-muted">Нет добавленных фидов</p>';
    return;
  }
  
  const feedsHtml = `
    <div class="feeds-list">
      ${state.feeds.map(feed => `
        <div class="feed-item mb-3 p-3 bg-dark bg-opacity-25 rounded">
          <h3 class="feed-title h5 mb-2">${escapeHtml(feed.title)}</h3>
          <p class="feed-description text-muted small mb-1">${escapeHtml(feed.description)}</p>
          <small class="text-muted">${feed.url}</small>
        </div>
      `).join('')}
    </div>
  `;
  
  feedsContainer.innerHTML = feedsHtml;
};

export const renderPosts = () => {
  const postsContainer = document.getElementById('posts-container');
  if (!postsContainer) return;
  
  if (state.posts.length === 0) {
    postsContainer.innerHTML = '<p class="text-muted">Нет добавленных постов</p>';
    return;
  }
  
  const postsHtml = `
    <div class="posts-list">
      ${state.posts.map(post => `
        <div class="post-item mb-2 p-2 border-bottom">
          <a href="${escapeHtml(post.link)}" target="_blank" class="post-link">
            ${escapeHtml(post.title)}
          </a>
          <small class="post-date text-muted ms-2">${formatDate(post.pubDate)}</small>
        </div>
      `).join('')}
    </div>
  `;
  
  postsContainer.innerHTML = postsHtml;
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
