// src/pages/patient/payment/VerifyPayment.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { patientService } from '../../../api/services/patient';
import { CheckCircle, XCircle, Loader2, Home, Plus, Calendar, Clock, FileText, Hash } from 'lucide-react';

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const verify = async () => {
      const authority = searchParams.get('Authority');
      const status = searchParams.get('Status');
      const slotId = searchParams.get('slot');

      if (!authority || !slotId) {
        setError('اطلاعات پرداخت ناقص است.');
        setLoading(false);
        return;
      }

      try {
        const res = await patientService.verifyPayment(authority, slotId, status);

        if (res.success) {
          setResult(res);
          localStorage.removeItem('paymentPending');
        } else {
          setError(res.error || 'پرداخت ناموفق بود.');
        }
      } catch (err) {
        setError(err.response?.data?.error || 'خطا در تایید پرداخت');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-brand" size={40} />
        <p className="text-sm text-gray-500">در حال بررسی وضعیت پرداخت...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
            <XCircle size={32} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">پرداخت ناموفق</h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/patient/dashboard')}
              className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <Home size={18} />
              بازگشت به داشبورد
            </button>
            <button
              onClick={() => navigate('/patient/appointments')}
              className="w-full py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand-dark transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              رزرو نوبت جدید
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-green-500" />
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2">پرداخت موفق!</h3>
        <p className="text-sm text-gray-400 mb-4">{result?.message}</p>

        <div className="bg-gray-50 rounded-xl p-4 space-y-3 mb-6 text-right">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar size={15} className="text-brand" />
              تاریخ:
            </div>
            <span className="font-bold text-gray-800">{result?.appointment?.date}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={15} className="text-brand" />
              ساعت:
            </div>
            <span className="font-bold text-gray-800">{result?.appointment?.time}</span>
          </div>

          {result?.appointment?.reason && (
            <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-2">
              <div className="flex items-center gap-2 text-gray-500">
                <FileText size={15} className="text-brand" />
                علت:
              </div>
              <span className="font-bold text-gray-700 text-xs truncate max-w-[60%]">
                {result.appointment.reason}
              </span>
            </div>
          )}

          {result?.refId && (
            <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-2">
              <div className="flex items-center gap-2 text-gray-500">
                <Hash size={15} className="text-brand" />
                کد پیگیری:
              </div>
              <span className="font-bold text-brand font-mono">{result.refId}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-red-500 font-medium mb-4 leading-6">
          لطفا جهت عدم اتلاف وقت و بهبود فرایند معاینه و درمان، تا قبل از مراجعه حضوری اطلاعات پروفایل خود را تکمیل کنید.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/patient/profile')}
            className="w-full py-3 bg-brand text-white rounded-xl font-bold hover:bg-brand-dark transition-all"
          >
            تکمیل اطلاعات
          </button>

          <button
            onClick={() => navigate('/patient/dashboard')}
            className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all"
          >
            بازگشت به داشبورد
          </button>
        </div>
      </div>

    </div>
  );
};

export default VerifyPayment;
