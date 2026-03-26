import { proxy } from 'valtio/vanilla';

export const state = proxy({
  urls: [],
  currentUrl: '',
  error: null,
  isValid: true,
  isSubmitting: false,
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
  
  addUrl: (url) => {
    state.urls.push(url);
  },
  
  setSubmitting: (isSubmitting) => {
    state.isSubmitting = isSubmitting;
  }
};
