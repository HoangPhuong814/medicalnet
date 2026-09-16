import axiosClient from './axiosClient';

export const scheduleApi = {
  createSchedule: (data) => axiosClient.post('/schedules/create', data),
  getUpcomingSchedules: (doctorId) => axiosClient.get(`/schedules/doctor/${doctorId}/upcoming`),
  getScheduleByDoctorAndDate: (doctorId, date) =>
    axiosClient.get(`/schedules/doctor/${doctorId}`, { params: { date } }),
  deleteSchedule: (id) => axiosClient.delete(`/schedules/${id}`),
};
