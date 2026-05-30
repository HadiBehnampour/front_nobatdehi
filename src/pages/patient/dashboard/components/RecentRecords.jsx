import React from 'react';
import { FileText, ChevronLeft } from 'lucide-react';

const RecentRecords = ({ records, navigate }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <FileText size={20} className="text-gray-400" />
          آرشیو سوابق
        </h3>
        <button
          onClick={() => navigate('/patient/records')}
          className="text-xs font-bold text-brand hover:underline flex items-center gap-1 cursor-pointer"
        >
          مشاهده همه
          <ChevronLeft size={14} />
        </button>
      </div>

      <div className="space-y-4">
        {records.length > 0 ? (
          records.map((record) => (
            <div
              key={record.id}
              className="p-4 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-brand-light/20 transition-all cursor-pointer group"
            >
              <span className="text-[10px] font-bold text-gray-400 block mb-1">{record.date}</span>
              <p className="text-sm font-bold text-gray-700 group-hover:text-brand transition-colors">
                {record.title}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-xs text-gray-400">سابقه‌ای یافت نشد</p>
        )}
      </div>
    </div>
  );
};

export default RecentRecords;