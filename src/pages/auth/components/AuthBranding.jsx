// pages/auth/components/AuthBranding.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Calendar, ArrowLeft, ShieldCheck, Clock } from 'lucide-react';
import { AUTH_MESSAGES } from '../constants/messages';

/**
 * Medical Light Blue palette — slightly deeper for better text contrast:
 *   #7AB8E8  -> primary medical blue (deeper for contrast)
 *   #5BA7DF  -> deeper accent
 *   #4A9DDB  -> deepest
 *   #95C8EE  -> lighter side of gradient
 */

// Reusable text-shadow style for readability over blue background
const textShadowSoft = { textShadow: '0 1px 2px rgba(30, 80, 130, 0.25)' };
const textShadowMedium = { textShadow: '0 1px 3px rgba(30, 80, 130, 0.35)' };
const textShadowStrong = { textShadow: '0 2px 6px rgba(30, 80, 130, 0.45)' };

const AuthBranding = () => {
  const navigate = useNavigate();
  const { branding } = AUTH_MESSAGES;

  return (
    <div
      className="w-full md:w-5/12 relative overflow-hidden text-white p-6 md:p-8 flex flex-col justify-between"
      style={{
        background: 'linear-gradient(135deg, #5BA7DF 0%, #7AB8E8 50%, #95C8EE 100%)',
      }}
    >
      {/* Decorative blobs (lighter, behind text) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-16 -right-12 w-56 h-56 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Dark gradient overlay from bottom-left for depth & button contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, transparent 50%, rgba(40, 90, 140, 0.18) 100%)',
        }}
      />

      {/* Top: Logo & Hero */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-6">
          <div
            className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center ring-1 ring-white/50"
            style={{ boxShadow: '0 4px 12px rgba(30, 80, 130, 0.2)' }}
          >
            <Stethoscope className="text-white" size={18} style={textShadowSoft} />
          </div>
          <span className="font-bold text-base tracking-wide" style={textShadowMedium}>
            {branding.clinicName}
          </span>
        </div>

        <h1
          className="text-2xl md:text-3xl font-black mb-3 leading-tight"
          style={textShadowStrong}
        >
          {branding.heroTitle}
          <br />
          <span className="text-white">{branding.heroHighlight}</span>
        </h1>

        <p
          className="text-white text-xs leading-6 mb-5 hidden md:block"
          style={{ ...textShadowSoft, opacity: 0.98 }}
        >
          {branding.description}
        </p>

        {/* Feature highlights with darker chip background for contrast */}
        <ul className="hidden md:flex flex-col gap-2">
          {[
            { icon: ShieldCheck, text: 'احراز هویت امن و بدون رمز' },
            { icon: Clock, text: 'رزرو نوبت در کمتر از ۳۰ ثانیه' },
            { icon: Calendar, text: 'پرونده الکترونیک سلامت' },
          ].map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-2.5 text-xs text-white font-medium"
              style={textShadowSoft}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center backdrop-blur-sm ring-1 ring-white/30"
                style={{
                  background: 'rgba(255, 255, 255, 0.22)',
                  boxShadow: '0 2px 6px rgba(30, 80, 130, 0.15)',
                }}
              >
                <f.icon size={13} />
              </span>
              {f.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom: Quick booking CTA — SOLID white background for clarity */}
      <div className="relative z-10 mt-5">
        <button
          onClick={() => navigate('/patient/appointments')}
          className="group w-full p-3 rounded-xl flex items-center justify-between
            transition-all duration-300 cursor-pointer hover:scale-[1.02]"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#3B8BC9',
            boxShadow: '0 6px 16px rgba(30, 80, 130, 0.25), inset 0 1px 0 rgba(255,255,255,0.5)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#2C7AB8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.color = '#3B8BC9';
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg transition-all"
              style={{ background: 'linear-gradient(135deg, #BCDEFB, #DCEEFB)', color: '#3B8BC9' }}
            >
              <Calendar size={16} />
            </div>
            <div className="text-right">
              <span className="block font-bold text-xs">{branding.quickBook}</span>
              <span className="block text-[10px] opacity-70">
                {branding.quickBookSub}
              </span>
            </div>
          </div>
          <ArrowLeft
            className="transform group-hover:-translate-x-1 transition-transform"
            size={16}
          />
        </button>
      </div>
    </div>
  );
};

export default AuthBranding;
