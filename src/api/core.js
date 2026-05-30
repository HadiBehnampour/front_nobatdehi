import axios from 'axios';

// خواندن آدرس از فایل .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// ساخت اینستنس اصلی
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// --- متغیر برای جلوگیری از چند refresh همزمان ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- Request Interceptor ---
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // اگه ۴۰۱ خورد و قبلاً retry نکردیم
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // اگه داره refresh میشه، صبر کن
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh');

      // اگه refresh token نداره، برو لاگین
      if (!refreshToken) {
        isRefreshing = false;
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(error);
      }

      try {
        // گرفتن توکن جدید
        const response = await axios.post(`${BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccess = response.data.access;
        const newRefresh = response.data.refresh;

        localStorage.setItem('access', newAccess);
        if (newRefresh) {
          localStorage.setItem('refresh', newRefresh);
        }

        apiClient.defaults.headers['Authorization'] = `Bearer ${newAccess}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;

        processQueue(null, newAccess);

        return apiClient(originalRequest);

      } catch (refreshError) {
        // refresh هم منقضی شده، برو لاگین
        processQueue(refreshError, null);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;