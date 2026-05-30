import React from 'react';
import useAppointments, { APPOINTMENT_STATUSES } from './hooks/useAppointments';
import AppointmentCalendar  from './components/AppointmentCalendar';
import AppointmentTable     from './components/AppointmentTable';
import WaitingRoom          from './components/WaitingRoom';
import DoctorRoom           from './components/DoctorRoom';
import AppointmentHistory   from './components/AppointmentHistory';
import ScheduleModal        from './components/modals/ScheduleModal';
import ManualBookModal      from './components/modals/ManualBookModal';
import BillingModal         from './components/modals/BillingModal';
import InvoiceModal         from './components/modals/InvoiceModal';
import ScheduleSettingsModal from './components/modals/ScheduleSettingsModal';
import PatientFormModal from './components/modals/PatientFormModal';
import NextAppointmentModal from './components/modals/NextAppointmentModal';
import { CalendarPlus, Plus, CalendarIcon, Users, Stethoscope, History, Loader2, Settings, Lock, Unlock } from 'lucide-react';

const TABS = [
  { id: 'schedule', label: 'جدول نوبت‌ها', icon: CalendarIcon,  badge: null          },
  { id: 'waiting',  label: 'اتاق انتظار',  icon: Users,         badge: 'waiting'      },
  { id: 'doctor',   label: 'اتاق پزشک',    icon: Stethoscope,   badge: 'inProgress'   },
  { id: 'history',  label: 'تاریخچه',      icon: History,       badge: null           },
];

const AdminAppointments = () => {
  const apt = useAppointments();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">مدیریت نوبت‌دهی</h1>
            <p className="text-xs text-gray-400 mt-0.5">پنل منشی</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => apt.setShowSettingsModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">
              <Settings size={16} />تنظیمات
            </button>

            {apt.selectedDate && (
              <button onClick={apt.handleLockAll}
                disabled={!apt.hasFreeSlotsToday && !apt.canUnlock}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${apt.hasFreeSlotsToday
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : apt.canUnlock
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}>
                {apt.hasFreeSlotsToday ? (
                  <><Lock size={16} />بستن همه نوبت‌ها</>
                ) : (
                  <><Unlock size={16} />باز کردن نوبت‌ها</>
                )}
              </button>
            )}

            <button onClick={() => apt.setShowScheduleModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <CalendarPlus size={16} />باز کردن نوبت
            </button>
            <button onClick={() => apt.setShowManualModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <Plus size={16} />رزرو دستی
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Layout ─────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto p-6 flex gap-6">

        {/* Sidebar - Calendar */}
        <aside className="w-64 flex-shrink-0">
          <AppointmentCalendar
            currentMonth={apt.currentMonth}
            currentYear={apt.currentYear}
            calendarDays={apt.calendarDays}
            persianMonths={apt.persianMonths}
            selectedDate={apt.selectedDate}
            onDateSelect={apt.handleDateSelect}
            onPrevMonth={apt.handlePrevMonth}
            onNextMonth={apt.handleNextMonth}
            stats={apt.stats}
          />
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">

          {/* Tabs */}
          <div className="bg-white border border-gray-200 rounded-xl mb-5 flex overflow-hidden">
            {TABS.map(tab => {
              const Icon    = tab.icon;
              const badgeN  = tab.badge ? apt.stats[tab.badge] : 0;
              const isActive = apt.activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => apt.setActiveTab(tab.id)}
                  className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors border-b-2
                    ${isActive ? 'border-blue-600 text-blue-600 bg-blue-50/40' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                  <Icon size={16} />
                  {tab.label}
                  {badgeN > 0 && (
                    <span className="absolute top-2 right-3 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {badgeN}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {!apt.selectedDate ? (
            <div className="bg-white border border-gray-200 rounded-xl py-20 text-center">
              <CalendarIcon className="mx-auto mb-3 text-gray-300" size={52} />
              <p className="text-gray-500 font-medium">یک تاریخ از تقویم انتخاب کنید</p>
            </div>
          ) : apt.loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-blue-500" size={36} />
            </div>
          ) : (
            <>
              {apt.activeTab === 'schedule' && (
                <AppointmentTable
                  appointments={apt.filteredAppointments}
                  onConfirmArrival={apt.handleConfirmArrival}
                  onLockSlot={apt.handleLockSlot}
                  onCancel={apt.handleCancelAppointment}
                  onNoShow={apt.handleNoShow}
                  onToggleLock={apt.handleToggleLock}
                />
              )}
              {apt.activeTab === 'waiting' && (
                <WaitingRoom
                  waitingPatients={apt.waitingPatients}
                  onStartVisit={apt.handleStartVisit}
                  onOpenBilling={apt.openBillingModal}
                  onOpenPatient={apt.openPatientModal}
                />
              )}
              {apt.activeTab === 'doctor' && (
                <DoctorRoom
                  inProgressPatients={apt.inProgressPatients}
                  readyForPayment={apt.readyForPayment}
                  onFinishVisit={apt.handleFinishVisit}
                  onOpenBilling={apt.openBillingModal}
                  onOpenPatient={apt.openPatientModal}
                  onAddDoctorServices={apt.openDoctorServiceModal}
                  onPayServices={apt.openPayModal}
                  onNextAppointment={apt.openNextApptModal}
		  selectedDate={apt.selectedDate} 
                />
              )}
              {apt.activeTab === 'history' && (
                <AppointmentHistory history={apt.history} />
              )}
            </>
          )}
        </main>
      </div>

      {/* ── Modals ──────────────────────────────────────────── */}
      {apt.showScheduleModal && (
        <ScheduleModal
          form={apt.scheduleForm}
          onChange={apt.setScheduleForm}
          onSubmit={apt.handleScheduleSubmit}
          onClose={() => apt.setShowScheduleModal(false)}
          loading={apt.loading}
        />
      )}

      {apt.showManualModal && (
        <ManualBookModal
          form={apt.manualForm}
          onChange={apt.setManualForm}
          onSubmit={apt.handleManualSubmit}
          onClose={() => apt.setShowManualModal(false)}
          loading={apt.loading}
          foundPatient={apt.foundPatient}
          setFoundPatient={apt.setFoundPatient}
          freeSlots={apt.availableManualSlots}
        />
      )}

      {/* ✅ مودال صورت‌حساب منشی - اضافه شد onUpdateQuantity */}
      {apt.showBillingModal && apt.activeBillingPatient && (
        <BillingModal
          patient={apt.activeBillingPatient}
          selectedServices={apt.selectedServices}
          onToggle={apt.toggleService}
          onUpdateQuantity={apt.updateServiceQuantity}
          onFinalize={apt.handleAddServicesByAdmin}
          onClose={() => apt.setShowBillingModal(false)}
          loading={apt.loading}
        />
      )}

      {/* ✅ مودال خدمات پزشک - اضافه شد onUpdateQuantity */}
      {apt.showDoctorServiceModal && apt.activeDoctorPatient && (
        <BillingModal
          patient={apt.activeDoctorPatient}
          selectedServices={apt.selectedServices}
          onToggle={apt.toggleService}
          onUpdateQuantity={apt.updateServiceQuantity}
          onFinalize={apt.handleAddServicesByDoctor}
          onClose={() => apt.setShowDoctorServiceModal(false)}
          loading={apt.loading}
          mode="doctor"
        />
      )}

      {/* حالت پرداخت - بدون تغییر (نیازی به onUpdateQuantity نداره) */}
      {apt.showPayModal && apt.activePayPatient && (
        <BillingModal
          patient={apt.activePayPatient}
          selectedServices={apt.selectedServices}
          onToggle={apt.toggleService}
          onFinalize={apt.handlePayServices}
          onClose={() => apt.setShowPayModal(false)}
          loading={apt.loading}
          mode="pay"
        />
      )}

      {apt.showInvoiceModal && apt.activeInvoicePatient && (
        <InvoiceModal
          patient={apt.activeInvoicePatient}
          onFinish={apt.handleFinishVisitConfirm}
          onClose={() => apt.setShowInvoiceModal(false)}
          loading={apt.loading}
        />
      )}

      {/* ✅ پاس دادن onSuccess به مودال تنظیمات */}
	{apt.showSettingsModal && (
	  <ScheduleSettingsModal
	    onClose={() => apt.setShowSettingsModal(false)}
	    onSuccess={async () => {
	      await apt.fetchAppointments();
	      await apt.fetchMonthInfo();
	    }}
	  />
	)}

      {apt.showNextApptModal && apt.activeNextApptPatient && (
        <NextAppointmentModal
          patient={apt.activeNextApptPatient}
          onClose={() => apt.setShowNextApptModal(false)}
          onSuccess={() => apt.fetchAppointments()}
        />
      )}

      {apt.showPatientModal && apt.activePatient && (
	  <PatientFormModal
	    patient={apt.activePatient}
	    onClose={() => apt.setShowPatientModal(false)}
	    onSuccess={() => apt.fetchAppointments()} // رفرش لیست بعد از ویرایش
	  />
	)}

    </div>
  );

};

export default AdminAppointments;