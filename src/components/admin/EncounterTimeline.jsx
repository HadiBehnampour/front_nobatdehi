import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, FileText, Activity } from 'lucide-react';

const EncounterTimeline = ({ history }) => {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="space-y-6 relative before:absolute before:right-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-100">
      {history.map((record) => {
        const isExpanded = expandedId === record.id;
        return (
          <div key={record.id} className="relative pr-12">
            <div className="absolute right-0 top-2 w-8 h-8 rounded-full bg-white border-4 border-brand-light flex items-center justify-center z-10 shadow-sm">
              <div className="w-2 h-2 bg-brand rounded-full"></div>
            </div>

            <div className={`bg-white rounded-[2rem] border transition-all duration-300 ${isExpanded ? 'border-brand shadow-xl' : 'border-gray-100 shadow-sm'}`}>
              {/* خلاصه ویزیت (همیشه نمایان) */}
              <div onClick={() => setExpandedId(isExpanded ? null : record.id)} className="p-6 flex justify-between items-center cursor-pointer">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold"><Calendar size={12}/> {record.date}</div>
                  <h4 className="font-black text-gray-800">{record.diagnosis}</h4>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex gap-2">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-bold">BP: {record.vitals?.bp}</span>
                    <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-[10px] font-bold">{record.vitals?.weight}kg</span>
                  </div>
                  {isExpanded ? <ChevronUp className="text-brand"/> : <ChevronDown className="text-gray-300"/>}
                </div>
              </div>

              {/* جزئیات کامل (فقط هنگام کلیک) */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 space-y-4 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <h5 className="text-[10px] font-black text-gray-400 mb-2 flex items-center gap-1"><Activity size={12}/> معاینات بالینی</h5>
                      <p className="text-xs text-gray-600 leading-6">{record.physicalExam || 'ثبت نشده'}</p>
                    </div>
                    <div className="bg-brand/5 p-4 rounded-2xl border border-brand/10">
                      <h5 className="text-[10px] font-black text-brand mb-2 flex items-center gap-1"><FileText size={12}/> دستورات دارویی</h5>
                      <p className="text-xs text-gray-700 leading-6 font-bold">{record.prescription}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EncounterTimeline;