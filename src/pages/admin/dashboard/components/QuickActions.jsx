import React from 'react';
import { Plus, UserPlus, ChevronLeft } from 'lucide-react';

const QuickActions = ({ navigate }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
      <h3 className="font-black text-gray-800 mb-6">عملیات سریع</h3>
      <div className="space-y-4">
        <button
          onClick={() => navigate('/admin/appointments')}
          className="w-full flex items-center justify-between p-5 bg-brand text-white rounded-[1.5rem] font-bold shadow-lg shadow-brand/20 hover:bg-brand-dark transition-all"
        >
          <div className="flex items-center gap-3">
            <Plus size={24} /> ثبت نوبت جدید
          </div>
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => navigate('/admin/patients')}
          className="w-full flex items-center justify-between p-5 bg-gray-50 text-gray-700 rounded-[1.5rem] font-bold border border-gray-100 hover:bg-gray-100 transition-all"
        >
          <div className="flex items-center gap-3">
            <UserPlus size={24} /> تعریف بیمار جدید
          </div>
          <ChevronLeft size={18} />
        </button>
      </div>
    </div>
  );
};

export default QuickActions;