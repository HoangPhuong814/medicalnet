import axiosClient from './axiosClient';

export const authApi = {
  login: (data) => axiosClient.post('/auth/login', data),
  register: (data) => axiosClient.post('/users/create', data),
  getMyInfo: () => axiosClient.get('/users/my-info'),
  updateMyInfo: (data) => axiosClient.put('/users/my-info', data),
  forgotPassword: (email) => axiosClient.post('/auth/forgot-password', { email }),
  resetPassword: (data) => axiosClient.post('/auth/reset-password', data),
};
