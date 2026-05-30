import React, { useState } from 'react';
import { X, FileSpreadsheet, Calendar, Loader2 } from 'lucide-react';
import { adminService } from '../../../../api';

const MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export default function ExportModal({ open, onClose }) {
  const [mode, setMode] = useState('month'); // 'month' | 'range'
  const [selectedYear, setSelectedYear] = useState(1404);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleExport = async () => {
    setLoading(true);
    try {
      let params = {};

      if (mode === 'month' && selectedMonth) {
        params = { type: 'month', year: selectedYear, month: selectedMonth };
      } else if (mode === 'range' && dateFrom && dateTo) {
        params = { type: 'range', from: dateFrom, to: dateTo };
      } else {
        alert('لطفاً بازه زمانی را مشخص کنید.');
        setLoading(false);
        return;
      }

      const response = await adminService.exportFinanceExcel(params);

      // دانلود فایل
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const fileName =
        mode === 'month'
          ? `گزارش-مالی-${MONTHS[selectedMonth - 1]}-${selectedYear}.xlsx`
          : `گزارش-مالی-${dateFrom}-تا-${dateTo}.xlsx`;

      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.error('خطا در دریافت خروجی:', error);
      alert('خطا در دریافت خروجی اکسل');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="bg-white rounded-[2.5rem] w-full max-w-lg mx-4 p-8 shadow-2xl animate-in fade-in zoom-in duration-300"
        dir="rtl"
      >
        {/* هدر */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <FileSpreadsheet size={20} />
            </div>
            خروجی اکسل
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* تب‌ها */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6">
          <button
            onClick={() => setMode('month')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${
              mode === 'month' ? 'bg-white text-brand shadow-sm' : 'text-gray-400'
            }`}
          >
            انتخاب ماه
          </button>
          <button
            onClick={() => setMode('range')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${
              mode === 'range' ? 'bg-white text-brand shadow-sm' : 'text-gray-400'
            }`}
          >
            بازه دلخواه
          </button>
        </div>

        {/* محتوا */}
        {mode === 'month' ? (
          <div>
            {/* انتخاب سال */}
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm font-bold text-gray-500">سال:</label>
              <div className="flex gap-2">
                {[1403, 1404].map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                      selectedYear === y
                        ? 'bg-brand text-white shadow-md'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* انتخاب ماه */}
            <div className="grid grid-cols-4 gap-2">
              {MONTHS.map((name, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMonth(idx + 1)}
                  className={`py-3 rounded-xl text-xs font-bold transition-all ${
                    selectedMonth === idx + 1
                      ? 'bg-brand text-white shadow-md scale-105'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-gray-400 font-bold">
              تاریخ شمسی وارد کنید (مثال: 1404/03/01)
            </p>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 mb-1 block">از تاریخ</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="1404/03/01"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-sm text-left direction-ltr focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 mb-1 block">تا تاریخ</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="1404/03/31"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pr-10 pl-4 text-sm text-left direction-ltr focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* دکمه دانلود */}
        <button
          onClick={handleExport}
          disabled={loading || (mode === 'month' && !selectedMonth) || (mode === 'range' && (!dateFrom || !dateTo))}
          className="w-full mt-8 bg-brand text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-brand-dark transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> در حال آماده‌سازی...
            </>
          ) : (
            <>
              <FileSpreadsheet size={18} /> دانلود خروجی اکسل
            </>
          )}
        </button>
      </div>
    </div>
  );
}