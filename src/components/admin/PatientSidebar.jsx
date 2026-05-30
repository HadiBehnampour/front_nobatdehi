import React from 'react';
import { AlertCircle, Activity, Pill, TrendingUp, MapPin, Phone } from 'lucide-react';

const PatientSidebar = ({ patient }) => (
  <div className="space-y-6">
    {/* اطلاعات پایه */}
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 text-center">
      <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center text-brand text-2xl font-black mx-auto mb-3 border-4 border-white shadow-md">
        {patient.fullName.charAt(0)}
      </div>
      <h3 className="font-black text-gray-800">{patient.fullName}</h3>
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">پرونده فعال #PR-{patient.id}</p>
    </div>

    {/* داروهای مصرفی فعلی */}
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
      <h4 className="text-xs font-black text-gray-400 mb-4 flex items-center gap-2">
        <Pill size={14} className="text-brand" /> داروهای جاری بیمار
      </h4>
      <div className="space-y-2">
        {['متفورمین ۵۰۰ (روزانه)', 'لوزارتان ۲۵ (شب‌ها)'].map((drug, i) => (
          <div key={i} className="text-xs font-bold text-gray-600 bg-gray-50 p-2 rounded-xl border border-gray-100">
            {drug}
          </div>
        ))}
      </div>
    </div>

    {/* نمودار روند وزن (CSS-Based) */}
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
      <h4 className="text-xs font-black text-gray-400 mb-4 flex items-center gap-2">
        <TrendingUp size={14} className="text-blue-500" /> روند تغییرات وزن
      </h4>
      <div className="flex items-end justify-between h-20 gap-1 px-2">
        {[40, 60, 55, 70, 85, 80].map((h, i) => (
          <div key={i} style={{ height: `${h}%` }} className="w-full bg-blue-100 rounded-t-md hover:bg-blue-400 transition-all cursor-help" title={`وزن: ${h+20}kg`}></div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-gray-300 font-bold">
        <span>۶ ماه قبل</span>
        <span>امروز</span>
      </div>
    </div>

    {/* هشدارهای قرمز */}
    <div className="bg-red-50 p-5 rounded-[2rem] border border-red-100">
      <div className="flex items-center gap-2 text-red-600 mb-2 font-black text-xs">
        <AlertCircle size={16} /> حساسیت‌های حیاتی
      </div>
      <p className="text-xs text-red-700 leading-5 font-bold">{patient.allergies}</p>
    </div>
  </div>
);

export default PatientSidebar;