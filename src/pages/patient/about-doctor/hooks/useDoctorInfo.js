import { useState, useEffect } from 'react';
import { STATIC_INFO, DEFAULT_API_INFO } from '../constants/defaultInfo';
import clinicService from '../../../../api/services/clinic';

// تبدیل فرمت بک‌اند به فرانت
const transformWorkingHours = (hours) => {
  if (!hours || !Array.isArray(hours)) return [];
  
  return hours.map(item => ({
    days: item.day,
    hours: item.is_open ? `${item.start} الی ${item.end}` : 'تعطیل',
    isOpen: item.is_open
  }));
};

// تبدیل snake_case به camelCase
const transformApiResponse = (data) => ({
  doctorName: data.doctor_name || '',
  specialty: data.specialty || '',
  address: data.address || '',
  phone: data.phone || '',
  mobile: data.mobile || '',
  workingHours: transformWorkingHours(data.working_hours)
});

export const useDoctorInfo = () => {
  const [loading, setLoading] = useState(true);
  const [apiInfo, setApiInfo] = useState(DEFAULT_API_INFO);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await clinicService.getProfile();
        const transformed = transformApiResponse(response.data);
        setApiInfo(transformed);
      } catch (err) {
        console.error('Error fetching clinic info:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  // ترکیب اطلاعات API با استاتیک
  const info = {
    ...STATIC_INFO,
    ...apiInfo
  };

  return { info, loading, error };
};