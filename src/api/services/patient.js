import apiClient from '../core';

export const patientService = {

  // ═══ داشبورد ═══
  getDashboardStats: async () => {
    const response = await apiClient.get('/patient/dashboard/');
    return response.data;
  },

  // ═══ تقویم (Public) ═══
  getMonthInfo: async (year, month) => {
    const response = await apiClient.get('/patient/calendar/month/', {
      params: { year, month }
    });
    return response.data;
  },

  getAvailableSlots: async (date) => {
    const formattedDate = date.replace(/\//g, '-');
    const response = await apiClient.get('/patient/slots/available/', {
      params: { date: formattedDate }
    });
    return response.data;
  },

  // ═══ رزرو (نیاز به لاگین) ═══
  reserveSlot: async (slotId, reason) => {
    const response = await apiClient.post('/patient/appointments/reserve/', {
      slotId,
      reason,
    });
    return response.data;
  },

  // ═══ نوبت‌های من ═══
  getMyAppointments: async () => {
    const response = await apiClient.get('/patient/appointments/my/');
    return response.data;
  },

  // ═══ چک نوبت تکراری ═══
  checkDuplicateAppointment: async (date) => {
    const formattedDate = date.replace(/\//g, '-');
    const response = await apiClient.get('/patient/appointments/check-duplicate/', {
      params: { date: formattedDate }
    });
    return response.data;
  },

  // ═══ پرداخت ═══
  requestPayment: async (slotId, reason) => {
    const response = await apiClient.post('/patient/payment/request/', {
      slotId,
      reason,
    });
    return response.data;
  },

  // ❌ حذف شد: reserveTemporary
  // ❌ حذف شد: continuePayment

  verifyPayment: async (authority, slotId, status) => {
    const response = await apiClient.post('/patient/payment/verify/', {
      authority,
      slotId: parseInt(slotId),
      status,
    });
    return response.data;
  },

  // ═══ پرونده پزشکی ═══
  getMedicalRecords: async () => {
    const response = await apiClient.get('/patient/records/');
    return response.data;
  },

  // ═══ پروفایل ═══
  getProfile: async () => {
    const response = await apiClient.get('/patient/profile/');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/patient/profile/', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await apiClient.post('/patient/change-password/', data);
    return response.data;
  },

  // ═══ نوبت در انتظار پرداخت ═══
  checkPendingPayment: async () => {
    const response = await apiClient.get('/patient/payment/check-pending/');
    return response.data;
  },

  cancelPendingPayment: async (slotId) => {
    const response = await apiClient.post('/patient/payment/cancel-pending/', {
      slotId,
    });
    return response.data;
  },

  resumePendingPayment: async (slotId) => {
    const response = await apiClient.post('/patient/payment/resume/', {
      slotId,
    });
    return response.data;
  },
};

export default patientService;