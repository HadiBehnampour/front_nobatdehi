import React from 'react';
import { FileText, Phone, User, Loader2, CreditCard } from 'lucide-react';
import { getInsuranceLabel, getInsuranceColor } from '../utils/insurance';

const PatientsTable = ({ loading, patients, openProfileModal, openFinanceModal }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-slate-500 font-bold text-right">نام بیمار</th>
              <th className="px-6 py-4 text-slate-500 font-bold text-right">اطلاعات تماس</th>
              <th className="px-6 py-4 text-slate-500 font-bold text-center">کد ملی</th>
              <th className="px-6 py-4 text-slate-500 font-bold text-center">وضعیت بیمه</th>
              <th className="px-6 py-4 text-slate-500 font-bold text-center">تعداد ویزیت</th>
              <th className="px-6 py-4 text-slate-500 font-bold text-center">آخرین ویزیت</th>
              <th className="px-6 py-4 text-slate-500 font-bold text-left">عملیات مدیریتی</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-20 text-center">
                  <Loader2 className="mx-auto animate-spin text-primary-500" size={30} />
                  <p className="mt-2 text-xs font-bold text-gray-400">در حال دریافت لیست بیماران...</p>
                </td>
              </tr>
            ) : patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient.id} className="group hover:bg-slate-50/40 transition-colors">
                  {/* نام بیمار (بدون کدملی در زیر آن) */}
                  <td className="px-6 py-4 text-right align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-sm">
                        {patient.name ? patient.name.charAt(0) : '-'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">{patient.name}</h4>
                      </div>
                    </div>
                  </td>

                  {/* اطلاعات تماس */}
                  <td className="px-6 py-4 text-right align-middle">
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-mono justify-start">
                      <Phone size={12} className="text-gray-400 shrink-0" />
                      <span style={{ direction: "ltr" }}>{patient.mobile || "—"}</span>
                    </div>
                  </td>

                  {/* کد ملی (ستون مجزا و جدید) */}
                  <td className="px-6 py-4 text-center align-middle font-mono text-xs font-bold text-slate-600">
                    {patient.nationalId || "—"}
                  </td>

                  {/* وضعیت بیمه */}
                  <td className="px-6 py-4 text-center align-middle">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${getInsuranceColor(patient.insuranceType)}`}>
                      {getInsuranceLabel(patient.insuranceType)}
                    </span>
                  </td>

                  {/* تعداد ویزیت */}
                  <td className="px-6 py-4 text-center align-middle">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg inline-block">
                      {patient.totalVisits || 0} ویزیت
                    </span>
                  </td>

                  {/* آخرین ویزیت */}
                  <td className="px-6 py-4 text-center align-middle text-xs font-bold text-slate-600 font-mono">
                    {patient.lastVisitDate || "—"}
                  </td>

                  {/* عملیات مدیریتی */}
                  <td className="px-6 py-4 text-left align-middle">
                    <div className="flex items-center justify-end gap-2">
                      {/* دکمه ۱: مشاهده پرونده پزشکی */}
                      <button onClick={() => openProfileModal(patient)}
                        className="inline-flex items-center gap-1 px-3.5 py-2 bg-primary-50 hover:bg-primary-100 text-primary-600 hover:text-primary-700 rounded-xl text-xs font-bold transition-all border border-primary-100/50" title="مشاهده پرونده بالینی">
                        <FileText size={14} /> پرونده بالینی
                      </button>
                      
                      {/* دکمه ۲: تراکنش‌ها و نوبت‌ها */}
                      <button onClick={() => openFinanceModal(patient)}
                        className="inline-flex items-center gap-1 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 hover:text-amber-700 rounded-xl text-xs font-bold transition-all border border-amber-100" title="امور مالی و نوبت‌ها">
                        <CreditCard size={14} /> پرداخت‌ها و نوبت‌ها
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-16 text-center">
                  <User className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-400 font-bold text-sm">بیماری یافت نشد</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientsTable;