import React from 'react';
import { CheckCircle, Calendar, Clock, FileText, Home, Plus } from 'lucide-react';

const SuccessModal = ({ bookingResult, onNewBooking, onBackToDashboard }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl p-8 text-center">

        {/* آیکون موفقیت */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">نوبت شما ثبت شد!</h3>
        <p className="text-sm text-gray-400 mb-6">اطلاعات نوبت شما به شرح زیر است</p>

        {/* جزئیات */}
        <div className="bg-gray-50 rounded-2xl p-5 space-y-3 mb-6 text-right">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar size={16} className="text-brand" />
              تاریخ:
            </div>
            <span className="font-bold text-gray-800">{bookingResult.date}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={16} className="text-brand" />
              ساعت:
            </div>
            <span className="font-bold text-gray-800">{bookingResult.time}</span>
          </div>
          {bookingResult.reason && (
            <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-2">
              <div className="flex items-center gap-2 text-gray-500">
                <FileText size={16} className="text-brand" />
                علت مراجعه:
              </div>
              <span className="font-bold text-gray-800 text-xs max-w-[60%] text-left truncate">
                {bookingResult.reason}
              </span>
            </div>
          )}
        </div>

        {/* دکمه‌ها */}
        <div className="space-y-3">
          <button onClick={onBackToDashboard}
            className="w-full py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand-dark transition-all flex items-center justify-center gap-2">
            <Home size={18} />
            بازگشت به داشبورد
          </button>
          <button onClick={onNewBooking}
            className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
            <Plus size={18} />
            رزرو نوبت جدید
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;