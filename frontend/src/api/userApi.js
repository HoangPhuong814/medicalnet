import axiosClient from './axiosClient';

export const userApi = {
  getAllUsers: () => axiosClient.get('/users'),
  getUserById: (id) => axiosClient.get(`/users/${id}`),
  deleteUser: (id) => axiosClient.delete(`/users/${id}`),
};
