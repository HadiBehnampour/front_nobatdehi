import React, { useState } from 'react';

const PatientsImportModal = ({
  show,
  onClose,
  uploadExcel,
  loading,
  result,
  error,
}) => {
  const [file, setFile] = useState(null);

  if (!show) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert('لطفاً یک فایل اکسل انتخاب کنید.');
      return;
    }
    uploadExcel(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full mx-4 p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">
            آپلود دسته‌ای بیماران (فایل اکسل)
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            بستن ✕
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            قالب فایل باید شامل سه ستون باشد:
            <br />
            <span className="font-semibold text-gray-700">
              نام | نام خانوادگی | شماره تماس
            </span>
          </p>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-700"
          />

          {file && (
            <p className="text-xs text-gray-500 mt-1">
              فایل انتخاب شده: <span className="font-semibold">{file.name}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="mt-2 p-2 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-2 p-3 rounded-lg bg-green-50 text-green-800 text-sm space-y-1 max-h-64 overflow-y-auto">
            <p className="font-semibold">نتیجه آپلود:</p>
            <p>کل ردیف‌ها: {result.total_rows}</p>
            <p>موفق: {result.success_count}</p>
            <p>ناموفق: {result.failed_count}</p>

            {Array.isArray(result.errors) && result.errors.length > 0 && (
              <div className="mt-2 border-t border-green-100 pt-2">
                <p className="font-semibold mb-1">خطاها:</p>
                <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {result.errors.map((err, index) => (
                    <li
                      key={`${err.row}-${index}`}
                      className="text-xs text-green-900 bg-white/60 rounded-md px-2 py-1"
                    >
                      ردیف {err.row}: {err.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
            disabled={loading}
          >
            انصراف
          </button>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm bg-brand-dark text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? 'در حال آپلود...' : 'آپلود'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientsImportModal;
