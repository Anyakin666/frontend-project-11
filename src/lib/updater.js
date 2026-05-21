import { loadRSS } from './rss-loader.js';
import { state, actions } from './state.js';
import { renderPosts } from './view.js';

const updateFeed = (feed) => {
  return loadRSS(feed.url)
    .then(({ posts }) => {
      const postsWithFeedId = posts.map(post => ({
        ...post,
        feedId: feed.id,
      }));
      
      const existingLinks = new Set(state.posts.map(p => p.link));
      const newPosts = postsWithFeedId.filter(post => !existingLinks.has(post.link));
      
      if (newPosts.length > 0) {
        // Создаём новый массив, добавляем новые посты
        const allPosts = [...state.posts, ...newPosts];
        
        // Сортируем (новые сверху)
        allPosts.sort((a, b) => {
          const dateA = new Date(a.pubDate);
          const dateB = new Date(b.pubDate);
          return dateB - dateA;
        });
        
        // Заменяем массив в состоянии
        state.posts.splice(0, state.posts.length, ...allPosts);
        
        renderPosts();
      }
      
      return newPosts.length;
    })
    .catch((error) => {
      console.error(`Ошибка обновления фида "${feed.url}":`, error.message);
      return 0;
    });
};

const updateAllFeeds = () => {
  if (state.feeds.length === 0) return Promise.resolve();
  
  const updatePromises = state.feeds.map(feed => updateFeed(feed));
  
  return Promise.all(updatePromises).catch((error) => {
    console.error('Ошибка при обновлении фидов:', error);
  });
};

export const startUpdater = () => {
  actions.clearUpdateTimer();
  
  const scheduleUpdate = () => {
    const timer = setTimeout(() => {
      updateAllFeeds()
        .finally(() => {
          if (state.feeds.length > 0) {
            scheduleUpdate();
          } else {
            actions.clearUpdateTimer();
          }
        });
    }, 5000);
    
    actions.setUpdateTimer(timer);
  };
  
  if (state.feeds.length > 0) {
    scheduleUpdate();
  }
};

export const stopUpdater = () => {
  actions.clearUpdateTimer();
};
