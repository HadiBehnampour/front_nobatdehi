import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const AppointmentCalendar = ({
  currentMonth, currentYear, calendarDays, persianMonths,
  selectedDate, onDateSelect, onPrevMonth, onNextMonth, stats,
}) => {

  const getDayClasses = (d) => {
    const base = 'aspect-square rounded-lg text-sm font-medium transition-all flex items-center justify-center relative cursor-pointer';

    if (selectedDate === d.date)
      return `${base} bg-blue-600 text-white shadow-lg ring-2 ring-blue-300`;

    if (d.isToday)
      return `${base} bg-emerald-500 text-white font-bold shadow`;

    if (d.isCustomHoliday)
      return `${base} bg-yellow-100 text-yellow-700 font-bold border border-yellow-300 hover:bg-yellow-200`;

    if (d.isOfficialHoliday || d.isFriday)
      return `${base} bg-red-50 text-red-500 font-bold hover:bg-red-100`;

    if (d.hasAppointment)
      return `${base} text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-700`;

    return `${base} text-gray-400 hover:bg-gray-100`;
  };

  const getTooltip = (d) => {
    if (d.isCustomHoliday) return `تعطیل دستی: ${d.isCustomHoliday}`;
    if (d.isOfficialHoliday) return d.isOfficialHoliday;
    if (d.isFriday) return 'جمعه';
    if (d.hasAppointment) return 'دارای نوبت';
    return '';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">

      {/* ── هدر ماه ── */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrevMonth}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight size={18} className="text-gray-600" />
        </button>
        <div className="text-center">
          <p className="font-bold text-gray-800">{persianMonths[currentMonth - 1]}</p>
          <p className="text-xs text-gray-500">{currentYear}</p>
        </div>
        <button onClick={onNextMonth}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
      </div>

      {/* ── سر هفته ── */}
      <div className="grid grid-cols-7 mb-1">
        {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((d, i) => (
          <div key={d}
            className={`text-center text-xs font-bold py-1 ${i === 6 ? 'text-red-400' : 'text-gray-400'}`}>
            {d}
          </div>
        ))}
      </div>

      {/* ── روزها ── */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((d, idx) => {

          if (d.isBlank) {
            return <div key={`blank-${idx}`} className="aspect-square" />;
          }

          return (
            <button
              key={d.date}
              onClick={() => onDateSelect(d.date)}
              className={getDayClasses(d)}
              title={getTooltip(d)}
            >
              {d.day}

              {/* نقطه آبی = دارای نوبت */}
              {d.hasAppointment && selectedDate !== d.date && !d.isToday && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── راهنمای رنگ‌ها ── */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { color: 'bg-emerald-500', label: 'امروز' },
            { color: 'bg-red-400',     label: 'تعطیل رسمی/جمعه' },
            { color: 'bg-yellow-400',  label: 'تعطیل دستی' },
            { color: 'bg-blue-500',    label: 'دارای نوبت', small: true },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className={`${item.small ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5'} rounded-full ${item.color}`} />
              <span className="text-[10px] text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── آمار روز انتخابی ── */}
      {selectedDate && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          <p className="text-xs font-bold text-gray-500 mb-2">{selectedDate}</p>
          {[
            { label: 'کل نوبت‌ها',    value: stats.total,      color: 'text-gray-700' },
            { label: 'خالی',          value: stats.free,       color: 'text-gray-500' },
            { label: 'رزرو شده',      value: stats.reserved,   color: 'text-blue-600' },
            { label: 'اتاق انتظار',   value: stats.waiting,    color: 'text-purple-600' },
            { label: 'در ویزیت',      value: stats.inProgress, color: 'text-orange-600' },
            { label: 'پایان یافته',   value: stats.completed,  color: 'text-teal-600' },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{s.label}</span>
              <span className={`text-xs font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AppointmentCalendar;