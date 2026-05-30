// pages/auth/components/PhoneStep.jsx
import React from 'react';
import { Phone, Loader2, ArrowLeft } from 'lucide-react';
import { AUTH_MESSAGES } from '../constants/messages';

const PhoneStep = ({ mobile, onMobileChange, onSubmit, loading, error, isPhoneValid }) => {
  const { phoneStep } = AUTH_MESSAGES;
  const showHint = mobile.length > 0 && !isPhoneValid;

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-slate-800 mb-1.5">{phoneStep.title}</h2>
        <p className="text-xs text-slate-500 leading-relaxed">{phoneStep.subtitle}</p>
      </div>

      {/* Phone Input */}
      <div className="relative group">
        <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
          {phoneStep.label}
        </label>
        <div className="relative">
          <Phone
            className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
              mobile ? 'text-[#6CB1E8]' : 'text-slate-400'
            }`}
            size={18}
          />
          <input
            type="tel"
            dir="ltr"
            inputMode="numeric"
            autoFocus
            placeholder={phoneStep.placeholder}
            className={`w-full bg-slate-50/70 border-2 rounded-xl py-3 pr-11 pl-3 text-left tracking-[0.2em] font-medium text-sm
              text-slate-800 placeholder:text-slate-300 placeholder:tracking-normal
              focus:outline-none focus:bg-white focus:ring-4 transition-all
              ${
                showHint
                  ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                  : 'border-slate-200 focus:border-[#8BC4F0] focus:ring-[#BCDEFB]/40'
              }`}
            value={mobile}
            onChange={(e) => onMobileChange(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="min-h-[16px] mt-1 px-1">
          {showHint && (
            <span className="text-[10px] text-rose-400 animate-in fade-in duration-200">
              {phoneStep.invalid}
            </span>
          )}
        </div>
      </div>

      {/* Server error */}
      {error && (
        <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-lg text-center">
          {error}
        </div>
      )}

      {/* CTA */}
      <button
        type="submit"
        disabled={!isPhoneValid || loading}
        className="w-full h-12 text-white font-bold rounded-xl shadow-lg
          active:scale-[0.98] transition-all flex justify-center items-center gap-2 text-sm
          disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
        style={{
          background: loading || !isPhoneValid
            ? '#A8D2F5'
            : 'linear-gradient(to left, #6CB1E8, #8BC4F0)',
          boxShadow: '0 10px 20px -8px rgba(108, 177, 232, 0.4)',
        }}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            <span>{phoneStep.cta}</span>
            <ArrowLeft size={15} />
          </>
        )}
      </button>

      {/* Trust note */}
      <p className="text-center text-[10px] text-slate-400 leading-relaxed">
        با ادامه، با{' '}
        <span className="text-[#6CB1E8] hover:underline cursor-pointer">قوانین و حریم خصوصی</span>{' '}
        موافقت می‌کنید
      </p>
    </form>
  );
};

export default PhoneStep;
