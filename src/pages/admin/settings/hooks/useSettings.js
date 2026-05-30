// src/pages/admin/settings/hooks/useSettings.js
import { useState, useEffect } from 'react';
import clinicService from '../../../../api/services/clinic';
import { 
  DEFAULT_SCHEDULE, 
  DEFAULT_GENERAL_INFO, 
  DEFAULT_SECURITY,
  TABS 
} from '../constants/defaultValues';

// تبدیل snake_case بک‌اند به camelCase فرانت
const mapBackendToFrontend = (data) => ({
  generalInfo: {
    clinicName: data.clinic_name || '',
    doctorName: data.doctor_name || '',
    specialty: data.specialty || '',
    address: data.address || '',
    phone: data.phone || '',
    mobile: data.mobile || '',
  },
  schedule: (data.working_hours || []).map(h => ({
    day: h.day,
    isOpen: h.is_open,
    start: h.start,
    end: h.end,
  })),
  security: {
    smsBooking: data.sms_booking_enabled ?? true,
    smsReminder: data.sms_reminder_enabled ?? true,
    currentPass: '',
    newPass: '',
    confirmPass: '',
  }
});

// تبدیل camelCase فرانت به snake_case بک‌اند
const mapFrontendToBackend = (generalInfo, schedule, security) => ({
  clinic_name: generalInfo.clinicName,
  doctor_name: generalInfo.doctorName,
  specialty: generalInfo.specialty,
  address: generalInfo.address,
  phone: generalInfo.phone,
  mobile: generalInfo.mobile,
  working_hours: schedule.map(s => ({
    day: s.day,
    is_open: s.isOpen,
    start: s.start,
    end: s.end,
  })),
  sms_booking_enabled: security.smsBooking,
  sms_reminder_enabled: security.smsReminder,
});

export const useSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.GENERAL);
  
  const [generalInfo, setGeneralInfo] = useState(DEFAULT_GENERAL_INFO);
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [security, setSecurity] = useState(DEFAULT_SECURITY);

  // ─── دریافت تنظیمات از سرور ───
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await clinicService.getProfile();
        const mapped = mapBackendToFrontend(response.data);
        
        setGeneralInfo(mapped.generalInfo);
        
        // اگه ساعات کاری از سرور اومد استفاده کن، وگرنه پیش‌فرض
        if (mapped.schedule.length > 0) {
          setSchedule(mapped.schedule);
        }
        
        setSecurity(prev => ({
          ...prev,
          smsBooking: mapped.security.smsBooking,
          smsReminder: mapped.security.smsReminder,
        }));

      } catch (error) {
        console.error("خطا در دریافت تنظیمات:", error);
        // اگه خطا خورد، از پیش‌فرض استفاده کن
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ─── ذخیره تنظیمات ───
  const handleSave = async () => {
    setSaving(true);
    try {
      // ۱. ذخیره پروفایل کلینیک
      const payload = mapFrontendToBackend(generalInfo, schedule, security);
      await clinicService.updateProfile(payload);

      // ۲. تغییر رمز عبور (فقط اگه پر شده)
      if (security.newPass) {
        if (security.newPass !== security.confirmPass) {
          alert('رمز جدید و تکرار آن مطابقت ندارند ❌');
          setSaving(false);
          return;
        }
        
        if (!security.currentPass) {
          alert('لطفاً رمز فعلی را وارد کنید ❌');
          setSaving(false);
          return;
        }

        await clinicService.changePassword({
          current_password: security.currentPass,
          new_password: security.newPass,
          confirm_password: security.confirmPass,
        });

        // پاک کردن فیلدهای رمز بعد از موفقیت
        setSecurity(prev => ({
          ...prev,
          currentPass: '',
          newPass: '',
          confirmPass: '',
        }));
      }

      alert("تنظیمات با موفقیت ذخیره شد ✅");

    } catch (error) {
      console.error("خطا:", error);
      
      // نمایش خطای سرور
      if (error.response?.data) {
        const errors = error.response.data;
        
        if (typeof errors === 'object') {
          const messages = Object.entries(errors)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
            .join('\n');
          alert(`خطا:\n${messages}`);
        } else {
          alert(errors.message || 'خطا در ذخیره تنظیمات');
        }
      } else {
        alert("خطا در ارتباط با سرور ❌");
      }
    } finally {
      setSaving(false);
    }
  };

  // ─── اکشن‌ها ───
  const toggleDay = (index) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { 
      ...newSchedule[index], 
      isOpen: !newSchedule[index].isOpen 
    };
    setSchedule(newSchedule);
  };

  const updateTime = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { 
      ...newSchedule[index], 
      [field]: value 
    };
    setSchedule(newSchedule);
  };

  const updateGeneralInfo = (field, value) => {
    setGeneralInfo(prev => ({ ...prev, [field]: value }));
  };

  const updateSecurity = (field, value) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  };

  return {
    loading,
    saving,
    activeTab,
    generalInfo,
    schedule,
    security,
    setActiveTab,
    handleSave,
    toggleDay,
    updateTime,
    updateGeneralInfo,
    updateSecurity,
  };
};