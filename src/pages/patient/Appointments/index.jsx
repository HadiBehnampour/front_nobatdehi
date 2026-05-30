import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../../api/services/patient';
import AppointmentsHeader from './AppointmentsHeader';
import CalendarGrid from './CalendarGrid';
import TimeSlotsSidebar from './TimeSlotsSidebar';
import PaymentModal from './PaymentModal';
import SuccessModal from './SuccessModal';
import LoginModal from './LoginModal';
import PendingPaymentModal from './PendingPaymentModal';

const getTodayJalali = () => {
  const parts = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    year: 'numeric', month: 'numeric', day: 'numeric', calendar: 'persian',
  }).formatToParts(new Date());

  return {
    year: parseInt(parts.find(p => p.type === 'year').value),
    month: parseInt(parts.find(p => p.type === 'month').value),
    day: parseInt(parts.find(p => p.type === 'day').value),
  };
};

const Appointments = () => {
  const navigate = useNavigate();
  const todayJ = getTodayJalali();

  // ─── تقویم ───
  const [currentYear, setCurrentYear] = useState(todayJ.year);
  const [currentMonth, setCurrentMonth] = useState(todayJ.month);
  const [monthInfo, setMonthInfo] = useState(null);
  const [monthLoading, setMonthLoading] = useState(false);

  // ─── انتخاب روز و ساعت ───
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [visitReason, setVisitReason] = useState('');

  // ─── رزرو ───
  const [bookingStep, setBookingStep] = useState('select');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingError, setBookingError] = useState('');

  // ─── مودال لاگین ───
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ─── نوبت در انتظار پرداخت ───
  const [pendingAppointment, setPendingAppointment] = useState(null);
  const [pendingTimeLeft, setPendingTimeLeft] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);

  // ════════════════════════════════════════════════
  // چک نوبت در انتظار پرداخت (موقع لود صفحه)
  // ════════════════════════════════════════════════
  useEffect(() => {
    const checkPending = async () => {
      const isLoggedIn = !!localStorage.getItem('access');
      if (!isLoggedIn) return;

      try {
        const result = await patientService.checkPendingPayment();
        if (result.hasPending) {
          setPendingAppointment(result.appointment);
          setPendingTimeLeft(result.appointment.timeLeft);
          setShowPendingModal(true);
        }
      } catch (err) {
        console.error('Check pending error:', err);
      }
    };

    checkPending();
  }, []);

  // ════════════════════════════════════════════════
  // تایمر برای pending
  // ════════════════════════════════════════════════
  useEffect(() => {
    if (!showPendingModal || !pendingTimeLeft) return;

    const interval = setInterval(() => {
      setPendingTimeLeft(prev => {
        if (prev <= 1) {
          setShowPendingModal(false);
          setPendingAppointment(null);
          setBookingError('⏰ زمان پرداخت تمام شد. لطفاً دوباره نوبت بگیرید.');
          refreshSlots();
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showPendingModal]);

  // ════════════════════════════════════════════════
  // دریافت اطلاعات ماه
  // ════════════════════════════════════════════════
  useEffect(() => {
    const loadMonth = async () => {
      setMonthLoading(true);
      try {
        const data = await patientService.getMonthInfo(currentYear, currentMonth);
        setMonthInfo(data);
      } catch (err) {
        console.error('خطا در دریافت تقویم:', err);
      } finally {
        setMonthLoading(false);
      }
    };
    loadMonth();
  }, [currentYear, currentMonth]);

  // ════════════════════════════════════════════════
  // دریافت نوبت‌های خالی روز انتخابی
  // ════════════════════════════════════════════════
  useEffect(() => {
    if (!selectedDate) return;

    const loadSlots = async () => {
      setSlotsLoading(true);
      setSlots([]);
      setSelectedSlot(null);
      setVisitReason('');
      setBookingError('');
      try {
        const data = await patientService.getAvailableSlots(selectedDate);
        setSlots(data.slots || []);
      } catch (err) {
        console.error('خطا در دریافت نوبت‌ها:', err);
      } finally {
        setSlotsLoading(false);
      }
    };
    loadSlots();
  }, [selectedDate]);

  // ════════════════════════════════════════════════
  // تغییر ماه
  // ════════════════════════════════════════════════
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
    setSelectedDate(null);
    setSelectedDay(null);
    setSlots([]);
    setSelectedSlot(null);
    setBookingError('');
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
    setSelectedDate(null);
    setSelectedDay(null);
    setSlots([]);
    setSelectedSlot(null);
    setBookingError('');
  };

  // ════════════════════════════════════════════════
  // انتخاب روز
  // ════════════════════════════════════════════════
  const handleDaySelect = (day) => {
    const date = `${currentYear}/${String(currentMonth).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    setSelectedDay(day);
    setSelectedDate(date);
    setSelectedSlot(null);
    setBookingError('');
  };

  // ════════════════════════════════════════════════
  // رفرش نوبت‌ها
  // ════════════════════════════════════════════════
  const refreshSlots = async () => {
    if (!selectedDate) return;
    try {
      const data = await patientService.getAvailableSlots(selectedDate);
      setSlots(data.slots || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ════════════════════════════════════════════════
  // ادامه پرداخت pending
  // ════════════════════════════════════════════════
  const handleResumePending = async () => {
    if (!pendingAppointment) return;

    setPendingLoading(true);
    try {
      const result = await patientService.resumePendingPayment(pendingAppointment.id);

      if (result.success && result.paymentUrl) {
        localStorage.setItem('paymentPending', JSON.stringify({
          slotId: pendingAppointment.id,
          date: pendingAppointment.date,
          reason: pendingAppointment.reason,
        }));

        window.location.href = result.paymentUrl;
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'خطا در ادامه پرداخت';
      setBookingError(msg);
      setShowPendingModal(false);

      if (err.response?.status === 410) {
        setPendingAppointment(null);
        refreshSlots();
      }
    } finally {
      setPendingLoading(false);
    }
  };

  // ════════════════════════════════════════════════
  // لغو pending
  // ════════════════════════════════════════════════
  const handleCancelPending = async () => {
    if (!pendingAppointment) return;

    setPendingLoading(true);
    try {
      await patientService.cancelPendingPayment(pendingAppointment.id);
      setShowPendingModal(false);
      setPendingAppointment(null);
      setPendingTimeLeft(null);
      refreshSlots();
    } catch (err) {
      console.error('Cancel pending error:', err);
    } finally {
      setPendingLoading(false);
    }
  };

  // ════════════════════════════════════════════════
  // دکمه "ادامه و پرداخت" / "ورود و پرداخت"
  // ════════════════════════════════════════════════
  const handleContinueToPayment = async () => {
    if (!visitReason.trim() || !selectedSlot) return;

    const isLoggedIn = !!localStorage.getItem('access');
    setBookingError('');

    if (isLoggedIn) {
      // ✅ لاگین‌شده → چک تکراری → نمایش رسید
      try {
        const check = await patientService.checkDuplicateAppointment(selectedDate);
        if (check.hasDuplicate) {
          setBookingError(`⛔ ${check.message}`);
          return;
        }
      } catch (err) {
        console.error(err);
      }
      setBookingStep('payment');
    } else {
      // ✅ مهمان → فقط نمایش مودال لاگین (بدون قفل نوبت)
      setShowLoginModal(true);
    }
  };

  // ════════════════════════════════════════════════
  // بعد از لاگین موفق (مهمان)
  // ════════════════════════════════════════════════
  const handleLoginSuccess = async () => {
    setShowLoginModal(false);
    setBookingError('');

    // ✅ چک تکراری بعد از لاگین
    try {
      const check = await patientService.checkDuplicateAppointment(selectedDate);
      if (check.hasDuplicate) {
        setBookingError(`⛔ ${check.message}`);
        setSelectedSlot(null);
        return;
      }
    } catch (err) {
      console.error('Check duplicate error:', err);
    }

    // ✅ نمایش مودال رسید (بدون قفل - نوبت هنوز آزاده)
    setBookingStep('payment');
  };

  // ════════════════════════════════════════════════
  // بستن LoginModal
  // ════════════════════════════════════════════════
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  // ════════════════════════════════════════════════
  // بستن PaymentModal
  // ════════════════════════════════════════════════
  const handleClosePaymentModal = () => {
    setBookingStep('select');
    setBookingError('');
  };

  // ════════════════════════════════════════════════
  // پرداخت (دکمه "پرداخت و ثبت نوبت" در رسید)
  // ════════════════════════════════════════════════
  const handlePayment = async () => {
    if (!selectedSlot) return;

    setBookingLoading(true);
    setBookingError('');

    try {
      // ✅ فقط یک مسیر: requestPayment
      // 🔒 اینجا نوبت ۱۰ دقیقه قفل میشه
      const result = await patientService.requestPayment(
        selectedSlot.id,
        visitReason
      );

      if (result.success && result.paymentUrl) {
        localStorage.setItem('paymentPending', JSON.stringify({
          slotId: selectedSlot.id,
          slot: selectedSlot,
          date: selectedDate,
          day: selectedDay,
          year: currentYear,
          month: currentMonth,
          reason: visitReason,
        }));

        window.location.href = result.paymentUrl;
      }

    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.error || 'خطا در اتصال به درگاه پرداخت';
      setBookingError(msg);

      if (status === 409) {
        // نوبت توسط شخص دیگری گرفته شده
        await refreshSlots();
        setSelectedSlot(null);
        setBookingStep('select');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // ════════════════════════════════════════════════
  // شروع مجدد
  // ════════════════════════════════════════════════
  const handleNewBooking = () => {
    setBookingStep('select');
    setSelectedSlot(null);
    setVisitReason('');
    setBookingResult(null);
    setBookingError('');
    refreshSlots();
  };

  // ════════════════════════════════════════════════
  // رندر
  // ════════════════════════════════════════════════
  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 relative">

      <AppointmentsHeader
        currentYear={currentYear}
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      {bookingError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 font-medium text-center">
          {bookingError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CalendarGrid
          currentYear={currentYear}
          currentMonth={currentMonth}
          monthInfo={monthInfo}
          monthLoading={monthLoading}
          selectedDay={selectedDay}
          onDaySelect={handleDaySelect}
        />
        <TimeSlotsSidebar
          currentYear={currentYear}
          currentMonth={currentMonth}
          selectedDay={selectedDay}
          slots={slots}
          slotsLoading={slotsLoading}
          selectedSlot={selectedSlot}
          visitReason={visitReason}
          bookingLoading={bookingLoading}
          onSlotSelect={setSelectedSlot}
          onVisitReasonChange={setVisitReason}
          onContinueToPayment={handleContinueToPayment}
        />
      </div>

      {/* مودال نوبت در انتظار پرداخت */}
      {showPendingModal && pendingAppointment && (
        <PendingPaymentModal
          appointment={pendingAppointment}
          timeLeft={pendingTimeLeft}
          loading={pendingLoading}
          onResume={handleResumePending}
          onCancel={handleCancelPending}
        />
      )}

      {/* مودال لاگین (مهمان) - بدون تایمر */}
      {showLoginModal && (
        <LoginModal
          onClose={handleCloseLoginModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* مودال رسید و پرداخت - بدون تایمر */}
      {bookingStep === 'payment' && selectedSlot && (
        <PaymentModal
          currentYear={currentYear}
          currentMonth={currentMonth}
          selectedDay={selectedDay}
          selectedSlot={selectedSlot}
          visitReason={visitReason}
          paymentLoading={bookingLoading}
          onClose={handleClosePaymentModal}
          onPayment={handlePayment}
        />
      )}

      {/* مودال موفقیت */}
      {bookingStep === 'success' && bookingResult && (
        <SuccessModal
          bookingResult={bookingResult}
          onNewBooking={handleNewBooking}
          onBackToDashboard={() => navigate('/patient/dashboard')}
        />
      )}

    </div>
  );
};

export default Appointments;