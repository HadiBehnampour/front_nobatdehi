import React, { useState, useEffect } from 'react';
import { X, Settings, Save, Rocket, Trash2, Plus, Loader2, AlertTriangle, CheckCircle, XCircle, Search } from 'lucide-react';
import { adminService } from '../../../../../api/services/admin';

const DAYS = [
  { key: 'sat', label: 'شنبه' },
  { key: 'sun', label: 'یکشنبه' },
  { key: 'mon', label: 'دوشنبه' },
  { key: 'tue', label: 'سه‌شنبه' },
  { key: 'wed', label: 'چهارشنبه' },
  { key: 'thu', label: 'پنجشنبه' },
  { key: 'fri', label: 'جمعه' },
];

const ScheduleSettingsModal = ({ onClose, onSuccess }) => {   // ✅ اضافه شد: onSuccess
  const [activeTab, setActiveTab] = useState('hours');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  const [slotDuration, setSlotDuration] = useState(30);
  const [workingHours, setWorkingHours] = useState({});
  const [skipHolidays, setSkipHolidays] = useState(true);
  const [customHolidays, setCustomHolidays] = useState([]);
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayReason, setNewHolidayReason] = useState('');

  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const [deleteMode, setDeleteMode] = useState('single');
  const [deleteDate, setDeleteDate] = useState('');
  const [deleteFrom, setDeleteFrom] = useState('');
  const [deleteTo, setDeleteTo] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [deleteResult, setDeleteResult] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await adminService.getScheduleSettings();
        setSlotDuration(data.slotDuration || 30);
        setWorkingHours(data.workingHours || {});
        setSkipHolidays(data.skipOfficialHolidays ?? true);
        setCustomHolidays(data.customHolidays || []);
      } catch (err) {
        console.error('خطا در دریافت تنظیمات:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ═══════════════════════════════════════════════
  // توابع ساعت کاری
  // ═══════════════════════════════════════════════
  const handleSave = async () => {
    setSaving(true);
    try {
      await adminService.saveScheduleSettings({
        slotDuration,
        workingHours,
        skipOfficialHolidays: skipHolidays,
        customHolidays,
      });
      alert('تنظیمات ذخیره شد ✅');
    } catch {
      alert('خطا در ذخیره تنظیمات');
    } finally {
      setSaving(false);
    }
  };

  const updateDay = (dayKey, field, value) => {
    setWorkingHours(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value }
    }));
  };

  const calcSlots = (day) => {
    if (!day?.active || !day?.start || !day?.end) return 0;
    const [sh, sm] = day.start.split(':').map(Number);
    const [eh, em] = day.end.split(':').map(Number);
    const totalMin = (eh * 60 + em) - (sh * 60 + sm);
    return Math.floor(totalMin / slotDuration);
  };

  const addHoliday = () => {
    if (!newHolidayDate) return;
    setCustomHolidays(prev => [...prev, { date: newHolidayDate, reason: newHolidayReason }]);
    setNewHolidayDate('');
    setNewHolidayReason('');
  };

  const removeHoliday = (idx) => {
    setCustomHolidays(prev => prev.filter((_, i) => i !== idx));
  };

  // ═══════════════════════════════════════════════
  // ایجاد نوبت گروهی
  // ═══════════════════════════════════════════════
  const handleBatchCreate = async (mode) => {
    setLoading(true);
    setResult(null);
    try {
      const data = mode === 'custom'
        ? { mode, from: customFrom, to: customTo }
        : { mode };
      const res = await adminService.batchCreateSchedule(data);
      setResult(res);

      // ✅ بعد از ایجاد موفق، تقویم رو رفرش کن
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'خطا در ایجاد نوبت‌ها');
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════
  // حذف نوبت‌ها
  // ═══════════════════════════════════════════════
  const getDeleteDates = () => {
    if (deleteMode === 'single') return { from: deleteDate, to: deleteDate };
    return { from: deleteFrom, to: deleteTo };
  };

  const isDeleteFormValid = () => {
    if (deleteMode === 'single') return deleteDate.length >= 8;
    return deleteFrom.length >= 8 && deleteTo.length >= 8;
  };

  const handleCheckSlots = async () => {
    if (!isDeleteFormValid()) return alert('لطفاً تاریخ را وارد کنید');
    setDeleteLoading(true);
    setCheckResult(null);
    setDeleteResult(null);
    try {
      const { from, to } = getDeleteDates();
      const res = await adminService.checkSlots(from, to);
      setCheckResult(res);
    } catch (err) {
      alert(err.response?.data?.error || 'خطا در بررسی');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteSlots = async (force = false) => {
    if (!isDeleteFormValid()) return;
    setDeleteLoading(true);
    setDeleteResult(null);
    try {
      const { from, to } = getDeleteDates();
      const res = await adminService.deleteSlots({
        mode: deleteMode,
        from,
        to,
        force,
      });
      setDeleteResult(res);
      setCheckResult(null);

      // ✅ بعد از حذف موفق، تقویم رو رفرش کن
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.hasAppointments === false) {
        alert('هیچ نوبتی در این بازه وجود ندارد.');
      } else {
        alert(data?.error || data?.message || 'خطا در حذف نوبت‌ها');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetDeleteForm = () => {
    setCheckResult(null);
    setDeleteResult(null);
  };

  // ═══════════════════════════════════════════════
  // Loading
  // ═══════════════════════════════════════════════
  if (loading && !workingHours.sat) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-2xl p-10">
          <Loader2 className="animate-spin text-blue-500 mx-auto" size={36} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Settings size={20} className="text-blue-600" />
            تنظیمات نوبت‌دهی
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          <button onClick={() => setActiveTab('hours')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2
              ${activeTab === 'hours' ? 'border-blue-600 text-blue-600 bg-blue-50/40' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            🕐 ساعت کاری
          </button>
          <button onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2
              ${activeTab === 'create' ? 'border-blue-600 text-blue-600 bg-blue-50/40' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            📅 ایجاد نوبت‌ها
          </button>
          <button onClick={() => { setActiveTab('delete'); resetDeleteForm(); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2
              ${activeTab === 'delete' ? 'border-red-500 text-red-500 bg-red-50/40' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            🗑️ حذف نوبت‌ها
          </button>
        </div>

        {/* content */}
        <div className="overflow-y-auto flex-1 px-6 py-5" dir="rtl">

          {/* ═══ تب ساعت کاری ═══ */}
          {activeTab === 'hours' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">مدت هر نوبت</label>
                <select value={slotDuration} onChange={e => setSlotDuration(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value={15}>۱۵ دقیقه</option>
                  <option value={30}>۳۰ دقیقه</option>
                  <option value={45}>۴۵ دقیقه</option>
                  <option value={60}>۶۰ دقیقه</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">ساعت کاری هر روز</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 text-xs font-bold text-gray-500">
                    <div className="col-span-3">روز</div>
                    <div className="col-span-2">فعال</div>
                    <div className="col-span-3">شروع</div>
                    <div className="col-span-3">پایان</div>
                    <div className="col-span-1">نوبت</div>
                  </div>
                  {DAYS.map(d => {
                    const day = workingHours[d.key] || {};
                    return (
                      <div key={d.key} className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center border-t border-gray-100">
                        <div className="col-span-3 text-sm font-medium text-gray-700">{d.label}</div>
                        <div className="col-span-2">
                          <input type="checkbox" checked={day.active || false}
                            onChange={e => updateDay(d.key, 'active', e.target.checked)}
                            className="w-4 h-4 accent-blue-600" />
                        </div>
                        <div className="col-span-3">
                          <input type="time" value={day.start || ''} disabled={!day.active}
                            onChange={e => updateDay(d.key, 'start', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded-lg text-xs disabled:bg-gray-100 disabled:text-gray-400" />
                        </div>
                        <div className="col-span-3">
                          <input type="time" value={day.end || ''} disabled={!day.active}
                            onChange={e => updateDay(d.key, 'end', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded-lg text-xs disabled:bg-gray-100 disabled:text-gray-400" />
                        </div>
                        <div className="col-span-1 text-xs text-center font-bold text-gray-500">
                          {day.active ? calcSlots(day) : '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 mb-3">
                  <input type="checkbox" checked={skipHolidays} onChange={e => setSkipHolidays(e.target.checked)}
                    className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm text-gray-700">رد کردن تعطیلات رسمی (نوروز، 13 بدر و...)</span>
                </label>

                <label className="block text-xs font-bold text-gray-500 mb-2">تعطیلات دستی</label>
                <div className="space-y-2 mb-3">
                  {customHolidays.map((h, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gray-700">{h.date}</span>
                        <span className="text-xs text-gray-500">{h.reason}</span>
                      </div>
                      <button onClick={() => removeHoliday(idx)} className="p-1 text-red-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="1404/05/20" value={newHolidayDate}
                    onChange={e => setNewHolidayDate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm text-center font-mono" />
                  <input type="text" placeholder="دلیل (اختیاری)" value={newHolidayReason}
                    onChange={e => setNewHolidayReason(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm" />
                  <button onClick={addHoliday}
                    className="px-3 py-2 bg-yellow-500 text-white rounded-xl text-sm font-bold hover:bg-yellow-600">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button onClick={handleSave} disabled={saving}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} />ذخیره تنظیمات</>}
              </button>
            </div>
          )}

          {/* ═══ تب ایجاد نوبت‌ها ═══ */}
          {activeTab === 'create' && (
            <div className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-600 mb-2">بر اساس تنظیمات ذخیره شده:</p>
                <div className="flex flex-wrap gap-2">
                  {DAYS.filter(d => workingHours[d.key]?.active).map(d => {
                    const day = workingHours[d.key];
                    return (
                      <span key={d.key} className="text-xs bg-white border border-blue-200 rounded-lg px-2 py-1 text-blue-700">
                        {d.label}: {day.start}-{day.end}
                      </span>
                    );
                  })}
                  <span className="text-xs bg-white border border-blue-200 rounded-lg px-2 py-1 text-blue-700">
                    هر {slotDuration} دقیقه
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">ایجاد سریع</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { mode: 'end_of_month', label: 'تا پایان ماه' },
                    { mode: '1month', label: 'یک ماهه' },
                    { mode: '3months', label: 'سه ماهه' },
                    { mode: '6months', label: 'شش ماهه' },
                  ].map(btn => (
                    <button key={btn.mode} onClick={() => handleBatchCreate(btn.mode)} disabled={loading}
                      className="py-4 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-60">
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">یا بازه دلخواه</label>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-400 mb-1">از تاریخ</label>
                    <input type="text" placeholder="1404/04/15" value={customFrom}
                      onChange={e => setCustomFrom(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-center font-mono" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-gray-400 mb-1">تا تاریخ</label>
                    <input type="text" placeholder="1404/05/15" value={customTo}
                      onChange={e => setCustomTo(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-center font-mono" />
                  </div>
                  <button onClick={() => handleBatchCreate('custom')} disabled={loading}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60 flex items-center gap-1.5">
                    {loading ? <Loader2 className="animate-spin" size={14} /> : <Rocket size={14} />}
                    ایجاد
                  </button>
                </div>
              </div>

              {result && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm font-bold text-green-700">✅ {result.message}</p>
                  <div className="flex gap-4 mt-2 text-xs text-green-600">
                    <span>نوبت‌ها: {result.totalSlots}</span>
                    <span>روزها: {result.totalDays}</span>
                    <span>تعطیلات رد شده: {result.skippedHolidays}</span>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-blue-500" size={28} />
                </div>
              )}
            </div>
          )}

          {/* ═══ تب حذف نوبت‌ها ═══ */}
          {activeTab === 'delete' && (
            <div className="space-y-5">

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-700">حذف نوبت‌ها غیرقابل بازگشت است!</p>
                  <p className="text-xs text-red-500 mt-1">
                    نوبت‌های خالی و قفل‌شده حذف می‌شوند. نوبت‌های رزرو شده فقط با تایید شما حذف می‌شوند.
                  </p>
                  <p className="text-xs text-red-400 mt-1">
                    ⚠️ نوبت‌های در اتاق انتظار، اتاق پزشک و تکمیل‌شده <strong>هرگز حذف نمی‌شوند</strong>.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">نوع حذف</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setDeleteMode('single'); resetDeleteForm(); }}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all
                      ${deleteMode === 'single'
                        ? 'border-red-400 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                    📅 یک روز خاص
                  </button>
                  <button
                    onClick={() => { setDeleteMode('range'); resetDeleteForm(); }}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all
                      ${deleteMode === 'range'
                        ? 'border-red-400 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}>
                    📅📅 بازه زمانی
                  </button>
                </div>
              </div>

              {deleteMode === 'single' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">تاریخ روز</label>
                  <input
                    type="text"
                    placeholder="مثال: 1404/04/15"
                    value={deleteDate}
                    onChange={e => { setDeleteDate(e.target.value); resetDeleteForm(); }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-red-300"
                  />
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">از تاریخ</label>
                    <input
                      type="text"
                      placeholder="1404/04/01"
                      value={deleteFrom}
                      onChange={e => { setDeleteFrom(e.target.value); resetDeleteForm(); }}
                      className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-red-300"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">تا تاریخ</label>
                    <input
                      type="text"
                      placeholder="1404/04/31"
                      value={deleteTo}
                      onChange={e => { setDeleteTo(e.target.value); resetDeleteForm(); }}
                      className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-red-300"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleCheckSlots}
                disabled={deleteLoading || !isDeleteFormValid()}
                className="w-full py-3 bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <><Search size={16} />بررسی وضعیت نوبت‌ها</>
                )}
              </button>

              {checkResult && !deleteResult && (
                <div className={`border rounded-xl p-4 ${checkResult.hasAppointments ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                  {!checkResult.hasAppointments ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <XCircle size={18} />
                      <span className="text-sm font-medium">هیچ نوبتی در این بازه وجود ندارد.</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-blue-700 mb-3">📊 وضعیت نوبت‌ها:</p>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-white border border-blue-100 rounded-lg p-2.5 text-center">
                          <span className="block text-lg font-bold text-blue-600">{checkResult.total}</span>
                          <span className="text-[10px] text-gray-500">کل نوبت‌ها</span>
                        </div>
                        <div className="bg-white border border-green-100 rounded-lg p-2.5 text-center">
                          <span className="block text-lg font-bold text-green-600">{checkResult.free}</span>
                          <span className="text-[10px] text-gray-500">خالی</span>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-2.5 text-center">
                          <span className="block text-lg font-bold text-gray-500">{checkResult.cancelled}</span>
                          <span className="text-[10px] text-gray-500">قفل‌شده</span>
                        </div>
                        <div className="bg-white border border-orange-100 rounded-lg p-2.5 text-center">
                          <span className="block text-lg font-bold text-orange-600">{checkResult.reserved}</span>
                          <span className="text-[10px] text-gray-500">رزرو شده</span>
                        </div>
                      </div>

                      {checkResult.hasProtected && (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3 flex items-start gap-2">
                          <AlertTriangle size={16} className="text-purple-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-purple-700">
                            <strong>{checkResult.protected} نوبت</strong> در اتاق انتظار / اتاق پزشک / تکمیل‌شده هستند و
                            <strong> حذف نخواهند شد</strong>.
                          </p>
                        </div>
                      )}

                      {checkResult.reserved > 0 && checkResult.reservedList?.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg overflow-hidden mb-3">
                          <div className="px-3 py-2 bg-yellow-100 text-yellow-800 text-xs font-bold flex items-center gap-1.5">
                            <AlertTriangle size={13} />
                            {checkResult.reserved} نوبت رزرو شده وجود دارد:
                          </div>
                          <div className="max-h-36 overflow-y-auto">
                            {checkResult.reservedList.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between px-3 py-2 border-t border-yellow-100 text-xs">
                                <div className="flex gap-3">
                                  <span className="font-mono text-gray-600">{item.date} - {item.time}</span>
                                  <span className="font-medium text-gray-800">{item.patient}</span>
                                </div>
                                <span className="text-gray-500">{item.mobile}</span>
                              </div>
                            ))}
                          </div>
                          {checkResult.reservedHasMore && (
                            <div className="px-3 py-1.5 bg-yellow-50 text-[10px] text-yellow-600 text-center border-t border-yellow-100">
                              و بیشتر...
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        {checkResult.deletableSafe > 0 && (
                          <button
                            onClick={() => handleDeleteSlots(false)}
                            disabled={deleteLoading}
                            className="w-full py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {deleteLoading
                              ? <Loader2 className="animate-spin" size={16} />
                              : <><Trash2 size={16} />حذف نوبت‌های خالی و قفل‌شده ({checkResult.deletableSafe} نوبت)</>
                            }
                          </button>
                        )}

                        {checkResult.reserved > 0 && (
                          <button
                            onClick={() => handleDeleteSlots(true)}
                            disabled={deleteLoading}
                            className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            {deleteLoading
                              ? <Loader2 className="animate-spin" size={16} />
                              : <><AlertTriangle size={16} />حذف خالی + قفل + رزروها ({checkResult.deletableForce} نوبت) ⚠️</>
                            }
                          </button>
                        )}

                        {checkResult.deletableSafe === 0 && checkResult.reserved === 0 && (
                          <div className="text-center py-3 text-sm text-purple-600 font-medium">
                            همه نوبت‌ها در جریان یا تکمیل‌شده هستند و قابل حذف نیستند.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {deleteResult && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-700">{deleteResult.message}</p>
                      {deleteResult.protectedMessage && (
                        <p className="text-xs text-purple-600 mt-1">🛡️ {deleteResult.protectedMessage}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={resetDeleteForm}
                    className="mt-3 text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    بررسی مجدد
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleSettingsModal;