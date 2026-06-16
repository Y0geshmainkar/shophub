import axios from 'axios';

const isGitHubPages = typeof window !== 'undefined' &&
  window.location.hostname.includes('github.io');
export const USE_LOCAL = import.meta.env.DEV || isGitHubPages;

export const apiClient = axios.create({
  baseURL: USE_LOCAL ? (import.meta.env.BASE_URL || '/') : '/api/',
  headers: { 'Content-Type': 'application/json' },
});
