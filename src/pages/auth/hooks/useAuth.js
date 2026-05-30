// pages/auth/hooks/useAuth.js
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../api/services/auth';

const OTP_DURATION_SECONDS = 120;
const PHONE_REGEX = /^09\d{9}$/;

const initialProfile = {
  fullName: '',
  nationalId: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
  biologicalSex: '',
  primaryInsurance: '',
  secondaryInsurance: '',
  physicalAddress: '',
};

const useAuth = () => {
  const navigate = useNavigate();

  const [stage, setStage] = useState('phone'); // phone | otp | profile

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [profile, setProfile] = useState(initialProfile);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [expiresAt, setExpiresAt] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const tickRef = useRef(null);

  // ⚡ تایمر فقط در مرحله OTP فعال است؛ در stage profile پاک می‌شود
  useEffect(() => {
    if (!expiresAt || stage !== 'otp') {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    tickRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tickRef.current);
  }, [expiresAt, stage]);

  const timer =
    expiresAt && stage === 'otp'
      ? Math.max(0, Math.ceil((expiresAt - now) / 1000))
      : 0;
  const formattedTimer = `${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(
    timer % 60
  ).padStart(2, '0')}`;

  const isPhoneValid = PHONE_REGEX.test(mobile);

  const clearErrors = () => {
    setError('');
    setFieldErrors({});
  };

  const handleSendOtp = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();
      if (!isPhoneValid) {
        setError('شماره موبایل وارد شده معتبر نیست');
        return;
      }
      clearErrors();
      setLoading(true);
      try {
        const { data } = await authService.sendOtp(mobile);

        let computedExpiry;
        if (data?.expires_at && data?.server_time) {
          const drift = Date.now() - data.server_time * 1000;
          computedExpiry = data.expires_at * 1000 + drift;
        } else {
          computedExpiry = Date.now() + OTP_DURATION_SECONDS * 1000;
        }

        setExpiresAt(computedExpiry);
        setOtp('');
        setNow(Date.now());
        setStage('otp');
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          'خطا در ارسال کد تأیید';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [mobile, isPhoneValid]
  );

  const handleVerifyOtp = useCallback(async () => {
    if (otp.length !== 5) return;
    if (stage === 'otp' && timer === 0) {
      setError('کد منقضی شده است، لطفاً مجدداً درخواست دهید');
      return;
    }
    clearErrors();
    setLoading(true);
    try {
      const { data } = await authService.login(mobile, otp);

      if (data.register_required) {
        // ✅ ورود به مرحله profile — تایمر دیگه چک نمیشه
        // OTP در backend برای 30 دقیقه معتبر باقی میمونه (با patch)
        setStage('profile');
        setExpiresAt(null); // پاکسازی تایمر
        setLoading(false);
        return;
      }

      if (data.access && data.refresh) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));

        const role = (data.user?.role || '').toLowerCase().trim();
        navigate(role === 'admin' || role === 'doctor' ? '/admin' : '/patient');
        return;
      }

      setError('پاسخ نامعتبر از سرور');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        'کد وارد شده نادرست است';
      setError(msg);
      setOtp('');
    } finally {
      setLoading(false);
    }
  }, [otp, mobile, timer, stage, navigate]);

  const handleSubmitProfile = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();
      clearErrors();

      const required = [
        'fullName',
        'nationalId',
        'birthDay',
        'birthMonth',
        'birthYear',
        'biologicalSex',
        'primaryInsurance',
        'physicalAddress',
      ];
      const newFieldErrors = {};
      required.forEach((k) => {
        if (!profile[k] || !String(profile[k]).trim()) {
          newFieldErrors[k] = 'الزامی';
        }
      });

      if (profile.nationalId && profile.nationalId.length !== 10) {
        newFieldErrors.nationalId = 'کد ملی باید ۱۰ رقم باشد';
      }

      // ولیدیشن سال (4 رقم منطقی)
      if (profile.birthYear) {
        const y = parseInt(profile.birthYear, 10);
        if (isNaN(y) || y < 1300 || y > 1410) {
          newFieldErrors.birthYear = 'سال نامعتبر';
        }
      }

      // Build date string YYYY-MM-DD (Jalali kept as string for backend)
      let dateOfBirth = '';
      if (profile.birthYear && profile.birthMonth && profile.birthDay) {
        const dd = String(profile.birthDay).padStart(2, '0');
        const mm = String(profile.birthMonth).padStart(2, '0');
        dateOfBirth = `${profile.birthYear}-${mm}-${dd}`;
      }

      if (Object.keys(newFieldErrors).length) {
        setFieldErrors(newFieldErrors);
        setError('لطفاً فیلدهای الزامی را تکمیل کنید');
        return;
      }

      setLoading(true);
      try {
        const payload = {
          mobile,
          otp,
          fullName: profile.fullName,
          nationalId: profile.nationalId,
          dateOfBirth,
          biologicalSex: profile.biologicalSex,
          primaryInsurance: profile.primaryInsurance,
          secondaryInsurance: profile.secondaryInsurance,
          physicalAddress: profile.physicalAddress,
        };
        const { data } = await authService.register(payload);

        if (data.access && data.refresh) {
          localStorage.setItem('access', data.access);
          localStorage.setItem('refresh', data.refresh);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/patient');
        } else {
          setError('پاسخ نامعتبر از سرور');
        }
      } catch (err) {
        const data = err?.response?.data;
        const msg = data?.message || data?.detail || 'خطا در ایجاد پرونده';

        if (
          msg.includes('کد ملی') ||
          (data?.field_violations && data.field_violations.national_id)
        ) {
          setFieldErrors({ nationalId: msg });
        }
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [mobile, otp, profile, navigate]
  );

  const goBackToPhone = useCallback(() => {
    setStage('phone');
    setOtp('');
    setExpiresAt(null);
    clearErrors();
  }, []);

  const updateMobile = (v) => {
    setMobile(v.replace(/\D/g, '').slice(0, 11));
    if (error) setError('');
  };

  const updateProfile = (key, value) => {
    setProfile((p) => ({ ...p, [key]: value }));
    if (fieldErrors[key]) {
      setFieldErrors((fe) => {
        const { [key]: _, ...rest } = fe;
        return rest;
      });
    }
  };

  return {
    stage,
    mobile,
    otp,
    profile,
    loading,
    error,
    fieldErrors,
    timer,
    formattedTimer,
    isPhoneValid,
    setOtp,
    updateMobile,
    updateProfile,
    handleSendOtp,
    handleVerifyOtp,
    handleSubmitProfile,
    goBackToPhone,
  };
};

export default useAuth;
