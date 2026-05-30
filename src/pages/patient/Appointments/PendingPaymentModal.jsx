import React from 'react';
import { Clock, CreditCard, X, AlertTriangle } from 'lucide-react';

const PendingPaymentModal = ({
  appointment,
  timeLeft,
  loading,
  onResume,
  onCancel,
}) => {
  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return '۰:۰۰';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">

        <div className="bg-orange-500 text-white p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">نوبت در انتظار پرداخت</h3>
              <p className="text-sm text-white/80">پرداخت قبلی شما تکمیل نشده است</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 px-6 py-4 flex items-center justify-between border-b border-orange-100">
          <span className="text-sm text-orange-700 font-medium">زمان باقی‌مانده:</span>
          <div className="flex items-center gap-2 text-orange-600">
            <Clock size={18} />
            <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">تاریخ:</span>
              <span className="font-bold text-gray-800">{appointment?.date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ساعت:</span>
              <span className="font-bold text-gray-800">{appointment?.time}</span>
            </div>
            {appointment?.reason && (
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                <span className="text-gray-500">علت مراجعه:</span>
                <span className="font-medium text-gray-700 text-xs truncate max-w-[60%]">
                  {appointment.reason}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={onResume}
              disabled={loading || timeLeft <= 0}
              className="w-full bg-brand text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  در حال انتقال...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  ادامه پرداخت
                </>
              )}
            </button>

            <button
              onClick={onCancel}
              disabled={loading}
              className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-60"
            >
              <X size={18} />
              لغو و انتخاب نوبت جدید
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PendingPaymentModal;