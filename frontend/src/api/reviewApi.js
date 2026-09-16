import axiosClient from './axiosClient';

export const reviewApi = {
  createReview: (data) => axiosClient.post('/reviews', data),
  getReviewsByDoctorId: (doctorId) => axiosClient.get(`/reviews/doctor/${doctorId}`),
  getDoctorRatingSummary: (doctorId) => axiosClient.get(`/reviews/doctor/${doctorId}/rating`),
  getMyReviews: () => axiosClient.get('/reviews/my-reviews'),
  deleteReview: (id) => axiosClient.delete(`/reviews/${id}`),
};
