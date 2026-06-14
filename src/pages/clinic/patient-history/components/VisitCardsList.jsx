import React from 'react';
import {
  Clock, CheckCircle, Stethoscope, Calendar,
  AlertCircle, CheckCircle2, Pill
} from 'lucide-react';
import { calcBMI, getBMIColor } from '../utils/bmi';

export default function VisitCardsList({ appointments, heightForBmi }) {
  const completedAppointments = (appointments || []).filter(
    apt => ['completed', 'paid'].includes(apt.status) && apt.encounter
  );

  if (completedAppointments.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] border border-dashed border-gray-200 py-12 text-center">
        <Clock className="mx-auto text-gray-300 mb-3" size={40} />
        <p className="text-gray-400 font-bold">هنوز سابقه‌ای ثبت نشده</p>
        <p className="text-gray-300 text-xs mt-1">بعد از پایان ویزیت، سوابق اینجا نمایش داده می‌شود</p>
      </div>
    );
  }

  const height = heightForBmi ? Number(heightForBmi) : 170;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-700 flex items-center gap-2">
        <CheckCircle size={18} className="text-green-500" />
        سوابق پرونده سلامت
      </h3>

      <div className="relative" dir="rtl">
        {/* خط تایم‌لاین - سمت راست */}
        <div className="absolute right-5 top-0 bottom-0 w-0.5 bg-[#166534]" />

        <div className="space-y-6">
          {completedAppointments.map(apt => {
            const enc = apt.encounter;
            const weight = enc?.weight != null ? Number(enc.weight) : null;
            const aptHeight = enc?.height ? Number(enc.height) : height;
            const bmi = weight != null && aptHeight > 0 ? calcBMI(weight, aptHeight) : null;

            return (
              <div key={apt.id} className="relative pr-14">
                {/* نقطه تایم‌لاین - وسط خط */}
                <div className="absolute right-[17px] top-6 w-4 h-4 rounded-full bg-[#166534] border-2 border-white shadow-md -translate-y-1/2" />

                <div className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                  {/* هدر کارت */}
                  <div className="flex justify-between items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base text-gray-800 flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {apt.date}
                      </span>
                      <span className="text-xs text-gray-400">
                        {apt.time && `• ساعت ${apt.time}`}
                      </span><span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        {apt.visitType || 'حضوری'}
                      </span>
                    </div>

                    {weight != null && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          وزن {weight}kg
                        </span>
                        {bmi != null && (
                          <span className={`text-xs px-2 py-1 rounded-full font-bold bg-gray-100 ${getBMIColor(bmi)}`}>
                            BMI {bmi}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* باکس‌های اطلاعاتی - تراز یکسان */}
                  <div className="space-y-2 text-sm">
			{[
			  { key: 'chiefComplaint', label: 'علت مراجعه',         icon: <AlertCircle  size={14} className="text-gray-400" /> },
			  { key: 'diagnosis',      label: 'تشخیص',         icon: <CheckCircle2 size={14} className="text-gray-400" /> },
			  { key: 'prescription',   label: 'تجویز',         icon: <Pill         size={14} className="text-gray-400" /> },
			  { key: 'physicalExam',   label: 'معاینه فیزیکی', icon: <Stethoscope  size={14} className="text-gray-400" /> },
			].map(({ key, label, icon }) =>
			  enc?.[key] ? (
			    <div key={key} className="flex gap-2 rounded-lg bg-gray-50 px-3 py-2">
			      <span className="flex-shrink-0 mt-0.5">{icon}</span>
			      <span className="w-20 flex-shrink-0 text-xs font-medium text-gray-400">{label}:</span>
			      <span className="text-gray-700 text-sm">{enc[key]}</span>
			    </div>
			  ) : null
			)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
