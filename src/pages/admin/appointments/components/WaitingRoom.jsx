import React from 'react';
import { Users, Stethoscope, Phone, Receipt, User } from 'lucide-react';

const WaitingRoom = ({ waitingPatients, onStartVisit, onOpenBilling, onOpenPatient }) => {

  const isPatientInfoIncomplete = (patient) => {
    return patient.patientInfoCompleted === false;
  };

  const hasRegisteredServices = (patient) => {
    return patient.services && patient.services.length > 0;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="text-purple-600" size={20} />
          <h2 className="font-bold text-gray-700">اتاق انتظار</h2>
        </div>
        <span className="text-sm text-gray-500">{waitingPatients.length} بیمار در انتظار</span>
      </div>

      {waitingPatients.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl py-16 text-center">
          <Users className="mx-auto mb-3 text-gray-300" size={48} />
          <p className="text-gray-400 text-sm font-medium">اتاق انتظار خالی است</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {waitingPatients.map((patient, idx) => {

            console.log("PATIENT DATA:", patient);

            const incompletePatientInfo = isPatientInfoIncomplete(patient);
            const hasServices = hasRegisteredServices(patient);
            const hasUnpaidServices = hasServices
              ? patient.services.some((s) => !s.is_paid)
              : true;

            const disableStartVisit =
              incompletePatientInfo || !hasServices || hasUnpaidServices;

            return (
              <div
                key={patient.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:border-purple-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-800">{patient.patient}</p>
                        {patient.services?.filter((s) => s.is_paid).map((s) => (
                          <span
                            key={s.id}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 border border-green-200"
                          >
                            {s.service_name}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone size={11} />
                          <span dir="ltr">{patient.mobile}</span>
                        </span>
                        <span className="text-xs text-gray-400">نوبت: {patient.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <button
                        onClick={() => onOpenPatient(patient)}
                        className="flex items-center gap-1 px-3 py-1.5 text-gray-600 border border-gray-200 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                      >
                        <User size={13} />
                        اطلاعات
                      </button>
                      {incompletePatientInfo && (
                        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full" />
                      )}
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => onOpenBilling(patient)}
                        className="flex items-center gap-1 px-3 py-1.5 text-blue-600 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors"
                      >
                        <Receipt size={13} />
                        پرداخت
                      </button>
                      {(!hasServices || hasUnpaidServices) && (
                        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full" />
                      )}
                    </div>

                    <button
                      onClick={() => onStartVisit(patient)}
                      disabled={disableStartVisit}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                        disableStartVisit
                          ? 'bg-orange-300 text-white cursor-not-allowed'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      <Stethoscope size={15} />
                      شروع ویزیت
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;
