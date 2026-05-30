// pages/auth/components/OtpStep.jsx
import React, { useRef, useEffect } from 'react';
import { Clock, Loader2, ArrowRight, RotateCw } from 'lucide-react';
import { AUTH_MESSAGES } from '../constants/messages';

const OTP_LENGTH = 5;

const OtpStep = ({
  mobile,
  otp,
  onOtpChange,
  onSubmit,
  onResend,
  onGoBack,
  timer,
  formattedTimer,
  loading,
  error,
}) => {
  const { otpStep } = AUTH_MESSAGES;
  const inputRefs = useRef([]);
  const submittedRef = useRef(false);
  const otpArray = otp.split('').concat(Array(OTP_LENGTH).fill('')).slice(0, OTP_LENGTH);

  useEffect(() => {
    if (otp === '' && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [otp]);

  useEffect(() => {
    if (otp.length === OTP_LENGTH && timer > 0 && !loading && !submittedRef.current) {
      submittedRef.current = true;
      onSubmit();
    }
    if (otp.length < OTP_LENGTH) submittedRef.current = false;
  }, [otp, timer, loading, onSubmit]);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpArray];
    next[index] = digit;
    onOtpChange(next.join(''));
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...otpArray];
      if (otpArray[index]) {
        next[index] = '';
        onOtpChange(next.join(''));
      } else if (index > 0) {
        next[index - 1] = '';
        onOtpChange(next.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowRight' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    onOtpChange(pasted);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const isExpired = timer === 0;
  const hasError = !!error;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back button */}
      <button
        type="button"
        onClick={onGoBack}
        disabled={loading}
        className="text-slate-400 hover:text-[#6CB1E8] flex items-center gap-1.5 text-[11px] font-bold transition-colors disabled:opacity-50"
      >
        <ArrowRight size={13} />
        {otpStep.back}
      </button>

      {/* Header — NO icon box */}
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-slate-800 mb-1.5">{otpStep.title}</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          {otpStep.subtitle}{' '}
          <span dir="ltr" className="font-bold text-slate-700 tracking-wider inline-block">
            {mobile}
          </span>
        </p>
      </div>

      {/* OTP Matrix */}
      <div
        dir="ltr"
        className={`flex justify-center gap-2 ${hasError ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}
      >
        {otpArray.map((val, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={loading || isExpired}
            className={`w-11 h-13 md:w-12 md:h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200
              focus:ring-4
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                hasError
                  ? 'border-rose-300 bg-rose-50/50 text-rose-700'
                  : val
                  ? 'border-[#8BC4F0] bg-[#DCEEFB] text-[#4A9DDB] focus:border-[#6CB1E8] focus:ring-[#BCDEFB]/40'
                  : 'border-slate-200 bg-slate-50/50 text-slate-800 focus:border-[#8BC4F0] focus:bg-white focus:ring-[#BCDEFB]/40'
              }`}
            style={{ height: '52px' }}
          />
        ))}
      </div>

      {/* Inline error / loading row */}
      <div className="min-h-[32px] flex items-center justify-center">
        {loading && (
          <div className="flex items-center gap-2 text-[#6CB1E8] text-xs font-medium">
            <Loader2 className="animate-spin" size={14} />
            در حال بررسی کد...
          </div>
        )}
        {!loading && error && (
          <div className="px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-lg text-center">
            {error}
          </div>
        )}
      </div>

      {/* Timer / Resend area */}
      <div className="flex justify-center items-center text-sm h-9">
        {!isExpired ? (
          <div className="flex items-center gap-2 text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-xs">
            <Clock size={12} />
            <span className="tracking-wider">{formattedTimer}</span>
            <span className="text-[10px] text-slate-400 font-sans mr-1">باقیمانده</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={loading}
            className="text-[#6CB1E8] font-bold hover:text-[#4A9DDB] transition-colors flex items-center gap-1.5 disabled:opacity-50 text-xs"
          >
            <RotateCw size={13} />
            {otpStep.resend}
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpStep;
