import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import { usePatientHistory } from './hooks/usePatientHistory';
import PatientHistoryHeader from './components/PatientHistoryHeader';
import BaseInfoBox from './components/BaseInfoBox';
import PhysicalChart from './components/PhysicalChart';
import VisitForm, { defaultForm } from './components/VisitForm';
import VisitCardsList from './components/VisitCardsList';

const PatientHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [visitForm, setVisitForm] = useState({ ...defaultForm });

  // ✅ خواندن پارامترها
  const isVisitMode = searchParams.get('mode') === 'visit';
  const returnDate = searchParams.get('returnDate');   // ✅ جدید
  const returnTab  = searchParams.get('returnTab');    // ✅ جدید

  const {
    loading,
    patient,
    appointments,
    clinical,
    setClinical,
    isEditingClinical,
    setIsEditingClinical,
    savingClinical,
    handleSaveClinical,
    chartData,
    savingEncounter,
    handleSubmitCurrentVisit,
    fetchData,
    todayAppointment,
    draftEncounter,
  } = usePatientHistory(id);

  const lastVisitDate = appointments.length > 0 ? appointments[0].date : null;

  // ✅ ساخت URL بازگشت
  const getReturnUrl = () => {
    if (returnDate) {
      const params = new URLSearchParams();
      params.set('date', returnDate);
      if (returnTab) params.set('tab', returnTab);
      return `/admin/appointments?${params.toString()}`;
    }
    // fallback
    return isVisitMode ? '/admin/appointments' : '/admin/patients';
  };

  // ✅ ثبت و ادامه → بازگشت هوشمند
  const onSubmitCurrentVisit = async (formData) => {
    const success = await handleSubmitCurrentVisit(formData);
    if (success) {
      navigate(getReturnUrl());   // ✅ با تاریخ و تب برمیگرده
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin text-brand" size={40} />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertTriangle className="text-red-400" size={48} />
        <p className="text-gray-500 font-bold">بیمار یافت نشد</p>
        <button
          onClick={() => navigate('/admin/patients')}
          className="text-brand hover:underline"
        >
          بازگشت به لیست بیماران
        </button>
      </div>
    );
  }

  const hasActiveVisit = todayAppointment && !['completed', 'paid'].includes(todayAppointment.status);
  const showVisitForm = isVisitMode && hasActiveVisit;

  return (
    <div
      className="max-w-7xl mx-auto space-y-6 pb-20 text-right animate-in fade-in duration-500"
      dir="rtl"
    >
      <PatientHistoryHeader
        patient={patient}
        appointmentsCount={appointments.filter(a => ['completed', 'paid'].includes(a.status)).length}
        lastVisitDate={lastVisitDate}
        onBack={() => navigate(getReturnUrl())}    // ✅ دکمه بازگشت هم هوشمند شد
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ستون چپ */}
        <div className="lg:col-span-7 space-y-6">
          {showVisitForm && (
            <VisitForm
              initialHeight={clinical.height}
              initialReason={todayAppointment?.reason || ''}
              draftEncounter={draftEncounter}
              form={visitForm}
              setForm={setVisitForm}
              onSubmit={onSubmitCurrentVisit}
              saving={savingEncounter}
            />
          )}

          {isVisitMode && !hasActiveVisit && (
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 text-center">
              <p className="text-gray-400 text-sm">
                {todayAppointment
                  ? '✅ ویزیت امروز تکمیل شده است'
                  : '⚠️ نوبت فعالی برای امروز وجود ندارد'}
              </p>
            </div>
          )}

          <VisitCardsList
            appointments={appointments}
            heightForBmi={clinical.height}
          />
        </div>

        {/* ستون راست */}
        <div className="lg:col-span-5 space-y-6">
          <BaseInfoBox
            clinical={clinical}
            setClinical={setClinical}
            isEditing={isEditingClinical}
            onEdit={() => setIsEditingClinical(true)}
            onSave={handleSaveClinical}
            saving={savingClinical}
          />
          <PhysicalChart chartData={chartData} />
        </div>
      </div>
    </div>
  );
};

export default PatientHistory;