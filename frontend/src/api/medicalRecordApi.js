import axiosClient from './axiosClient';

export const medicalRecordApi = {
  createMedicalRecord: (data) => axiosClient.post('/medical-records', data),
  getRecordByAppointmentId: (appointmentId) => axiosClient.get(`/medical-records/appointment/${appointmentId}`),
  getMyMedicalRecords: () => axiosClient.get('/medical-records/my-records'),
  getRecordsByPatientId: (patientId) => axiosClient.get(`/medical-records/patient/${patientId}`),
  getRecordsByDoctorId: (doctorId) => axiosClient.get(`/medical-records/doctor/${doctorId}`),
  deleteRecord: (id) => axiosClient.delete(`/medical-records/${id}`),
};
