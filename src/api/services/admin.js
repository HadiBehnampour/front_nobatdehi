import apiClient from '../core';

export const adminService = {

  // ==================== آمار و داشبورد ====================

  getStats: async () => {
    const response = await apiClient.get('/admin/stats/');
    return response.data;
  },

  getFinanceReport: async (range = 'weekly') => {
    const response = await apiClient.get('/admin/finance/', { params: { range } });
    return response.data;
  },

  // ==================== مدیریت نوبت‌ها ====================

  getAppointments: async (filters = {}) => {
    if (typeof filters === 'string') {
      const formattedDate = filters.replace(/\//g, '-');
      const response = await apiClient.get(`/admin/appointments/?date=${formattedDate}`);
      return response.data;
    }
    const response = await apiClient.get('/admin/appointments/', { params: filters });
    return response.data;
  },

  createSchedule: async (scheduleData) => {
    const response = await apiClient.post('/admin/schedule/open/', scheduleData);
    return response.data;
  },

  createManualAppointment: async (data) => {
    const response = await apiClient.post('/admin/appointments/manual/', data);
    return response.data;
  },

  updateAppointmentStatus: async (id, status) => {
    const response = await apiClient.patch(`/admin/appointments/${id}/status/`, { status });
    return response.data;
  },

  deleteAppointment: async (appointmentId) => {
    const response = await apiClient.delete(`/admin/appointments/${appointmentId}/`);
    return response.data;
  },

  getAvailableDates: async () => {
    const response = await apiClient.get('/admin/schedule/available-dates/');
    return response.data;
  },

  closeSchedule: async (date) => {
    const response = await apiClient.post('/admin/schedule/close/', { date });
    return response.data;
  },

  // ==================== مدیریت بیماران ====================

  getPatients: async (search = '') => {
    const params = search ? { search } : {};
    const response = await apiClient.get('/admin/patients/', { params });
    return response.data;
  },

  getPatientById: async (patientId) => {
    const response = await apiClient.get(`/admin/patients/${patientId}/`);
    return response.data;
  },

  createPatient: async (data) => {
    console.log('📤 Sending to server:', data);
    const response = await apiClient.post('/admin/patients/', data);
    return response.data;
  },

  updatePatient: async (patientId, data) => {
    const response = await apiClient.put(`/admin/patients/${patientId}/`, data);
    return response.data;
  },

  deletePatient: async (patientId) => {
    const response = await apiClient.delete(`/admin/patients/${patientId}/`);
    return response.data;
  },

  getPatientHistory: async (patientId) => {
    const response = await apiClient.get(`/admin/patients/${patientId}/history/`);
    return response.data;
  },

  updatePatientClinical: async (patientId, data) => {
    const response = await apiClient.patch(`/admin/patients/${patientId}/`, data);
    return response.data;
  },

  getPatientProfile: async (patientId) => {
    const response = await apiClient.get(`/admin/patients/${patientId}/`);
    return response.data;
  },

  uploadPatientsExcel: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      '/admin/patients/bulk-upload/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      }
    );
    return response.data;
  },

  // ==================== مدیریت مالی ====================

  createBilling: async (billingData) => {
    const response = await apiClient.post('/admin/billing/', billingData);
    return response.data;
  },

  getBillings: async (filters = {}) => {
    const response = await apiClient.get('/admin/billings/', { params: filters });
    return response.data;
  },

  // ==================== مدیریت مشاوره‌ها ====================

  getConsults: async (status = 'pending') => {
    const response = await apiClient.get('/admin/consults/', { params: { status } });
    return response.data;
  },

  replyToConsult: async (id, message) => {
    const response = await apiClient.post(`/admin/consults/${id}/reply/`, { message });
    return response.data;
  },

  // ==================== خدمات و پرداخت ====================

  addServices: async (data) => {
    const response = await apiClient.post('/admin/services/add/', data);
    return response.data;
  },

  payServices: async (appointmentId) => {
    const response = await apiClient.post('/admin/services/pay/', { appointmentId });
    return response.data;
  },

  finishVisit: async (appointmentId) => {
    const response = await apiClient.post('/admin/visits/finish/', { appointmentId });
    return response.data;
  },

  // ==================== تنظیمات نوبت‌دهی ====================

  getScheduleSettings: async () => {
    const response = await apiClient.get('/admin/settings/');
    return response.data;
  },

  saveScheduleSettings: async (data) => {
    const response = await apiClient.put('/admin/settings/', data);
    return response.data;
  },

  batchCreateSchedule: async (data) => {
    const response = await apiClient.post('/admin/schedule/batch/', data);
    return response.data;
  },

  getMonthInfo: async (year, month) => {
    const response = await apiClient.get('/admin/calendar/month/', { params: { year, month } });
    return response.data;
  },

  // ==================== نوبت بعدی ====================

  getAvailableSlots: async (date) => {
    const response = await apiClient.get('/admin/slots/available/', { params: { date } });
    return response.data;
  },

  bookNextAppointment: async (data) => {
    const response = await apiClient.post('/admin/appointments/manual/', data);
    return response.data;
  },

  getAppointmentHistory: async (limit = 50) => {
    const response = await apiClient.get('/admin/appointments/history/', { params: { limit } });
    return response.data;
  },

  lockAllSlots: async (date, action) => {
    const response = await apiClient.post('/admin/appointments/lock-all/', { date, action });
    return response.data;
  },

  toggleSlotLock: async (id) => {
    const response = await apiClient.patch(`/admin/appointments/${id}/toggle-lock/`);
    return response.data;
  },

  // ==================== حذف نوبت‌ها ====================

  checkSlots: async (from, to = null) => {
    const fromFormatted = from.replace(/\//g, '-');
    const toFormatted = (to || from).replace(/\//g, '-');
    const response = await apiClient.get('/admin/schedule/check/', {
      params: { from: fromFormatted, to: toFormatted }
    });
    return response.data;
  },

  deleteSlots: async (data) => {
    const formatted = {
      ...data,
      from: data.from?.replace(/\//g, '-'),
      to: data.to?.replace(/\//g, '-'),
    };
    const response = await apiClient.post('/admin/schedule/delete/', formatted);
    return response.data;
  },

  exportFinanceExcel: async (params) => {
    const response = await apiClient.get('/admin/finance/export/', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  saveEncounter: async (appointmentId, data) => {
    const response = await apiClient.post(
      `/admin/encounters/${appointmentId}/`,
      data
    );
    return response.data;
  },

};

export default adminService;
