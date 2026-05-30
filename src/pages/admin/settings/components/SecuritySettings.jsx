import React from 'react';
import { User, Bell, ToggleLeft, ToggleRight } from 'lucide-react';

const SecuritySettings = ({ security, onUpdate }) => {
  const handleChange = (field) => (e) => {
    onUpdate(field, e.target.value);
  };

  const handleToggle = (field) => () => {
    onUpdate(field, !security[field]);
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8 animate-in slide-in-from-right-4">
      
      {/* Password Change */}
      <div>
        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
          <User size={18} />
          تغییر رمز عبور
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              رمز فعلی
            </label>
            <input 
              type="password" 
              value={security.currentPass}
              onChange={handleChange('currentPass')}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand dir-ltr" 
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              رمز جدید
            </label>
            <input 
              type="password" 
              value={security.newPass}
              onChange={handleChange('newPass')}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand dir-ltr" 
            />
          </div>
          
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              تکرار رمز جدید
            </label>
            <input 
              type="password" 
              value={security.confirmPass}
              onChange={handleChange('confirmPass')}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand dir-ltr" 
            />
          </div>
        </div>
      </div>

      {/* SMS Settings */}
      <div>
        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
          <Bell size={18} />
          تنظیمات اطلاع‌رسانی پیامکی
        </h3>
        
        <div className="space-y-4">
          <NotificationToggle
            title="پیامک تایید نوبت"
            description="ارسال پیامک بلافاصله پس از رزرو نوبت توسط بیمار"
            enabled={security.smsBooking}
            onToggle={handleToggle('smsBooking')}
          />
          
          <NotificationToggle
            title="یادآوری روز قبل"
            description="ارسال پیامک یادآوری ۲۴ ساعت قبل از نوبت"
            enabled={security.smsReminder}
            onToggle={handleToggle('smsReminder')}
          />
        </div>
      </div>
    </div>
  );
};

// Sub-component for toggle items
const NotificationToggle = ({ title, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
    <div>
      <h4 className="font-bold text-gray-700 text-sm">{title}</h4>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
    <button 
      onClick={onToggle} 
      className={`text-2xl transition-colors ${enabled ? 'text-brand' : 'text-gray-300'}`}
    >
      {enabled ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
    </button>
  </div>
);

export default SecuritySettings;