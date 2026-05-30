import React from 'react';
import { Edit, Trash2, FileText, Phone, User, Loader2 } from 'lucide-react';
import { getInsuranceLabel, getInsuranceColor } from '../utils/insurance';

const PatientsTable = ({ loading, patients, openEditModal, goToHistory, handleDelete }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold border-b border-gray-100">
            <tr>
              <th className="py-5 pr-8">نام بیمار</th>
              <th className="py-5">اطلاعات تماس</th>
              <th className="py-5">وضعیت بیمه</th>
              <th className="py-5">آخرین مراجعه</th>
              <th className="py-5 pl-8 text-left">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <Loader2 className="mx-auto animate-spin text-brand" size={30} />
                  <p className="mt-2 text-gray-400">در حال دریافت لیست...</p>
                </td>
              </tr>
            ) : patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient.id} className="group hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 pr-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                        {patient.name ? patient.name.charAt(0) : '-'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-base">{patient.name}</h4>
                        <span className="text-xs text-gray-400 font-mono tracking-wider">{patient.nationalId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Phone size={14} className="text-gray-400" />
                      <span>{patient.mobile}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${getInsuranceColor(patient.insuranceType)}`}>
                      {getInsuranceLabel(patient.insuranceType)}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700">{patient.lastVisitDate || '---'}</span>
                      <span className="text-xs text-gray-400">{patient.totalVisits || 0} ویزیت</span>
                    </div>
                  </td>
                  <td className="py-4 pl-8">
                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(patient)}
                        className="p-2 bg-white border border-gray-200 rounded-xl text-yellow-600 hover:bg-yellow-50 transition-all" title="ویرایش">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => goToHistory(patient)}
                        className="p-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-100 transition-all" title="پرونده کامل">
                        <FileText size={18} />
                      </button>
                      <button onClick={() => handleDelete(patient.id)}
                        className="p-2 bg-white border border-gray-200 rounded-xl text-red-500 hover:bg-red-50 transition-all" title="حذف">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-16 text-center">
                  <User className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-400 font-bold">موردی یافت نشد</p>
                  <p className="text-gray-300 text-sm mt-1">اولین بیمار رو اضافه کنید</p>
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