// src/api/services/clinic.js  ← بدون تغییر
import apiClient from '../core';

const clinicService = {
  getProfile: () => apiClient.get('/clinic/profile/'),
  updateProfile: (data) => apiClient.put('/clinic/profile/', data),
  changePassword: (data) => apiClient.post('/clinic/change-password/', data),
};

export default clinicService;