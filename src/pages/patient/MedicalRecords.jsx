import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Pill, Activity,
  AlertCircle, Calendar, User,
  ClipboardList, CheckCircle2, History,
  Loader2, Scale, Ruler, Stethoscope
} from 'lucide-react';
import { patientService } from '../../api';

const MedicalRecords = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const res = await patientService.getMedicalRecords();
        setData(res);
      } catch (error) {
        console.error('خطا در دریافت پرونده پزشکی:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin text-brand" size={40} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="text-red-400" size={48} />
        <p className="text-gray-500 font-bold">پرونده‌ای یافت نشد</p>
        <button
          onClick={() => navigate('/patient/dashboard')}
          className="text-brand hover:underline"
        >
          بازگشت به داشبورد
        </button>
      </div>
    );
  }

  const getBMIColor = (bmi) => {
    if (!bmi) return 'text-gray-400';
    if (bmi < 18.5) return 'text-blue-500';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-orange-500';
    return 'text-red-600';
  };

  const getBMILabel = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'کمبود وزن';
    if (bmi < 25) return 'نرمال';
    if (bmi < 30) return 'اضافه وزن';
    return 'چاقی';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 text-right px-4 md:px-0" dir="rtl">

      {/* هدر صفحه */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/patient/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowRight size={24} className="text-gray-400" />
          </button>
          <div>
            <h2 className="text-xl font-black text-gray-800">پرونده پزشکی من</h2>
            <p className="text-sm text-gray-500">
              نمایش سوابق و دستورات پزشک • {data.totalVisits} مراجعه
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-brand-light/50 px-4 py-2 rounded-xl text-brand-dark text-sm font-bold">
          <User size={16} /> {data.patientName}
        </div>
      </div>

      {/* اطلاعات پایه سلامت */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-brand opacity-5 rounded-br-full"></div>

        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ClipboardList className="text-brand" /> اطلاعات پایه سلامت
        </h3>

        {/* سطر اول */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
            <span className="text-base font-bold text-red-600 block mb-1">حساسیت‌ها:</span>
            <span className="text-sm text-black">
              {data.basicInfo?.allergies || '---'}
            </span>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-base font-bold text-gray-700 block mb-1">بیماری‌های زمینه‌ای:</span>
            <span className="text-sm text-black">
              {Array.isArray(data.basicInfo?.medicalHistory) && data.basicInfo.medicalHistory.length > 0
                ? data.basicInfo.medicalHistory.join('، ')
                : '---'}
            </span>
          </div>

        </div>

        {/* سطر دوم */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <span className="text-base font-bold text-orange-600 block mb-1">سابقه جراحی:</span>
            <div className="text-sm text-black">

              {typeof data.basicInfo?.surgeryHistory === 'boolean' ? (
                data.basicInfo.surgeryHistory ? (
                  <>
                    <span className="block text-black">
                      {data.basicInfo.surgeryType || 'بدون ذکر نوع'}
                    </span>

                    {data.basicInfo.surgeryProsthesis && (
                      <span className="block text-red-600 text-xs mt-1">
                        دارای عمل پروتز / پلاتین
                      </span>
                    )}
                  </>
                ) : (
                  'ندارد'
                )
              ) : (
                '---'
              )}

            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
            <span className="text-base font-bold text-green-600 block mb-1">داروهای مصرفی:</span>
            <span className="text-sm text-black">
              {Array.isArray(data.basicInfo?.medications) && data.basicInfo.medications.length > 0
                ? data.basicInfo.medications.join('، ')
                : '---'}
            </span>
          </div>

        </div>

        {/* سطر سوم */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col items-center justify-center text-center">
            <span className="text-base font-bold text-blue-600 block mb-1">گروه خونی</span>
            <span className="text-sm text-blue-800">
              {data.basicInfo?.bloodType || '---'}
            </span>
          </div>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col items-center justify-center text-center">
            <span className="text-base font-bold text-purple-600 block mb-1">وزن</span>
            <span className="text-sm text-purple-800">
              {data.basicInfo?.weight ? `${data.basicInfo.weight}kg` : '---'}
            </span>
          </div>

          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center text-center">
            <span className="text-base font-bold text-indigo-600 block mb-1">قد</span>
            <span className="text-sm text-indigo-800">
              {data.basicInfo?.height ? `${data.basicInfo.height}cm` : '---'}
            </span>
          </div>

          <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex flex-col items-center justify-center text-center">
            <span className="text-base font-bold text-green-600 block mb-1">BMI</span>
            <span className={`text-sm font-bold ${getBMIColor(data.basicInfo?.bmi)}`}>
              {data.basicInfo?.bmi || '---'}
            </span>
            {data.basicInfo?.bmi && (
              <span className={`text-xs block ${getBMIColor(data.basicInfo.bmi)}`}>
                {getBMILabel(data.basicInfo.bmi)}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* بخش سوابق */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-700 mr-4 flex items-center gap-2">
          <History size={20} className="text-gray-400" /> سوابق مراجعات و معاینات
        </h3>

        {data.visits?.length > 0 ? data.visits.map((visit) => (
          <div
            key={visit.id}
            className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:border-brand/30 transition-all"
          >
            <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-brand">
                  <Calendar size={24} />
                </div>
                <div>
                  <span className="block font-black text-gray-800">{visit.date}</span>
                  <span className="text-xs text-gray-400">
                    ساعت {visit.time} • {visit.visitType || 'حضوری'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">

                {visit.weight && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                    {visit.weight}kg
                  </span>
                )}

                {visit.bmi && (
                  <span className={`text-xs font-bold bg-gray-100 px-2 py-1 rounded-lg ${getBMIColor(visit.bmi)}`}>
                    BMI: {visit.bmi}
                  </span>
                )}

                <div className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                  ثبت نهایی شده
                </div>

              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {visit.complaint && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1">
                      <AlertCircle size={14} /> علت مراجعه:
                    </h4>
                    <p className="text-sm text-gray-700 leading-7">{visit.complaint}</p>
                  </div>
                )}

                {visit.diagnosis && (
                  <div>
                    <h4 className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-green-500" /> تشخیص نهایی:
                    </h4>
                    <p className="text-sm text-gray-700 leading-7">{visit.diagnosis}</p>
                  </div>
                )}

              </div>

              {visit.physicalExam && (
                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                  <h4 className="text-sm font-black text-gray-600 mb-3 flex items-center gap-2">
                    <Stethoscope size={18} /> معاینات فیزیکی:
                  </h4>
                  <p className="text-sm text-gray-700 leading-7">{visit.physicalExam}</p>
                </div>
              )}

              {visit.prescription && (
                <div className="bg-brand-light/20 p-6 rounded-[2rem] border border-brand/10">
                  <h4 className="text-sm font-black text-brand-dark mb-3 flex items-center gap-2">
                    <Pill size={18} /> دستورات دارویی:
                  </h4>
                  <p className="text-sm text-brand-text leading-7">{visit.prescription}</p>
                </div>
              )}

            </div>
          </div>
        )) : (
          <div className="text-center py-10 bg-white rounded-[2rem] border border-dashed border-gray-200 text-gray-400">
            هنوز سابقه‌ای ثبت نشده است.
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
