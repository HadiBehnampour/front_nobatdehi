import React from 'react';
import { Activity, AlertCircle, CheckCircle2, Pill, Stethoscope, Scale } from 'lucide-react';

const getBMIColor = (bmi) => {
  if (!bmi) return 'text-gray-400';
  if (bmi < 18.5) return 'text-blue-500';
  if (bmi < 25) return 'text-green-600';
  if (bmi < 30) return 'text-orange-500';
  return 'text-red-600';
};

const LastVisitCard = ({ lastVisit }) => {
  if (!lastVisit) {
    return (
      <div className="bg-white rounded-[2.5rem] p-10 text-center shadow-sm border border-gray-100">
        <p className="text-gray-400">هنوز ویزیت تکمیل‌شده‌ای برای شما ثبت نشده است.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-black text-gray-800 text-xl flex items-center gap-3">
          <Activity className="text-brand" size={24} />
          گزارش آخرین ویزیت
        </h3>
        <div className="flex items-center gap-2">
          {lastVisit.weight && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg flex items-center gap-1">
              <Scale size={12} />
              {lastVisit.weight}kg
              {lastVisit.bmi && (
                <span className={`font-bold ${getBMIColor(lastVisit.bmi)}`}>
                  {' '}BMI: {lastVisit.bmi}
                </span>
              )}
            </span>
          )}
          <span className="bg-brand-light text-brand-dark px-4 py-1.5 rounded-xl text-xs font-bold border border-brand/10">
            {lastVisit.date} • {lastVisit.time}
          </span>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {lastVisit.complaint && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-gray-400 flex items-center gap-1 uppercase tracking-wider">
                <AlertCircle size={14} /> علت مراجعه:
              </span>
              <p className="text-sm text-gray-700 leading-7 font-medium">{lastVisit.complaint}</p>
            </div>
          )}
          {lastVisit.diagnosis && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-gray-400 flex items-center gap-1 uppercase tracking-wider">
                <CheckCircle2 size={14} className="text-green-500" /> تشخیص نهایی:
              </span>
              <p className="text-sm text-gray-700 leading-7">{lastVisit.diagnosis}</p>
            </div>
          )}
        </div>

        {lastVisit.physicalExam && (
          <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
            <h4 className="text-sm font-black text-gray-600 mb-3 flex items-center gap-2">
              <Stethoscope size={18} /> معاینات فیزیکی:
            </h4>
            <p className="text-sm text-gray-700 leading-7">{lastVisit.physicalExam}</p>
          </div>
        )}

        {lastVisit.prescription && (
          <div className="bg-brand-light/20 p-6 rounded-[2rem] border border-brand/10">
            <h4 className="text-sm font-black text-brand-dark mb-3 flex items-center gap-2">
              <Pill size={18} /> نسخه و داروهای تجویز شده:
            </h4>
            <p className="text-sm text-brand-text leading-8">{lastVisit.prescription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LastVisitCard;
