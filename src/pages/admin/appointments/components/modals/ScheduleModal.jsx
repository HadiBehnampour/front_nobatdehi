import React from 'react';
import { X, CalendarPlus, Loader2, Unlock } from 'lucide-react';

const ScheduleModal = ({ form, onChange, onSubmit, onClose, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <CalendarPlus size={20} className="text-blue-600" />باز کردن نوبت‌های جدید
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"><X size={18} /></button>
      </div>
      <form onSubmit={onSubmit} className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">تاریخ (شمسی)</label>
          <input type="text" value={form.targetDate} onChange={e => onChange({ ...form, targetDate: e.target.value })}
            placeholder="مثال: 1403/10/20"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 text-center font-mono" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">ساعت شروع</label>
            <input type="time" value={form.startTime} onChange={e => onChange({ ...form, startTime: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">ساعت پایان</label>
            <input type="time" value={form.endTime} onChange={e => onChange({ ...form, endTime: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">مدت هر نوبت</label>
          <select value={form.duration} onChange={e => onChange({ ...form, duration: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option value="15">۱۵ دقیقه</option>
            <option value="30">۳۰ دقیقه</option>
            <option value="45">۴۵ دقیقه</option>
            <option value="60">۶۰ دقیقه</option>
          </select>
        </div>
        <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
          <input type="checkbox" checked={form.isHolidayOpen} onChange={e => onChange({ ...form, isHolidayOpen: e.target.checked })} className="w-4 h-4 accent-blue-600" />
          <span className="text-sm text-gray-700">باز بودن در تعطیلات</span>
        </label>
        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 className="animate-spin" size={16} /> : <><Unlock size={16} />باز کردن نوبت‌ها</>}
        </button>
      </form>
    </div>
  </div>
);

export default ScheduleModal;