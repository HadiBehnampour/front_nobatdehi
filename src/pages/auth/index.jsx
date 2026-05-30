// pages/auth/index.jsx — Unified Auth Page (Central Container)
import React from 'react';
import useAuth from './hooks/useAuth';

import AuthBranding from './components/AuthBranding';
import PhoneStep from './components/PhoneStep';
import OtpStep from './components/OtpStep';
import ProfileStep from './components/ProfileStep';

const AuthPage = () => {
  const {
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
  } = useAuth();

  // Container sizes — compact!
  // phone/otp -> small card (~720px)
  // profile  -> slightly wider for the form (~820px)
  const maxW = stage === 'profile' ? 'max-w-3xl' : 'max-w-2xl';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      dir="rtl"
      style={{
        background: 'linear-gradient(135deg, #F4FAFF 0%, #FFFFFF 50%, #EAF4FB 100%)',
      }}
    >
      {/* Background ambient lights — softer */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: 'rgba(188, 222, 251, 0.35)' }}
        />
        <div
          className="absolute bottom-[-10%] left-[-8%] w-[350px] h-[350px] rounded-full blur-[80px]"
          style={{ background: 'rgba(220, 238, 251, 0.5)' }}
        />
      </div>

      {/* Main glass card — compact size */}
      <div
        className={`relative z-10 ${maxW} w-full bg-white/95 backdrop-blur-xl
          rounded-[1.75rem] shadow-2xl border border-white/60
          overflow-hidden flex flex-col md:flex-row transition-[max-width] duration-500`}
        style={{
          boxShadow: '0 20px 50px -12px rgba(74, 157, 219, 0.15)',
          minHeight: '480px',
          maxHeight: '92vh',
        }}
      >
        {/* Left: Branding */}
        <AuthBranding />

        {/* Right: Stage Switcher */}
        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-center relative">
          <div className="max-w-sm mx-auto w-full">
            {stage === 'phone' && (
              <PhoneStep
                mobile={mobile}
                onMobileChange={updateMobile}
                onSubmit={handleSendOtp}
                loading={loading}
                error={error}
                isPhoneValid={isPhoneValid}
              />
            )}

            {stage === 'otp' && (
              <OtpStep
                mobile={mobile}
                otp={otp}
                onOtpChange={setOtp}
                onSubmit={handleVerifyOtp}
                onResend={handleSendOtp}
                onGoBack={goBackToPhone}
                timer={timer}
                formattedTimer={formattedTimer}
                loading={loading}
                error={error}
              />
            )}

            {stage === 'profile' && (
              <ProfileStep
                profile={profile}
                onFieldChange={updateProfile}
                onSubmit={handleSubmitProfile}
                loading={loading}
                error={error}
                fieldErrors={fieldErrors}
                mobile={mobile}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
