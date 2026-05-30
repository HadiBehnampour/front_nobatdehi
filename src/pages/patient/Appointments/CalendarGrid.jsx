import React from 'react';
import { Loader2 } from 'lucide-react';
import { WEEKDAY_LABELS, PERSIAN_MONTHS } from './constants';

const getTodayJalali = () => {
  const parts = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    year: 'numeric', month: 'numeric', day: 'numeric', calendar: 'persian',
  }).formatToParts(new Date());

  return {
    year: parseInt(parts.find(p => p.type === 'year').value),
    month: parseInt(parts.find(p => p.type === 'month').value),
    day: parseInt(parts.find(p => p.type === 'day').value),
  };
};

const CalendarGrid = ({ currentYear, currentMonth, monthInfo, monthLoading, selectedDay, onDaySelect }) => {

  if (monthLoading || !monthInfo) {
    return (
      <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-brand-light flex items-center justify-center h-[320px]">
        <Loader2 className="animate-spin text-brand" size={30} />
      </div>
    );
  }

  const { daysInMonth, firstDayOffset, officialHolidays, customHolidays, daysWithFreeSlots, today } = monthInfo;
  const todayJ = getTodayJalali();
  const isCurrentMonth = currentYear === todayJ.year && currentMonth === todayJ.month;
  const isPastMonth = currentYear < todayJ.year || (currentYear === todayJ.year && currentMonth < todayJ.month);

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-brand-light">

      {/* هدر */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-700 text-sm">
          تقویم <span className="text-brand">{PERSIAN_MONTHS[currentMonth - 1]} {currentYear}</span>
        </h3>
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-brand shadow-sm"></span>
            <span className="text-gray-600">نوبت آزاد</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-200"></span>
            <span className="text-gray-600">بدون نوبت</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="text-gray-600">تعطیل</span>
          </div>
        </div>
      </div>

      {/* سر هفته */}
      <div className="grid grid-cols-7 text-center mb-2">
        {WEEKDAY_LABELS.map((label, i) => (
          <div key={label} className={`text-xs font-bold py-1 ${i === 6 ? 'text-red-400' : 'text-gray-400'}`}>
            {label}
          </div>
        ))}
      </div>

      {isPastMonth ? (
        <div className="text-center py-12 text-gray-300 text-sm">این ماه گذشته است</div>
      ) : (
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`}></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dayIndex = (firstDayOffset + i) % 7;
            const isFriday = dayIndex === 6;
            const isToday = today === dayNum;
            const isSelected = selectedDay === dayNum;
            const hasFreeSlots = daysWithFreeSlots?.includes(dayNum) || false;
            const isOfficialHoliday = officialHolidays?.[String(dayNum)] || null;
            const isCustomHoliday = customHolidays?.[String(dayNum)] || null;
            const isHoliday = isFriday || !!isOfficialHoliday || !!isCustomHoliday;
            const isPast = isCurrentMonth && dayNum < todayJ.day;
            
            // ✅ منطق جدید: فقط روزهایی که نوبت دارن قابل کلیک باشن
            const isClickable = !isPast && hasFreeSlots;
            const isDisabled = isPast || !hasFreeSlots;

            return (
              <button
                key={dayNum}
                disabled={isDisabled}
                onClick={() => isClickable && onDaySelect(dayNum)}
                title={
                  isCustomHoliday || isOfficialHoliday || 
                  (isFriday ? 'جمعه' : '') ||
                  (hasFreeSlots ? 'نوبت آزاد دارد' : 'نوبت آزاد ندارد')
                }
                className={`
                  w-full aspect-square rounded-xl flex items-center justify-center text-sm font-bold 
                  transition-all duration-200 relative
                  ${isSelected
                    ? 'bg-brand text-white shadow-lg scale-110 z-10 ring-2 ring-brand/30'
                    : isPast
                          ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                          : isHoliday && !hasFreeSlots
                            ? 'bg-red-50 text-red-300 cursor-not-allowed'
                            : isHoliday && hasFreeSlots
                              ? 'bg-red-50 text-red-500 hover:bg-red-100 hover:scale-105 cursor-pointer ring-2 ring-brand/40'
                              : hasFreeSlots
                                ? 'bg-brand/10 text-brand hover:bg-brand/20 hover:scale-105 cursor-pointer ring-1 ring-brand/30'
                                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isToday ? 'امروز' : dayNum}
                
                {/* ✅ نشانگر نوبت آزاد */}
                {hasFreeSlots && !isSelected && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                )}
                
                {/* ❌ نشانگر بدون نوبت */}
                {!hasFreeSlots && !isPast && !isHoliday && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-300"></span>
                )}
              </button>
            );
          })}
        </div>
      )}
      
    </div>
  );
};

export default CalendarGrid;
