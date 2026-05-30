import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function PatientHistoryHeader({ patient, appointmentsCount, lastVisitDate, onBack }) {
  return (
    <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
        >
          <ArrowRight size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-gray-800">پرونده: {patient.name}</h2>
          <p className="text-gray-400 text-sm mt-1">
            کد ملی: {patient.nationalId} • {appointmentsCount} مراجعه
            {lastVisitDate && ` • آخرین ویزیت: ${lastVisitDate}`}
          </p>
        </div>
      </div>
    </div>
  );
}
