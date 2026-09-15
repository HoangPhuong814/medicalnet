import axiosClient from './axiosClient';

export const dashboardApi = {
  getAdminStats: (year) => axiosClient.get('/dashboard/admin', { params: { year } }),
  getDoctorStats: (year) => axiosClient.get('/dashboard/doctor', { params: { year } }),
};
