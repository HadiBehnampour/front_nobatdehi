import React from 'react';
import { Receipt, X, CreditCard, ShieldCheck } from 'lucide-react';
import { PERSIAN_MONTHS, CONSULTATION_PRICE } from './constants';

const PaymentModal = ({
  currentYear,
  currentMonth,
  selectedDay,
  selectedSlot,
  visitReason,
  paymentLoading,
  onClose,
  onPayment,
}) => {
  const monthName = PERSIAN_MONTHS[currentMonth - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative">

        {/* Header */}
        <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              <Receipt className="text-brand" />
              جزئیات و پرداخت
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">

          {/* اطلاعات دکتر */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100 border-dashed">
            <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-lg">دکتر ناصح یوسفی</h4>
              <p className="text-sm text-gray-500">متخصص طب فیزیکی و توانبخشی</p>
            </div>
          </div>

          {/* جزئیات نوبت */}
          <div className="bg-brand-light/20 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">تاریخ نوبت:</span>
              <span className="font-bold text-gray-800">
                {selectedDay} {monthName} {currentYear}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ساعت مراجعه:</span>
              <span className="font-bold text-gray-800">{selectedSlot?.time}</span>
            </div>
            <div className="flex flex-col gap-1 text-sm border-t border-brand/10 pt-2 mt-2">
              <span className="text-gray-500">علت مراجعه:</span>
              <span className="font-bold text-gray-800 text-xs bg-white/50 p-2 rounded-lg border border-brand/5 line-clamp-2">
                {visitReason}
              </span>
            </div>
          </div>

          {/* مبلغ */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>مبلغ کل ویزیت:</span>
              <span>{CONSULTATION_PRICE.toLocaleString()} تومان</span>
            </div>
            <div className="border-t border-gray-200 my-2 pt-2 flex justify-between items-center">
              <span className="font-bold text-gray-800">مبلغ قابل پرداخت:</span>
              <span className="font-black text-xl text-brand">
                {CONSULTATION_PRICE.toLocaleString()}{' '}
                <span className="text-xs font-normal text-gray-500">تومان</span>
              </span>
            </div>
          </div>

          {/* دکمه پرداخت */}
          <button
            onClick={onPayment}
            disabled={paymentLoading}
            className="w-full bg-brand text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-brand/20 hover:bg-brand-dark transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {paymentLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                در حال انتقال به درگاه...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                پرداخت و ثبت نوبت
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
            <ShieldCheck size={12} />
            پرداخت امن از طریق درگاه شاپرک
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;