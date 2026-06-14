// hooks/useAppointments.js

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../../../../api/services/admin';

export const APPOINTMENT_STATUSES = {
  FREE:              'free',
  PENDING_PAYMENT:   'pending_payment',
  RESERVED:          'reserved',
  CONFIRMED:         'confirmed',
  IN_PROGRESS:       'in_progress',
  READY_FOR_PAYMENT: 'ready_for_payment',
  PAID:              'paid',
  COMPLETED:         'completed',
  CANCELLED:         'cancelled',
  NO_SHOW:           'no_show',
};

export const CLINIC_SERVICES = [
  { id: 'S1',  name: 'ویزیت تخصصی',          price: 495000,   hasQuantity: false },
  { id: 'S2',  name: 'نوار عصب دو اندام',     price: 4200000,  hasQuantity: false },
  { id: 'S3',  name: 'نوار عصب چهار اندام',    price: 6200000,  hasQuantity: false },
  { id: 'S4',  name: 'ارتوکین',               price: 9000000,  hasQuantity: true, unitLabel: 'عضو', minQty: 1, maxQty: 2 },
  { id: 'S5',  name: 'تزریق کمر و گردن',      price: 4500000,  hasQuantity: false },
  { id: 'S6',  name: 'تزریق شانه',            price: 4000000,  hasQuantity: false },
  { id: 'S7',  name: 'پی‌آر‌پی',              price: 6000000,  hasQuantity: true, unitLabel: 'عضو', minQty: 1, maxQty: 6 },
  { id: 'S8',  name: 'تزریق زانو',            price: 3500000,  hasQuantity: false },
  { id: 'S9',  name: 'SVF',                   price: 30000000, hasQuantity: false },
  { id: 'S10', name: 'سونوگرافی',              price: 500000,   hasQuantity: false },
  { id: 'S11', name: 'ست تزریق',              price: 500000,   hasQuantity: false },
];

const getTodayJalali = () => {
  const parts = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    year: 'numeric', month: 'numeric', day: 'numeric', calendar: 'persian',
  }).formatToParts(new Date());
  return {
    year:  parseInt(parts.find(p => p.type === 'year').value),
    month: parseInt(parts.find(p => p.type === 'month').value),
    day:   parseInt(parts.find(p => p.type === 'day').value),
  };
};

const useAppointments = () => {
  const [searchParams] = useSearchParams();
  const todayJ = getTodayJalali();

  const [currentMonth, setCurrentMonth] = useState(todayJ.month);
  const [currentYear,  setCurrentYear]  = useState(todayJ.year);
  const [selectedDate, setSelectedDate] = useState(null);
  const [monthInfo,    setMonthInfo]    = useState(null);

  const [activeTab, setActiveTab] = useState('schedule');
  const [loading,   setLoading]   = useState(false);
  const [filter,    setFilter]    = useState('all');

  const [appointments, setAppointments] = useState([]);
  const [history,      setHistory]      = useState([]);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showManualModal,   setShowManualModal]   = useState(false);
  const [showBillingModal,  setShowBillingModal]  = useState(false);
  const [showPatientModal,  setShowPatientModal]  = useState(false);
  const [showDoctorServiceModal, setShowDoctorServiceModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNextApptModal, setShowNextApptModal] = useState(false);
  const [activeNextApptPatient, setActiveNextApptPatient] = useState(null);

  const [activeBillingPatient, setActiveBillingPatient] = useState(null);
  const [activeDoctorPatient,  setActiveDoctorPatient]  = useState(null);
  const [activePayPatient,     setActivePayPatient]     = useState(null);
  const [activeInvoicePatient, setActiveInvoicePatient] = useState(null);
  const [activePatient,        setActivePatient]        = useState(null);
  const [selectedServices,     setSelectedServices]     = useState({});

  const [foundPatient,  setFoundPatient]  = useState(null);
  const [manualForm,    setManualForm]    = useState({
    date: '', name: '', mobile: '', nationalId: '', slotId: null, type: 'حضوری',
  });
  const [scheduleForm, setScheduleForm] = useState({
    targetDate: '', startTime: '14:00', endTime: '20:00', duration: '30', isHolidayOpen: false,
  });

  useEffect(() => {
	  const dateParam = searchParams.get('date');
	  const tabParam = searchParams.get('tab');

	  if (dateParam) {
	    setSelectedDate(dateParam);
	    setManualForm(prev => ({ ...prev, date: dateParam }));
	    setScheduleForm(prev => ({ ...prev, targetDate: dateParam }));

	    const parts = dateParam.split('/');
	    if (parts.length === 3) {
	      setCurrentYear(parseInt(parts[0]));
	      setCurrentMonth(parseInt(parts[1]));
	    }

	  } else {
	    const todayFormatted =
	      `${todayJ.year}/${String(todayJ.month).padStart(2,'0')}/${String(todayJ.day).padStart(2,'0')}`;

	    setSelectedDate(todayFormatted);
	    setManualForm(prev => ({ ...prev, date: todayFormatted }));
	    setScheduleForm(prev => ({ ...prev, targetDate: todayFormatted }));
	  }

	  if (tabParam && ['schedule', 'waiting', 'doctor', 'history'].includes(tabParam)) {
	    setActiveTab(tabParam);
	  }
}, []);


  // ════════════════════════════════════════════════════════════
  // Calendar
  // ════════════════════════════════════════════════════════════
  const persianMonths = [
    'فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور',
    'مهر','آبان','آذر','دی','بهمن','اسفند',
  ];

  const getDaysInMonth = (year, month) => {
    if (month <= 6)  return 31;
    if (month <= 11) return 30;
    return 29;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const calendarDays = (() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const offset = monthInfo?.firstDayOffset || 0;
    const blanks = Array.from({ length: offset }, () => ({ day: null, date: null, isBlank: true }));
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = `${currentYear}/${String(currentMonth).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
      const dayIndex = (offset + i) % 7;
      const isFriday = dayIndex === 6;
      const isOfficialHoliday = monthInfo?.officialHolidays?.[String(day)] || null;
      const isCustomHoliday = monthInfo?.customHolidays?.[String(day)] || null;
      const isToday = monthInfo?.today === day;
      const hasAppointment = monthInfo?.daysWithAppointments?.includes(day) || false;
      return {
        day, date, isBlank: false, isFriday,
        isOfficialHoliday, isCustomHoliday, isToday, hasAppointment,
        isHoliday: isFriday || !!isOfficialHoliday || !!isCustomHoliday,
      };
    });
    return [...blanks, ...days];
  })();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setManualForm(prev  => ({ ...prev,  date }));
    setScheduleForm(prev => ({ ...prev, targetDate: date }));
  };

  // ════════════════════════════════════════════════════════════
  // ✅ Fetch - fetchMonthInfo به عنوان تابع مستقل
  // ════════════════════════════════════════════════════════════
  const fetchMonthInfo = useCallback(async () => {
    try {
      const data = await adminService.getMonthInfo(currentYear, currentMonth);
      setMonthInfo(data);
    } catch (err) {
      console.error('خطا در دریافت اطلاعات ماه:', err);
    }
  }, [currentYear, currentMonth]);

  useEffect(() => {
    fetchMonthInfo();
  }, [fetchMonthInfo]);

  const fetchAppointments = useCallback(async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const res = await adminService.getAppointments({
        date: selectedDate,
        status: filter !== 'all' ? filter : undefined,
      });
      setAppointments(res || []);
    } catch (err) {
      console.error('خطا در دریافت نوبت‌ها:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, filter]);

  const fetchHistory = useCallback(async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const res = await adminService.getAppointments({ date: selectedDate, status: 'completed' });
      setHistory(res || []);
    } catch (err) {
      console.error('خطا در دریافت تاریخچه:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);
  useEffect(() => {
    if (activeTab === 'history') fetchHistory();
  }, [activeTab, fetchHistory]);

  useEffect(() => {
    const search = async () => {
      const { nationalId } = manualForm;
      if (nationalId.length !== 10) { setFoundPatient(null); return; }
      try {
        const res = await adminService.getPatients(nationalId);
        if (res?.length) {
          const p = res[0];
          setFoundPatient(p);
          setManualForm(prev => ({ ...prev, name: p.name || prev.name, mobile: p.mobile || prev.mobile }));
        } else { setFoundPatient(null); }
      } catch { setFoundPatient(null); }
    };
    const t = setTimeout(search, 500);
    return () => clearTimeout(t);
  }, [manualForm.nationalId]);

  // ════════════════════════════════════════════════════════════
  // Status actions
  // ════════════════════════════════════════════════════════════
  const changeStatus = async (id, status, successMsg) => {
    setLoading(true);
    try {
      await adminService.updateAppointmentStatus(id, status);
      await fetchAppointments();
      if (successMsg) alert(successMsg);
    } catch { alert('خطا در تغییر وضعیت'); }
    finally { setLoading(false); }
  };

  const handleConfirmArrival = (apt) => changeStatus(apt.id, APPOINTMENT_STATUSES.CONFIRMED, `${apt.patient} وارد اتاق انتظار شد ✅`);
  const handleNoShow = (id) => changeStatus(id, APPOINTMENT_STATUSES.NO_SHOW, null);

  // ✅ لغو نوبت + رفرش تقویم
  const handleCancelAppointment = async (id) => {
    if (!window.confirm('آیا از لغو این نوبت مطمئن هستید؟')) return;
    setLoading(true);
    try {
      await adminService.updateAppointmentStatus(id, APPOINTMENT_STATUSES.CANCELLED);
      await fetchAppointments();
      await fetchMonthInfo();
    } catch { alert('خطا در تغییر وضعیت'); }
    finally { setLoading(false); }
  };

  const handleStartVisit = (apt) => changeStatus(apt.id, APPOINTMENT_STATUSES.IN_PROGRESS, `ویزیت ${apt.patient} شروع شد 👨‍⚕️`);

  // ✅ قفل/باز + رفرش تقویم
  const handleLockAll = async () => {
    if (!selectedDate) return;
    const hasFree = appointments.some(a => a.status === APPOINTMENT_STATUSES.FREE);
    const action = hasFree ? 'lock' : 'unlock';
    const msg = hasFree
      ? 'آیا از قفل کردن همه نوبت‌های خالی مطمئن هستید؟'
      : 'آیا از باز کردن نوبت‌های قفل‌شده مطمئن هستید؟';
    if (!window.confirm(msg)) return;
    setLoading(true);
    try {
      const res = await adminService.lockAllSlots(selectedDate, action);
      await fetchAppointments();
      await fetchMonthInfo();
      alert(res.message);
    } catch { alert('خطا در تغییر وضعیت نوبت‌ها'); }
    finally { setLoading(false); }
  };

  const handleToggleLock = async (apt) => {
    setLoading(true);
    try {
      await adminService.toggleSlotLock(apt.id);
      await fetchAppointments();
    } catch { alert('خطا در تغییر وضعیت نوبت'); }
    finally { setLoading(false); }
  };

  // ════════════════════════════════════════════════════════════
  // Form actions
  // ════════════════════════════════════════════════════════════

  // ✅ رزرو دستی + رفرش تقویم
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualForm.slotId) return alert('لطفا یک ساعت خالی انتخاب کنید');
    setLoading(true);
    try {
      await adminService.createManualAppointment(manualForm);
      setShowManualModal(false);
      setManualForm({ date: selectedDate, name: '', mobile: '', nationalId: '', slotId: null, type: 'حضوری' });
      setFoundPatient(null);
      await fetchAppointments();
      await fetchMonthInfo();
      alert('نوبت با موفقیت ثبت شد ✅');
    } catch { alert('خطا در ثبت نوبت'); }
    finally { setLoading(false); }
  };

  // ✅ باز کردن نوبت تکی + رفرش تقویم
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    const { targetDate, startTime, endTime, duration, isHolidayOpen } = scheduleForm;
    if (!targetDate || !startTime || !endTime) return alert('لطفا همه فیلدها را پر کنید');
    const s = parseInt(startTime.replace(':', ''));
    const en = parseInt(endTime.replace(':', ''));
    if (s >= en) return alert('ساعت پایان باید بعد از ساعت شروع باشد');
    setLoading(true);
    try {
      await adminService.createSchedule({ date: targetDate, startTime, endTime, slotDuration: parseInt(duration), isHolidayOpen });
      setShowScheduleModal(false);
      await fetchAppointments();
      await fetchMonthInfo();
      alert(`نوبت‌های ${targetDate} با موفقیت باز شد ✅`);
    } catch (err) { alert(err.response?.data?.message || 'خطا در باز کردن نوبت‌ها'); }
    finally { setLoading(false); }
  };

  // ════════════════════════════════════════════════════════════
  // Services & Billing
  // ════════════════════════════════════════════════════════════
  const openBillingModal = (apt) => { setActiveBillingPatient(apt); setSelectedServices({}); setShowBillingModal(true); };
  const openDoctorServiceModal = (apt) => { setActiveDoctorPatient(apt); setSelectedServices({}); setShowDoctorServiceModal(true); };
  const openPayModal = (apt) => { setActivePayPatient(apt); setShowPayModal(true); };

  const toggleService = (id) => {
    setSelectedServices(prev => {
      const next = { ...prev };
      if (next[id] !== undefined) { delete next[id]; } else { next[id] = 1; }
      return next;
    });
  };

  const updateServiceQuantity = (id, qty) => {
    const service = CLINIC_SERVICES.find(s => s.id === id);
    if (!service) return;
    const min = service.minQty || 1;
    const max = service.maxQty || 10;
    setSelectedServices(prev => ({ ...prev, [id]: Math.max(min, Math.min(max, qty)) }));
  };

  const calculateTotal = () => {
    return Object.entries(selectedServices).reduce((sum, [id, qty]) => {
      const service = CLINIC_SERVICES.find(s => s.id === id);
      return service ? sum + (service.price * qty) : sum;
    }, 0);
  };

  const getServicesPayload = () => {
    return Object.entries(selectedServices).map(([id, qty]) => {
      const s = CLINIC_SERVICES.find(srv => srv.id === id);
      return {
        id: s.id,
        name: s.hasQuantity ? `${s.name} (${qty} ${s.unitLabel || 'عدد'})` : s.name,
        price: s.price * qty,
        quantity: qty,
        unit_price: s.price,
      };
    });
  };

  const handleAddServicesByAdmin = async (appointmentId) => {
    if (!Object.keys(selectedServices).length) return alert('حداقل یک خدمت انتخاب کنید');
    setLoading(true);
    try {
      await adminService.addServices({ appointmentId, services: getServicesPayload(), isPaid: true, addedBy: 'admin' });
      setShowBillingModal(false); setActiveBillingPatient(null); setSelectedServices({});
      await fetchAppointments();
      alert('خدمات ثبت و پرداخت شد ✅');
    } catch { alert('خطا در ثبت خدمات'); }
    finally { setLoading(false); }
  };

  const handleAddServicesByDoctor = async (appointmentId) => {
    if (!Object.keys(selectedServices).length) return alert('حداقل یک خدمت انتخاب کنید');
    setLoading(true);
    try {
      await adminService.addServices({ appointmentId, services: getServicesPayload(), isPaid: false, addedBy: 'doctor' });
      setShowDoctorServiceModal(false); setActiveDoctorPatient(null); setSelectedServices({});
      await fetchAppointments();
      alert('خدمات ثبت شد ✅');
    } catch { alert('خطا در ثبت خدمات'); }
    finally { setLoading(false); }
  };

  const handlePayServices = async (appointmentId) => {
    setLoading(true);
    try {
      await adminService.payServices(appointmentId);
      setShowPayModal(false); setActivePayPatient(null);
      await fetchAppointments();
      alert('پرداخت انجام شد ✅');
    } catch { alert('خطا در پرداخت'); }
    finally { setLoading(false); }
  };

  // ════════════════════════════════════════════════════════════
  // Finish Visit
  // ════════════════════════════════════════════════════════════
  const handleFinishVisitRequest = (apt) => {
    if (apt.hasPendingPayment) return alert('ابتدا همه خدمات باید پرداخت شوند');
    setActiveInvoicePatient(apt); setShowInvoiceModal(true);
  };

  // ✅ پایان ویزیت + رفرش تقویم
  const handleFinishVisitConfirm = async (apt) => {
    setLoading(true);
    try {
      await adminService.finishVisit(apt.id);
      setShowInvoiceModal(false); setActiveInvoicePatient(null);
      await fetchAppointments();
      await fetchMonthInfo();
      alert('ویزیت پایان یافت ✅');
    } catch (err) {
      alert(err.response?.data?.message || 'خطا در پایان ویزیت');
    } finally { setLoading(false); }
  };

  const openPatientModal = (apt) => { setActivePatient(apt); setShowPatientModal(true); };
  const openNextApptModal = (apt) => { setActiveNextApptPatient(apt); setShowNextApptModal(true); };

  // ════════════════════════════════════════════════════════════
  // Computed
  // ════════════════════════════════════════════════════════════
  const waitingPatients      = appointments.filter(a => a.status === APPOINTMENT_STATUSES.CONFIRMED);
  const inProgressPatients   = appointments.filter(a => a.status === APPOINTMENT_STATUSES.IN_PROGRESS);
  const readyForPayment      = appointments.filter(a => a.status === APPOINTMENT_STATUSES.READY_FOR_PAYMENT);
  const filteredAppointments = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);


  const availableManualSlots = (() => {
	  if (!selectedDate) return [];

	  const freeSlots = appointments.filter(a => a.status === APPOINTMENT_STATUSES.FREE);

    const todayFormatted =
      `${todayJ.year}/${String(todayJ.month).padStart(2, '0')}/${String(todayJ.day).padStart(2, '0')}`;

    const selectedParts = selectedDate.split('/').map(Number);
    const todayParts = [todayJ.year, todayJ.month, todayJ.day];

    const selectedNumber =
      (selectedParts[0] * 10000) +
      (selectedParts[1] * 100) +
      selectedParts[2];

    const todayNumber =
      (todayParts[0] * 10000) +
      (todayParts[1] * 100) +
      todayParts[2];

    // روزهای گذشته هیچ اسلاتی نداشته باشند
    if (selectedNumber < todayNumber) {
      return [];
    }

    // روزهای آینده همه اسلات‌ها نمایش داده شوند
    if (selectedDate !== todayFormatted) {
      return freeSlots;
    }

    // فقط اسلات‌های آینده امروز
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return freeSlots.filter(slot => {
	  if (!slot.time || typeof slot.time !== 'string') return false;

	  const [hour, minute] = slot.time.split(':').map(Number);

	  return (
	    hour > currentHour ||
	    (hour === currentHour && minute >= currentMinute)
	  );
	});
  })();

  const hasFreeSlotsToday = appointments.some(a => a.status === APPOINTMENT_STATUSES.FREE);
  const hasLockedSlotsToday = appointments.some(a => a.status === APPOINTMENT_STATUSES.CANCELLED && !a.patient);
  const canUnlock = !hasFreeSlotsToday && hasLockedSlotsToday;

  const stats = {
    total:           appointments.length,
    free:            appointments.filter(a => a.status === APPOINTMENT_STATUSES.FREE).length,
    reserved:        appointments.filter(a => a.status === APPOINTMENT_STATUSES.RESERVED).length,
    waiting:         waitingPatients.length,
    inProgress:      inProgressPatients.length,
    readyForPayment: readyForPayment.length,
    completed:       appointments.filter(a => [APPOINTMENT_STATUSES.COMPLETED, APPOINTMENT_STATUSES.PAID].includes(a.status)).length,
  };

  return {
    currentMonth, currentYear, selectedDate, calendarDays, persianMonths,
    handlePrevMonth, handleNextMonth, handleDateSelect, monthInfo,
    activeTab, setActiveTab, loading, filter, setFilter,
    appointments, filteredAppointments, waitingPatients, inProgressPatients, readyForPayment, history, stats,
    showScheduleModal, setShowScheduleModal,
    showManualModal, setShowManualModal,
    showBillingModal, setShowBillingModal,
    showPatientModal, setShowPatientModal,
    showDoctorServiceModal, setShowDoctorServiceModal,
    showPayModal, setShowPayModal,
    showInvoiceModal, setShowInvoiceModal,
    showSettingsModal, setShowSettingsModal,
    showNextApptModal, setShowNextApptModal, activeNextApptPatient, openNextApptModal,
    activeBillingPatient, activeDoctorPatient, activePayPatient, activeInvoicePatient, activePatient, selectedServices,
    manualForm, setManualForm, scheduleForm, setScheduleForm, foundPatient, setFoundPatient,
    handleConfirmArrival, handleCancelAppointment, handleNoShow,
    handleStartVisit, handleToggleLock, handleLockAll,
    hasFreeSlotsToday, canUnlock,
    handleFinishVisit: handleFinishVisitRequest, handleFinishVisitConfirm,
    handleManualSubmit, handleScheduleSubmit,
    openBillingModal, openDoctorServiceModal, openPayModal,
    toggleService, updateServiceQuantity, calculateTotal,
    handleAddServicesByAdmin, handleAddServicesByDoctor, handlePayServices,
    openPatientModal, fetchAppointments,
    fetchMonthInfo,    // ✅ اکسپورت شد
    availableManualSlots,
  };
};

export default useAppointments;
