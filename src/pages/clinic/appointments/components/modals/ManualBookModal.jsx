import React from 'react';
import { X, Plus, UserCheck, Loader2 } from 'lucide-react';

const ManualBookModal = ({ form, onChange, onSubmit, onClose, loading, foundPatient, setFoundPatient, freeSlots }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Plus size={20} className="text-blue-600" />رزرو دستی نوبت
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"><X size={18} /></button>
      </div>
      <form onSubmit={onSubmit} className="px-6 py-5 space-y-4 overflow-y-auto">
        {/* تاریخ */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">تاریخ نوبت</label>
          <input type="text" value={form.date} readOnly className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-center font-mono" />
        </div>

        {/* کد ملی - اول از همه */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">کد ملی</label>
          <input type="tel" dir="ltr" placeholder="۱۰ رقم" value={form.nationalId}
            onChange={e => onChange({ ...form, nationalId: e.target.value })}
            readOnly={!!foundPatient}
            className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
              ${foundPatient ? 'border-green-300 bg-green-50' : 'border-gray-200'}`} />
          {!foundPatient && form.nationalId.length > 0 && form.nationalId.length < 10 && (
            <p className="text-[10px] text-gray-400 mt-1">کد ملی باید ۱۰ رقم باشد</p>
          )}
        </div>

        {/* نام بیمار */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">نام بیمار</label>
          <div className="relative">
            <input type="text" placeholder="نام کامل" required value={form.name}
              readOnly={!!foundPatient}
              onChange={e => onChange({ ...form, name: e.target.value })}
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
                ${foundPatient ? 'border-green-300 bg-green-50 text-green-800' : 'border-gray-200'}`} />
            {foundPatient && <UserCheck className="absolute left-3 top-2.5 text-green-600" size={18} />}
          </div>
          {foundPatient && (
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-green-600">✅ بیمار در سیستم شناسایی شد</p>
              <button type="button"
                onClick={() => {
                  setFoundPatient(null);
                  onChange({ ...form, name: '', mobile: '', nationalId: '' });
                }}
                className="text-xs text-red-500 hover:text-red-700">
                ✕ پاک کردن
              </button>
            </div>
          )}
        </div>

        {/* موبایل */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">موبایل</label>
          <input type="tel" dir="ltr" placeholder="09xxxxxxxxx" value={form.mobile}
            onChange={e => onChange({ ...form, mobile: e.target.value })}
            readOnly={!!foundPatient}
            className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
              ${foundPatient ? 'border-green-300 bg-green-50' : 'border-gray-200'}`} />
        </div>

        {/* انتخاب ساعت */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">ساعت نوبت</label>
          <div className="grid grid-cols-5 gap-2 p-3 border border-gray-200 rounded-xl max-h-36 overflow-y-auto">
            {freeSlots.length === 0 ? (
              <p className="col-span-5 text-center text-xs text-gray-400 py-2">نوبت خالی وجود ندارد</p>
            ) : freeSlots.map(slot => (
              <button type="button" key={slot.id} onClick={() => onChange({ ...form, slotId: slot.id })}
                className={`py-2 rounded-lg text-xs font-bold transition-all border
                  ${form.slotId === slot.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        {/* نوع نوبت */}
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">نوع نوبت</label>
          <select value={form.type} onChange={e => onChange({ ...form, type: e.target.value })}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option>حضوری</option>
            <option>تلفنی</option>
          </select>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 className="animate-spin" size={16} /> : 'ثبت نوبت'}
        </button>
      </form>
    </div>
  </div>
);

export default ManualBookModal;