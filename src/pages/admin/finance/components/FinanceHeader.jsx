import React, { useState } from 'react';
import { FileSpreadsheet, Wallet } from 'lucide-react';
import ExportModal from './ExportModal';

export default function FinanceHeader() {
  const [showExport, setShowExport] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center text-brand">
              <Wallet size={24} />
            </div>
            مدیریت مالی و تراز کل
          </h2>
          <p className="text-gray-400 text-sm mt-1 mr-14">گزارش لحظه‌ای درآمدها و تراز صندوق</p>
        </div>

        <button
          onClick={() => setShowExport(true)}
          className="bg-brand-dark text-white px-8 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-black transition shadow-lg"
        >
          <FileSpreadsheet size={18} /> خروجی اکسل
        </button>
      </div>

      <ExportModal open={showExport} onClose={() => setShowExport(false)} />
    </>
  );
}