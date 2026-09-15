import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Gắn token tự động vào header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Lấy data hoặc bắt lỗi
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data !== undefined) {
      // Backend thường trả về định dạng { code: 1000, result: ... }
      return response.data.result !== undefined ? response.data.result : response.data;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Không tự chuyển trang nếu đang ở trang login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    const message = error.response?.data?.message || error.message || 'Đã có lỗi xảy ra!';
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
