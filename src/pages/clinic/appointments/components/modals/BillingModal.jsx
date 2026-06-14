// components/modals/BillingModal.jsx

import React from 'react';
import { X, Receipt, CheckCircle, Loader2, Plus, Minus } from 'lucide-react';
import { CLINIC_SERVICES } from '../../hooks/useAppointments';

const BillingModal = ({
  patient,
  selectedServices,
  onToggle,
  onUpdateQuantity,
  onFinalize,
  onClose,
  loading,
  mode = 'admin',
}) => {

  // ─── حالت پرداخت ───
  if (mode === 'pay') {
    const unpaidServices = patient?.services?.filter(s => !s.is_paid) || [];
    const total = unpaidServices.reduce((sum, s) => sum + s.price, 0);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Receipt size={20} className="text-blue-600" />
              پرداخت خدمات: {patient?.patient}
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-4 max-h-64 overflow-y-auto">
            {unpaidServices.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-4">همه خدمات پرداخت شده‌اند ✅</p>
            ) : (
              <>
                <p className="text-xs font-medium text-gray-500 mb-3">خدمات پرداخت نشده:</p>
                <div className="space-y-2">
                  {unpaidServices.map(s => (
                    <div key={s.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-red-200 bg-red-50">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        <span className="text-sm font-medium text-gray-700">{s.service_name}</span>
                        <span className="text-[10px] text-gray-400">
                          ({s.added_by === 'doctor' ? 'پزشک' : 'منشی'})
                        </span>
                      </div>
                      <span className="text-xs font-mono text-gray-600">{s.price.toLocaleString()} تومان</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">مبلغ پرداخت:</span>
              <span className="text-xl font-black text-gray-800">
                {total.toLocaleString()} <span className="text-xs text-gray-400">تومان</span>
              </span>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                انصراف
              </button>
              <button onClick={() => onFinalize(patient.id)}
                disabled={loading || unpaidServices.length === 0}
                className="flex-[2] py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 className="animate-spin" size={16} /> :
                  <><CheckCircle size={16} />ثبت و پرداخت</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── حالت ثبت خدمات (منشی / پزشک) ───
  const alreadyAdded = patient?.services?.map(s => s.service_id) || [];
  const isDoctor = mode === 'doctor';

  const total = Object.entries(selectedServices).reduce((sum, [id, qty]) => {
    const service = CLINIC_SERVICES.find(s => s.id === id);
    if (!service) return sum;
    return sum + (service.price * qty);
  }, 0);

  const hasSelectedServices = Object.keys(selectedServices).length > 0;

  // ✅ فیکس: کلاس‌های ثابت به جای داینامیک
  const getSelectedStyle = () => {
    return isDoctor
      ? 'border-purple-400 bg-purple-50'
      : 'border-blue-400 bg-blue-50';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Receipt size={20} className={isDoctor ? "text-purple-600" : "text-blue-600"} />
            {isDoctor ? 'ثبت خدمات:' : 'پرداخت خدمات:'} {patient?.patient}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* services list */}
        <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
          <p className="text-xs font-medium text-gray-500 mb-3">
            {isDoctor ? 'خدمات مورد نیاز بیمار را انتخاب کنید:' : 'خدمات را انتخاب کنید:'}
          </p>
          <div className="space-y-2">
            {CLINIC_SERVICES.map(s => {
              const isAlreadyAdded = alreadyAdded.includes(s.id);
              const isSelected = selectedServices[s.id] !== undefined;
              const qty = selectedServices[s.id] || 1;

              return (
                <div key={s.id}>
                  {/* ── ردیف اصلی سرویس ── */}
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors
                      ${isAlreadyAdded
                        ? 'border-green-300 bg-green-50 opacity-60 cursor-not-allowed'
                        : isSelected
                          ? getSelectedStyle()
                          : 'border-gray-100 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isAlreadyAdded || isSelected}
                        disabled={isAlreadyAdded}
                        onChange={() => !isAlreadyAdded && onToggle(s.id)}
                        className={`w-4 h-4 rounded ${isDoctor ? 'accent-purple-600' : 'accent-blue-600'}`}
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-700">{s.name}</span>
                        {s.hasQuantity && (
                          <span className="text-[10px] text-gray-400">
                            (هر {s.unitLabel || 'عدد'})
                          </span>
                        )}
                      </div>
                      {isAlreadyAdded && <span className="text-[10px] text-green-600">✅ ثبت شده</span>}
                    </div>
                    <span className="text-xs font-mono text-gray-500">
                      {s.price.toLocaleString()}
                    </span>
                  </label>

                  {/* ── ✅ کنترل تعداد ── */}
                  {isSelected && s.hasQuantity && !isAlreadyAdded && (
                    <div className={`mx-3 mt-1 mb-2 flex items-center justify-between rounded-lg px-4 py-2.5 border
                      ${isDoctor ? 'bg-purple-50/50 border-purple-200' : 'bg-blue-50/50 border-blue-200'}`}>
                      <span className="text-xs text-gray-500">
                        تعداد {s.unitLabel || 'عدد'}:
                      </span>

                      <div className="flex items-center gap-3">
                        {/* کاهش */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onUpdateQuantity(s.id, qty - 1);
                          }}
                          disabled={qty <= (s.minQty || 1)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all
                            ${qty <= (s.minQty || 1)
                              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                              : 'bg-red-100 text-red-600 hover:bg-red-200 active:scale-95'
                            }`}
                        >
                          <Minus size={14} />
                        </button>

                        {/* عدد */}
                        <span className="w-6 text-center font-bold text-base text-gray-800">
                          {qty}
                        </span>

                        {/* افزایش */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onUpdateQuantity(s.id, qty + 1);
                          }}
                          disabled={qty >= (s.maxQty || 10)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all
                            ${qty >= (s.maxQty || 10)
                              ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                              : 'bg-green-100 text-green-600 hover:bg-green-200 active:scale-95'
                            }`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* قیمت کل */}
                      <span className={`text-xs font-bold min-w-[90px] text-left
                        ${isDoctor ? 'text-purple-600' : 'text-blue-600'}`}>
                        {(s.price * qty).toLocaleString()} ت
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* total + actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">{isDoctor ? 'مبلغ خدمات:' : 'مبلغ پرداخت:'}</span>
            <span className="text-xl font-black text-gray-800">
              {total.toLocaleString()} <span className="text-xs text-gray-400">تومان</span>
            </span>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              انصراف
            </button>
            <button onClick={() => onFinalize(patient.id)}
              disabled={loading || !hasSelectedServices}
              className={`flex-[2] py-2.5 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60
                ${isDoctor ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'}`}>
              {loading ? <Loader2 className="animate-spin" size={16} /> :
                <><CheckCircle size={16} />{isDoctor ? 'ثبت خدمات' : 'ثبت و پرداخت'}</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingModal;