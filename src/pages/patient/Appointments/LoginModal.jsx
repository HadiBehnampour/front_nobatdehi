import React, { useState } from 'react';
import { X, Phone, User, ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { authService } from '../../../api/services/auth';

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [step, setStep] = useState(1);
  const [authMode, setAuthMode] = useState('login');
  const [mobile, setMobile] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUserNotFound, setIsUserNotFound] = useState(false);

  const [isRegisterRedirectFlow, setIsRegisterRedirectFlow] = useState(false);
  const [redirectMobile, setRedirectMobile] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsUserNotFound(false);

    if (!mobile) {
      setError('شماره موبایل را وارد کنید');
      return;
    }

    if (authMode === 'register' && !fullName) {
      setError('نام و نام خانوادگی را وارد کنید');
      return;
    }

    setLoading(true);
    try {

      if (authMode === 'register' && isRegisterRedirectFlow) {

        if (mobile === redirectMobile) {

          const res = await authService.register(
            mobile,
            otp,
            fullName
          );

          localStorage.setItem('access', res.data.access);
          localStorage.setItem('refresh', res.data.refresh);
          localStorage.setItem('user', JSON.stringify(res.data.user));

          window.dispatchEvent(new Event('auth-change'));

          onLoginSuccess();
          return;

        } else {

          setIsRegisterRedirectFlow(false);
          setRedirectMobile('');
          setOtp('');

        }
      }

      await authService.sendOtp(mobile);
      setStep(2);

    } catch (err) {

      const msg = err.response?.data?.message;

      if (
        isRegisterRedirectFlow &&
        (msg === 'کد تایید منقضی شده است.' ||
          msg === 'ابتدا کد تایید دریافت کنید.')
      ) {
        setIsRegisterRedirectFlow(false);
        setRedirectMobile('');
        setStep(1);
        setOtp('');
      }

      setError(msg || 'خطا در ارسال کد');

    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsUserNotFound(false);

    if (otp.length !== 5) {
      setError('کد تایید باید ۵ رقم باشد');
      return;
    }

    setLoading(true);
    try {
      let res;

      if (authMode === 'login') {

        res = await authService.login(mobile, otp);

        if (res.data?.register_required) {
          setAuthMode('register');
          setStep(1);
          setMobile(res.data.mobile);
          setIsRegisterRedirectFlow(true);
          setRedirectMobile(res.data.mobile);
          setError('');
          return;
        }

      } else {

        res = await authService.register(
          mobile,
          otp,
          fullName
        );

      }

      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      window.dispatchEvent(new Event('auth-change'));

      onLoginSuccess();

    } catch (err) {

      const msg = err.response?.data?.message;

      if (
        isRegisterRedirectFlow &&
        (msg === 'کد تایید منقضی شده است.' ||
          msg === 'ابتدا کد تایید دریافت کنید.')
      ) {
        setIsRegisterRedirectFlow(false);
        setRedirectMobile('');
        setStep(1);
        setOtp('');
      }

      if (
        msg?.includes('یافت نشد') ||
        msg?.includes('ثبت') ||
        msg === 'پروفایل بیمار حذف شده است.'
      ) {
        setIsUserNotFound(true);
        setError(`حساب کاربری با شماره ${mobile} یافت نشد.\nلطفاً ابتدا ثبت‌نام کنید.`);
        setLoading(false);
        return;
      }

      setError(msg || 'کد تایید اشتباه است');

    } finally {
      setLoading(false);
    }
  };

  const goToRegisterWithMobile = () => {
    setAuthMode('register');
    setStep(1);
    setOtp('');
    setError('');
    setIsUserNotFound(false);
    setIsRegisterRedirectFlow(false);
    setRedirectMobile('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative">

        {/* Header */}
        <div className="bg-brand text-white p-6 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">
              {step === 1
                ? (authMode === 'login' ? 'ورود سریع' : 'ثبت‌نام سریع')
                : 'تایید شماره موبایل'
              }
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {step === 1 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700 text-center">
              برای تکمیل رزرو نوبت، ابتدا وارد شوید
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm text-center whitespace-pre-line">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">

              {authMode === 'register' && (
                <div className="relative">
                  <User className="absolute right-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="نام و نام خانوادگی"
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand focus:bg-white outline-none text-sm"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="relative">
                <Phone className="absolute right-3 top-3 text-gray-400" size={18} />
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="09xxxxxxxxx"
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand focus:bg-white outline-none text-sm"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading
                  ? <Loader2 className="animate-spin" size={18} />
                  : (isRegisterRedirectFlow ? 'تکمیل ثبت‌نام' : 'دریافت کد تایید')
                }
              </button>

              {!isRegisterRedirectFlow && !isUserNotFound && (
                <div className="text-center text-sm text-gray-500">
                  {authMode === 'login' ? 'حساب ندارید؟' : 'حساب دارید؟'}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode(m => m === 'login' ? 'register' : 'login');
                      setIsRegisterRedirectFlow(false);
                      setRedirectMobile('');
                      setOtp('');
                      setError('');
                    }}
                    className="text-brand font-bold mr-1 hover:underline"
                  >
                    {authMode === 'login' ? 'ثبت‌نام' : 'ورود'}
                  </button>
                </div>
              )}

            </form>
          ) : (
            <form
              onSubmit={handleVerifyOtp}
              className="space-y-4"
            >
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp('');
                  setError('');
                  setIsRegisterRedirectFlow(false);
                  setRedirectMobile('');
                }}
                className="text-sm text-gray-500 flex items-center gap-1 hover:text-brand"
              >
                <ArrowRight size={14} />
                اصلاح شماره
              </button>

              <div className="text-center text-sm text-gray-600 mb-3">
                کد ۵ رقمی ارسال شده به{' '}
                <strong className="text-brand">{mobile}</strong>{' '}
                را وارد کنید
              </div>

              <div className="relative">
                <ShieldCheck className="absolute right-3 top-3 text-brand" size={18} />
                <input
                  type="tel"
                  dir="ltr"
                  maxLength="5"
                  placeholder="· · · · ·"
                  className="w-full text-center tracking-widest font-bold text-xl py-3 rounded-xl border-2 border-brand-light focus:border-brand outline-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading
                  ? <Loader2 className="animate-spin" size={18} />
                  : 'تایید و ادامه'
                }
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
