import React from 'react';
import { ChevronLeft } from 'lucide-react';

// ✅ تابع کمکی: تبدیل status به tab
const getTabByStatus = (status) => {
  const tabMap = {
    'reserved': 'schedule',
    'confirmed': 'waiting',
    'in_progress': 'doctor',
    'ready_for_payment': 'doctor',
    'paid': 'history',
    'completed': 'history',
  };
  return tabMap[status] || 'schedule';
};

// ✅ تابع کمکی: تاریخ امروز شمسی
const getTodayJalali = () => {
  const parts = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    calendar: 'persian',
  }).formatToParts(new Date());

  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value.padStart(2, '0');
  const day = parts.find(p => p.type === 'day').value.padStart(2, '0');

  return `${year}/${month}/${day}`;
};

const TodaysAppointments = ({ appointments, navigate }) => {

  // ✅ هندلر کلیک روی هر ردیف
  const handleRowClick = (item) => {
    const tab = getTabByStatus(item.status);
    const todayJalali = getTodayJalali();
    navigate(`/admin/appointments?date=${todayJalali}&tab=${tab}`);
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-black text-xl text-gray-800">بیماران امروز</h3>
          <p className="text-xs text-gray-400 mt-1">جهت مدیریت تسویه و سوابق، روی نام بیمار کلیک کنید.</p>
        </div>
        <button
          onClick={() => navigate('/admin/appointments')}
          className="text-sm font-bold text-brand border border-brand/20 px-4 py-2 rounded-xl hover:bg-brand-light transition-colors"
        >
          مدیریت همه نوبت‌ها
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right border-separate border-spacing-y-3">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider">
              <th className="pr-6 pb-2">بیمار</th>
              <th className="pb-2">ساعت نوبت</th>
              <th className="pb-2">علت مراجعه</th>
              <th className="pb-2">وضعیت مالی</th>
              <th className="pl-6 pb-2 text-left">اقدام</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-5 text-gray-400">
                  امروز نوبتی ثبت نشده است.
                </td>
              </tr>
            ) : (
              appointments.map((item, idx) => (
                <tr
                  key={idx}
                  onClick={() => handleRowClick(item)}
                  className="group bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer rounded-2xl"
                >
                  <td className="py-5 pr-6 font-black text-gray-800 rounded-r-2xl border-y border-r border-transparent group-hover:border-brand/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-brand font-black group-hover:bg-brand group-hover:text-white transition-colors">
                        {item.patientName ? item.patientName.charAt(0) : '-'}
                      </div>
                      {item.patientName}
                    </div>
                  </td>
                  <td className="py-5 font-mono font-bold text-gray-500 border-y border-transparent group-hover:border-brand/20">
                    {item.time}
                  </td>
                  <td className="py-5 text-sm text-gray-600 border-y border-transparent group-hover:border-brand/20">
                    {item.reason || 'ویزیت عمومی'}
                  </td>
                  <td className="py-5 border-y border-transparent group-hover:border-brand/20">
                    {item.isPaid ? (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black">
                        تسویه شده
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black animate-pulse">
                        در انتظار تسویه
                      </span>
                    )}
                  </td>
                  <td className="py-5 pl-6 text-left rounded-l-2xl border-y border-l border-transparent group-hover:border-brand/20">
                    <div className="flex items-center justify-end gap-2 text-gray-400 group-hover:text-brand transition-colors">
                      <span className="text-xs font-bold">مدیریت نوبت</span>
                      <ChevronLeft size={16} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodaysAppointments;