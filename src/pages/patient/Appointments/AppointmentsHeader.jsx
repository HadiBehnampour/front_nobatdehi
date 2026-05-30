import React from 'react';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft } from 'lucide-react';
import { PERSIAN_MONTHS } from './constants';

const AppointmentsHeader = ({ currentYear, currentMonth, onPrevMonth, onNextMonth }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-brand-light flex justify-between items-center">
      <div>
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <CalendarIcon size={18} className="text-brand" />
          نوبت‌دهی آنلاین
        </h2>
        <p className="text-gray-400 text-xs mt-0.5">زمان مناسب برای ویزیت را انتخاب کنید</p>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onPrevMonth}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ChevronRight size={18} className="text-gray-600" />
        </button>
        <div className="bg-brand text-white px-5 py-2 rounded-xl text-sm font-bold shadow shadow-brand/20 min-w-[120px] text-center">
          {PERSIAN_MONTHS[currentMonth - 1]} {currentYear}
        </div>
        <button onClick={onNextMonth}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default AppointmentsHeader;