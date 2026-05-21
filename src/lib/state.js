import { proxy } from 'valtio/vanilla';

const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 6);

export const state = proxy({
  feeds: [],      
  posts: [],     
  currentUrl: '',
  error: null,
  isValid: true,
  isSubmitting: false,
  loading: false,
  updateTimer: null, 
});

export const actions = {
  setCurrentUrl: (url) => {
    state.currentUrl = url;
    state.error = null;
    state.isValid = true;
  },
  
  setError: (error) => {
    state.error = error;
    state.isValid = false;
  },
  
  clearForm: () => {
    state.currentUrl = '';
    state.error = null;
    state.isValid = true;
    state.isSubmitting = false;
  },
  
  setSubmitting: (isSubmitting) => {
    state.isSubmitting = isSubmitting;
  },
  
  setLoading: (isLoading) => {
    state.loading = isLoading;
  },
  
  addFeed: (feed) => {
    state.feeds.push(feed);
  },
  
  addPosts: (posts) => {
    const existingLinks = new Set(state.posts.map(p => p.link));
    const newPosts = posts.filter(post => !existingLinks.has(post.link));
    state.posts.push(...newPosts);
    return newPosts.length; 
  },
  
  isUrlExists: (url) => {
    return state.feeds.some(feed => feed.url === url);
  },
  
  setUpdateTimer: (timer) => {
    state.updateTimer = timer;
  },
  
  clearUpdateTimer: () => {
    if (state.updateTimer) {
      clearTimeout(state.updateTimer);
      state.updateTimer = null;
    }
  }
};
