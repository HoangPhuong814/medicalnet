import axiosClient from './axiosClient';

export const doctorApi = {
  getAllDoctors: () => axiosClient.get('/doctors'),
  getDoctorById: (id) => axiosClient.get(`/doctors/${id}`),
  getDoctorsBySpeciality: (specialityId) => axiosClient.get(`/doctors/speciality/${specialityId}`),
  getSpecialities: () => axiosClient.get('/specialities'),
  getDoctorUpcomingSchedules: (doctorId) => axiosClient.get(`/schedules/doctor/${doctorId}/upcoming`),
  getDoctorScheduleByDate: (doctorId, dateStr) => axiosClient.get(`/schedules/doctor/${doctorId}`, { params: { date: dateStr } }),
  createDoctor: (data) => axiosClient.post('/doctors/create', data),
  updateDoctor: (id, data) => axiosClient.put(`/doctors/${id}`, data),
  deleteDoctor: (id) => axiosClient.delete(`/doctors/${id}`),
};
