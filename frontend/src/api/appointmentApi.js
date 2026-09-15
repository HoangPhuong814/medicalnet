import axiosClient from './axiosClient';

export const appointmentApi = {
  bookAppointment: (data) => axiosClient.post('/appointments/book', data),
  getMyBookings: () => axiosClient.get('/appointments/my-bookings'),
  getDoctorAppointments: (doctorId) => axiosClient.get(`/appointments/doctor/${doctorId}`),
  cancelAppointment: (id) => axiosClient.put(`/appointments/${id}/cancel`),
};
