import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Retry transient cold-start failures (Render free tier waking up).
// 502/503/504 are retried for any method (the app was never reached);
// network errors/timeouts are retried only for GET/HEAD/OPTIONS so a
// request that may have reached the server is never duplicated.
const MAX_RETRIES = 3;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || axios.isCancel(error)) return Promise.reject(error);

    const status = error.response?.status;
    const isSafeMethod = ['get', 'head', 'options'].includes((config.method || 'get').toLowerCase());
    const isTransient = status ? [502, 503, 504].includes(status) : isSafeMethod;

    config.retryCount = config.retryCount || 0;
    if (!isTransient || config.retryCount >= MAX_RETRIES) return Promise.reject(error);

    config.retryCount += 1;
    await new Promise((resolve) => setTimeout(resolve, 2000 * 2 ** (config.retryCount - 1)));
    return api(config);
  }
);

export default api;
