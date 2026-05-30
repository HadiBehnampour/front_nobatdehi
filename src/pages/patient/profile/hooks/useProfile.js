import { useState, useEffect } from 'react';
import patientService from '../../../../api/services/patient';

const DEFAULT_USER_DATA = {
  fullName: '',
  nationalId: '',
  mobile: '',
  birthDate: '',
  medicalHistory: [],
  insuranceType: 'none',
  insuranceCode: '',
  supplementary: 'none',
  isMarried: 'single',
  surgeryProsthesis: false,
  education: '',
  job: '',
  phone: '',
  referralSource: '',
  allergies: '',
  referralName: '',
  surgeryHistory: false,
  surgeryType: '',
  medications: [],
};

const DEFAULT_STATS = {
  totalAppointments: 0,
  cancelledAppointments: 0,
};

// تبدیل snake_case به camelCase
const transformResponse = (data) => ({
  fullName: data.name || '',
  nationalId: data.nationalId || '',
  mobile: data.mobile || '',
  birthDate: data.birthDate || '',
  medicalHistory: data.medicalHistory || [],
  insuranceType: data.insuranceType || 'none',
  insuranceCode: data.insuranceCode || '',
  supplementary: data.supplementary || 'none',
  isMarried: data.isMarried || 'single',
  surgeryProsthesis: data.surgeryProsthesis || false,
  education: data.education || '',
  job: data.job || '',
  allergies: data.allergies || '',
  phone: data.phone || '',
  referralSource: data.referralSource || '',
  referralName: data.referralName || '',
  surgeryHistory: data.surgeryHistory || false,
  surgeryType: data.surgeryType || '',
  medications: data.medications || [],
});

// تبدیل camelCase به snake_case برای ارسال
const transformRequest = (data) => ({
  name: data.fullName,
  nationalId: data.nationalId,
  mobile: data.mobile,
  birthDate: data.birthDate,
  medicalHistory: data.medicalHistory,
  insuranceType: data.insuranceType,
  insuranceCode: data.insuranceCode,
  supplementary: data.supplementary,
  isMarried: data.isMarried,
  surgeryProsthesis: data.surgeryProsthesis,
  education: data.education,
  job: data.job,
  allergies: data.allergies,
  phone: data.phone,
  referralSource: data.referralSource,
  referralName: data.referralName,
  surgeryHistory: data.surgeryHistory,
  surgeryType: data.surgeryType,
  medications: data.medications,
});

export const useProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(DEFAULT_USER_DATA);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [error, setError] = useState(null);

  // دریافت اطلاعات پروفایل
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await patientService.getProfile();
      const transformed = transformResponse(response);
      setUserData(transformed);
      
      // آمار نوبت‌ها
      setStats({
        totalAppointments: response.totalVisits || 0,
        cancelledAppointments: response.cancelledVisits || 0,
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // ذخیره اطلاعات پروفایل
  const saveProfile = async (data) => {
    setSaving(true);
    try {
      const transformed = transformRequest(data);
      await patientService.updateProfile(transformed);
      setUserData(data);
      return { success: true, message: 'تغییرات با موفقیت ذخیره شد' };
    } catch (err) {
      console.error('Error saving profile:', err);
      return { success: false, message: 'خطا در ذخیره تغییرات' };
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    userData,
    setUserData,
    stats,
    loading,
    saving,
    error,
    saveProfile,
  };
};
