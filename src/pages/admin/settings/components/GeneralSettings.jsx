import React from 'react';

const GeneralSettings = ({ generalInfo, onUpdate }) => {
  const handleChange = (field) => (e) => {
    onUpdate(field, e.target.value);
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 animate-in slide-in-from-right-4">
      <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-4 mb-4">
        اطلاعات عمومی کلینیک
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">
            نام کلینیک / مطب
          </label>
          <input 
            type="text" 
            value={generalInfo.clinicName} 
            onChange={handleChange('clinicName')}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand"
          />
        </div>
        
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">
            نام پزشک
          </label>
          <input 
            type="text" 
            value={generalInfo.doctorName} 
            onChange={handleChange('doctorName')}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-gray-500 mb-1 block">
            تخصص
          </label>
          <input 
            type="text" 
            value={generalInfo.specialty} 
            onChange={handleChange('specialty')}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-gray-500 mb-1 block">
            آدرس دقیق
          </label>
          <textarea 
            rows="2"
            value={generalInfo.address} 
            onChange={handleChange('address')}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand resize-none"
          />
        </div>
        
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">
            تلفن ثابت
          </label>
          <input 
            type="text" 
            value={generalInfo.phone} 
            onChange={handleChange('phone')}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand dir-ltr text-right"
          />
        </div>
        
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">
            موبایل (منشی/پشتیبانی)
          </label>
          <input 
            type="text" 
            value={generalInfo.mobile} 
            onChange={handleChange('mobile')}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand dir-ltr text-right"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;