import React from 'react';
import { Settings, Save, Loader2 } from 'lucide-react';

const SettingsHeader = ({ saving, onSave }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="text-brand-dark" />
          تنظیمات سیستم
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          مدیریت اطلاعات کلینیک و پیکربندی سیستم
        </p>
      </div>
      
      <button 
        onClick={onSave}
        disabled={saving}
        className="bg-brand text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-brand-dark transition-all active:scale-95 disabled:bg-gray-400"
      >
        {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />}
        {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
      </button>
    </div>
  );
};

export default SettingsHeader;