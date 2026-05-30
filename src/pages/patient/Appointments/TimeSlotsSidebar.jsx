import React from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, Edit3, Loader2, LogIn } from 'lucide-react';
import { PERSIAN_MONTHS } from './constants';

const TimeSlotsSidebar = ({
  currentYear,
  currentMonth,
  selectedDay,
  slots,
  slotsLoading,
  selectedSlot,
  visitReason,
  onSlotSelect,
  onVisitReasonChange,
  onContinueToPayment,
}) => {
  const monthName = PERSIAN_MONTHS[currentMonth - 1];
  
  // ✅ چک کردن لاگین
  const isLoggedIn = !!localStorage.getItem('access');

  if (!selectedDay) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-brand-light flex flex-col">
        <h3 className="font-bold text-gray-800 text-sm mb-3 border-b border-gray-100 pb-3">
          انتخاب ساعت
        </h3>
        <div className="flex flex-col items-center justify-center text-gray-300 gap-3 py-12">
          <CalendarIcon size={44} className="opacity-20" />
          <p className="text-sm text-center">یک روز از تقویم انتخاب کنید</p>
        </div>
      </div>
    );
  }

  if (slotsLoading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-brand-light flex flex-col">
        <h3 className="font-bold text-gray-800 text-sm mb-3 border-b border-gray-100 pb-3">
          {selectedDay} {monthName}
        </h3>
        <div className="flex flex-col items-center justify-center text-brand gap-3 py-12">
          <Loader2 className="animate-spin" size={30} />
          <p className="text-sm animate-pulse">دریافت نوبت‌ها...</p>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-brand-light flex flex-col">
        <h3 className="font-bold text-gray-800 text-sm mb-3 border-b border-gray-100 pb-3">
          {selectedDay} {monthName}
        </h3>
        <div className="flex flex-col items-center justify-center text-gray-300 gap-3 py-12">
          <CalendarIcon size={44} className="opacity-20" />
          <p className="text-sm text-center text-gray-400">نوبت خالی وجود ندارد</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-brand-light flex flex-col">

      <h3 className="font-bold text-gray-800 text-sm mb-3 border-b border-gray-100 pb-3 flex items-center justify-between">
        <span>{selectedDay} {monthName}</span>
        <span className="text-xs text-gray-400 font-normal">{slots.length} نوبت</span>
      </h3>

      {/* نوبت‌ها - Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => onSlotSelect(slot)}
            className={`
              py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-sm font-bold transition-all border
              ${selectedSlot?.id === slot.id
                ? 'bg-brand text-white border-brand shadow-md'
                : 'bg-white border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
              }
            `}
          >
            <Clock size={14} className={selectedSlot?.id === slot.id ? 'text-white' : 'text-brand'} />
            {slot.time}
          </button>
        ))}
      </div>

      {/* فرم علت مراجعه */}
      {selectedSlot && (
        <div className="pt-3 border-t border-gray-100 space-y-3 animate-in slide-in-from-bottom-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
              <Edit3 size={12} className="text-brand" />
              علت مراجعه (الزامی):
            </label>
            <textarea
              value={visitReason}
              onChange={(e) => onVisitReasonChange(e.target.value)}
              placeholder="مثال: درد شدید در ناحیه گردن..."
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-brand focus:bg-white transition-all text-sm outline-none resize-none h-16"
            />
          </div>

          {/* ✅ دکمه بر اساس وضعیت لاگین */}
          <button
            onClick={onContinueToPayment}
            disabled={!visitReason.trim()}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              visitReason.trim()
                ? 'bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-dark'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoggedIn ? (
              <>
                ادامه و پرداخت
                <ChevronLeft size={18} />
              </>
            ) : (
              <>
                <LogIn size={18} />
                ورود و پرداخت
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeSlotsSidebar;