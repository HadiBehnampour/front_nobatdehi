// api/services/auth.js
import apiClient from '../core';

export const authService = {
  /**
   * Send OTP — backend returns { success, message, server_time?, expires_at? }
   */
  sendOtp: (mobile) => {
    return apiClient.post('/auth/send-otp/', { mobile });
  },

  /**
   * Verify OTP — backend returns either:
   *   - { register_required: true, mobile, message }  → new user
   *   - { access, refresh, user }                     → existing user
   */
  login: (mobile, otp) => {
    return apiClient.post('/auth/login/', { mobile, otp });
  },

  /**
   * Register (JIT EHR creation) — atomic User + Patient creation
   * Accepts the full EHR profile object plus mobile + otp.
   */
  register: (data) => {
    return apiClient.post('/auth/register/', data);
  },

  getCurrentUser: () => {
    return apiClient.get('/auth/me/');
  },

  refreshToken: (refresh) => {
    return apiClient.post('/auth/refresh/', { refresh });
  },

  logout: () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    window.location.href = '/';
  },
};

export default authService;
