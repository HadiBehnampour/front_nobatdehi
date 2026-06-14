import React, { useState } from 'react';
import { X, CalendarPlus, Loader2, AlertTriangle, CalendarOff, Clock, Search } from 'lucide-react';
import { adminService } from '../../../../../api/services/admin';

const NextAppointmentModal = ({ patient, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [customDate, setCustomDate] = useState('');

  // محاسبه تاریخ شمسی
  const getJalaliDate = (daysFromNow) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromNow);

    const parts = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      calendar: 'persian',
    }).formatToParts(target);

    const y = parts.find(p => p.type === 'year').value;
    const m = parts.find(p => p.type === 'month').value.padStart(2, '0');
    const d = parts.find(p => p.type === 'day').value.padStart(2, '0');

    return `${y}/${m}/${d}`;
  };

  // دریافت نوبت‌های خالی
  const fetchSlots = async (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSlots([]);
    setMessage(null);
    setLoading(true);

    try {
      const res = await adminService.getAvailableSlots(date);

      if (res.isHoliday) {
        if (res.slots?.length > 0) {
          setSlots(res.slots);
          setMessageType('holiday');
          setMessage(`این روز تعطیل است (${res.holidayReason}) ولی نوبت تعریف شده دارد.`);
        } else {
          setMessageType('holiday');
          setMessage(`این روز تعطیل است: ${res.holidayReason}`);
          setSlots([]);
        }
      } else if (res.noSlots) {
        setMessageType('noSlots');
        setMessage('هنوز نوبتی برای این روز تعریف نشده است.');
        setSlots([]);
      } else {
        setSlots(res.slots || []);
        setMessage(null);
        if (!res.slots?.length) {
          setMessageType('noSlots');
          setMessage('نوبت خالی برای این روز وجود ندارد.');
        }
      }
    } catch {
      setMessageType('error');
      setMessage('خطا در دریافت نوبت‌ها');
    } finally {
      setLoading(false);
    }
  };

  // جستجوی تاریخ دلخواه
  const handleCustomSearch = () => {
    const trimmed = customDate.trim();
    if (!trimmed) return;
    fetchSlots(trimmed);
  };

  // ثبت نوبت
  const handleBook = async () => {
    if (!selectedSlot) return;
    setLoading(true);
    try {
      await adminService.bookNextAppointment({
        slotId: selectedSlot,
        mobile: patient.mobile,
        name: patient.patient,
        type: 'حضوری',
      });
      alert('نوبت بعدی با موفقیت ثبت شد ✅');
      onSuccess?.();
      onClose();
    } catch {
      alert('خطا در ثبت نوبت');
    } finally {
      setLoading(false);
    }
  };

  const oneWeekDate = getJalaliDate(7);
  const oneMonthDate = getJalaliDate(30);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* هدر */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <CalendarPlus size={20} className="text-indigo-600" />
            نوبت بعدی: {patient?.patient}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* دکمه‌های سریع */}
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">انتخاب سریع:</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => fetchSlots(oneWeekDate)}
                className={`py-4 rounded-xl text-sm font-bold transition-all border-2
                  ${selectedDate === oneWeekDate
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}>
                <div>۱ هفته بعد</div>
                <div className="text-[10px] font-mono text-gray-400 mt-1">{oneWeekDate}</div>
              </button>

              <button onClick={() => fetchSlots(oneMonthDate)}
                className={`py-4 rounded-xl text-sm font-bold transition-all border-2
                  ${selectedDate === oneMonthDate
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}>
                <div>۱ ماه بعد</div>
                <div className="text-[10px] font-mono text-gray-400 mt-1">{oneMonthDate}</div>
              </button>
            </div>
          </div>

          {/* تاریخ دلخواه */}
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1.5">یا تاریخ دلخواه:</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="1404/05/15"
                value={customDate}
                onChange={e => setCustomDate(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCustomSearch(); } }}
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button onClick={handleCustomSearch}
                disabled={!customDate.trim() || loading}
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                <Search size={14} />جستجو
              </button>
            </div>
          </div>

          {/* لودینگ */}
          {loading && (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-indigo-500" size={28} />
            </div>
          )}

          {/* پیام‌ها */}
          {!loading && message && (
            <div className={`flex items-center gap-3 p-4 rounded-xl border
              ${messageType === 'holiday'
                ? 'bg-red-50 border-red-200 text-red-700'
                : messageType === 'noSlots'
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}>
              {messageType === 'holiday' && <CalendarOff size={20} className="flex-shrink-0" />}
              {messageType === 'noSlots' && <AlertTriangle size={20} className="flex-shrink-0" />}
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* لیست نوبت‌ها */}
          {!loading && slots.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 mb-2">
                نوبت‌های خالی {selectedDate}:
              </p>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                {slots.map(slot => (
                  <button key={slot.id} onClick={() => setSelectedSlot(slot.id)}
                    className={`py-2.5 rounded-lg text-xs font-bold transition-all border-2 flex items-center justify-center gap-1
                      ${selectedSlot === slot.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}>
                    <Clock size={12} />
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* دکمه ثبت */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          <button onClick={handleBook}
            disabled={!selectedSlot || loading}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="animate-spin" size={16} /> : (
              <><CalendarPlus size={16} />ثبت نوبت بعدی</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NextAppointmentModal;