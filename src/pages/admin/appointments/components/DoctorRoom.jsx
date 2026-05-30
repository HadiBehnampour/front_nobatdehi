import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Phone, Receipt, CheckCircle, FileText, CalendarPlus } from 'lucide-react';

const DoctorRoom = ({
  inProgressPatients,
  readyForPayment,
  onFinishVisit,
  onOpenBilling,
  onOpenPatient,
  onAddDoctorServices,
  onPayServices,
  onNextAppointment,
  selectedDate,          // ✅ اضافه شد
}) => {
  const navigate = useNavigate();

  const goToMedicalRecord = (patient) => {
    if (patient.patientProfileId) {
      // ✅ تاریخ و تب برگشت رو هم میفرستیم
      const params = new URLSearchParams({
        mode: 'visit',
        returnDate: selectedDate || '',
        returnTab: 'doctor',
      });
      navigate(`/admin/patient-history/${patient.patientProfileId}?${params.toString()}`);
    } else {
      alert('پرونده‌ای برای این بیمار ثبت نشده. از بخش «لیست پرونده‌ها» پرونده جدید ایجاد کنید.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Stethoscope className="text-orange-500" size={20} />
          <h2 className="font-bold text-gray-700">در حال ویزیت</h2>
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
            {inProgressPatients.length} بیمار
          </span>
        </div>

        {inProgressPatients.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl py-10 text-center">
            <Stethoscope className="mx-auto mb-2 text-gray-300" size={36} />
            <p className="text-gray-400 text-sm">هیچ بیماری در اتاق پزشک نیست</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {inProgressPatients.map(patient => {
              const paidServices = patient.services?.filter(s => s.is_paid) || [];
              const unpaidServices = patient.services?.filter(s => !s.is_paid) || [];
              const hasUnpaid = unpaidServices.length > 0;

              return (
                <div key={patient.id} className="bg-white border-2 border-orange-200 rounded-xl p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0">
                      <Stethoscope size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-800">{patient.patient}</p>
                        {paidServices.map(s => (
                          <span key={s.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700 border border-green-200">
                            {s.service_name}
                          </span>
                        ))}
                        {unpaidServices.map(s => (
                          <span key={s.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-700 border border-red-200">
                            {s.service_name}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone size={11} /><span dir="ltr">{patient.mobile}</span>
                        </span>
                        <span className="text-xs text-gray-400">نوبت: {patient.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* ردیف اول */}
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <button onClick={() => goToMedicalRecord(patient)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-green-600 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-50 transition-colors">
                      <FileText size={14} />پرونده پزشکی
                    </button>

                    <button onClick={() => onAddDoctorServices(patient)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-purple-600 border border-purple-200 rounded-lg text-xs font-medium hover:bg-purple-50 transition-colors">
                      <Receipt size={14} />خدمات
                    </button>

                    <button onClick={() => onNextAppointment(patient)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 text-indigo-600 border border-indigo-200 rounded-lg text-xs font-medium hover:bg-indigo-50 transition-colors">
                      <CalendarPlus size={14} />نوبت بعدی
                    </button>
                  </div>

                  {/* ردیف دوم */}
                  <div className="grid grid-cols-2 gap-2">
                    {hasUnpaid ? (
                      <button onClick={() => onPayServices(patient)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                        <Receipt size={14} />پرداخت خدمات
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-green-600 bg-green-50 border border-green-200 rounded-lg text-xs font-medium">
                        <CheckCircle size={14} />پرداخت شده
                      </div>
                    )}

                    <button onClick={() => onFinishVisit(patient)}
                      disabled={hasUnpaid}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors
                        ${hasUnpaid
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'}`}>
                      <CheckCircle size={14} />پایان ویزیت
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorRoom;