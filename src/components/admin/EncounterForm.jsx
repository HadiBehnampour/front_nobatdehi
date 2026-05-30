import React, { useState } from 'react';
import { Clipboard, Save, X, Activity, Thermometer, Weight, Heart } from 'lucide-react';

const EncounterForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    chiefComplaint: '', diagnosis: '', prescription: '', 
    bp: '', hr: '', temp: '', spo2: '', weight: '', physicalExam: ''
  });

  return (
    <div className="bg-white rounded-[3rem] p-8 shadow-2xl border-2 border-brand animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black text-brand flex items-center gap-2">
          <Clipboard size={24} /> ثبت فرم تخصصی معاینه
        </h3>
        <button onClick={onCancel} className="p-2 hover:bg-red-50 text-gray-400 rounded-full transition-colors"><X /></button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
        {/* پنل علائم حیاتی (Vitals) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 flex items-center gap-1"><Activity size={10}/> BP</label>
            <input type="text" placeholder="120/80" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-center focus:border-brand outline-none" onChange={e=>setFormData({...formData, bp: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 flex items-center gap-1"><Heart size={10}/> HR</label>
            <input type="text" placeholder="75" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-center" onChange={e=>setFormData({...formData, hr: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 flex items-center gap-1"><Thermometer size={10}/> Temp</label>
            <input type="text" placeholder="36.5" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-center" onChange={e=>setFormData({...formData, temp: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 flex items-center gap-1">SpO2</label>
            <input type="text" placeholder="98%" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-center" onChange={e=>setFormData({...formData, spo2: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 flex items-center gap-1"><Weight size={10}/> Weight</label>
            <input type="text" placeholder="82kg" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-center" onChange={e=>setFormData({...formData, weight: e.target.value})} />
          </div>
        </div>

        {/* فیلدها با دسترسی لایه‌ای */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-600">شکایت اصلی بیمار (Chief Complaint)</label>
            <textarea rows="2" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:bg-white transition-all outline-none" placeholder="بیمار با درد در ناحیه..." onChange={e=>setFormData({...formData, chiefComplaint: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-600">معاینات فیزیکی (Physical Exam)</label>
            <textarea rows="2" className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:bg-white transition-all outline-none" placeholder="مشاهدات بالینی..." onChange={e=>setFormData({...formData, physicalExam: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-brand">تشخیص و نسخه نهایی</label>
          <textarea rows="3" className="w-full bg-brand/5 border border-brand/20 rounded-2xl p-4 text-sm focus:bg-white transition-all outline-none" placeholder="تشخیص نهایی و دستورات دارویی..." onChange={e=>setFormData({...formData, diagnosis: e.target.value})} />
        </div>

        <button type="submit" className="w-full bg-brand text-white py-4 rounded-[1.5rem] font-black text-lg shadow-xl shadow-brand/20 hover:bg-brand-dark transition-all flex items-center justify-center gap-3">
          <Save size={24} /> ثبت قطعی ویزیت و بروزرسانی پرونده
        </button>
      </form>
    </div>
  );
};

export default EncounterForm;