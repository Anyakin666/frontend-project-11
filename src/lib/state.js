import { proxy } from 'valtio/vanilla';

const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 6);

export const state = proxy({
  feeds: [],      
  posts: [],      
  error: null,
  isValid: true,
  isSubmitting: false,
  loading: false,  
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
    state.posts.push(...posts);
  },
  
  isUrlExists: (url) => {
    return state.feeds.some(feed => feed.url === url);
  }
};
