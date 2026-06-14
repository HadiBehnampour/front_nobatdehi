import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Lock, Unlock, Clock, CreditCard } from 'lucide-react';
import { APPOINTMENT_STATUSES } from '../hooks/useAppointments';

const STATUS_CONFIG = {
  [APPOINTMENT_STATUSES.FREE]:              { label: 'خالی',          color: 'bg-gray-100 text-gray-500 border-gray-200',       dot: 'bg-gray-400'    },
  [APPOINTMENT_STATUSES.PENDING_PAYMENT]:   { label: 'در حال پرداخت', color: 'bg-amber-50 text-amber-700 border-amber-200',     dot: 'bg-amber-500'   },
  [APPOINTMENT_STATUSES.RESERVED]:          { label: 'رزرو شده',      color: 'bg-blue-50 text-blue-700 border-blue-200',        dot: 'bg-blue-500'    },
  [APPOINTMENT_STATUSES.CONFIRMED]:         { label: 'اتاق انتظار',   color: 'bg-purple-50 text-purple-700 border-purple-200',  dot: 'bg-purple-500'  },
  [APPOINTMENT_STATUSES.IN_PROGRESS]:       { label: 'در حال ویزیت',  color: 'bg-orange-50 text-orange-700 border-orange-200',  dot: 'bg-orange-500'  },
  [APPOINTMENT_STATUSES.READY_FOR_PAYMENT]: { label: 'آماده پرداخت',  color: 'bg-yellow-50 text-yellow-700 border-yellow-200',  dot: 'bg-yellow-500'  },
  [APPOINTMENT_STATUSES.PAID]:              { label: 'پرداخت شده',    color: 'bg-green-50 text-green-700 border-green-200',     dot: 'bg-green-500'   },
  [APPOINTMENT_STATUSES.COMPLETED]:         { label: 'پایان یافته',   color: 'bg-teal-50 text-teal-700 border-teal-200',        dot: 'bg-teal-500'    },
  [APPOINTMENT_STATUSES.CANCELLED]:         { label: 'قفل شده',       color: 'bg-red-50 text-red-700 border-red-200',           dot: 'bg-red-500'     },
  [APPOINTMENT_STATUSES.NO_SHOW]:           { label: 'غیبت',          color: 'bg-pink-50 text-pink-700 border-pink-200',        dot: 'bg-pink-500'    },
};

const FILTER_OPTIONS = [
  { value: 'all',                                label: 'همه'           },
  { value: APPOINTMENT_STATUSES.FREE,            label: 'خالی'          },
  { value: APPOINTMENT_STATUSES.PENDING_PAYMENT, label: 'در حال پرداخت' },
  { value: APPOINTMENT_STATUSES.RESERVED,        label: 'رزرو شده'      },
  { value: APPOINTMENT_STATUSES.CONFIRMED,       label: 'اتاق انتظار'   },
  { value: APPOINTMENT_STATUSES.IN_PROGRESS,     label: 'در حال ویزیت'  },
  { value: APPOINTMENT_STATUSES.COMPLETED,       label: 'پایان یافته'   },
  { value: APPOINTMENT_STATUSES.CANCELLED,       label: 'قفل/لغو'       },
];

const AppointmentTable = ({ appointments, onConfirmArrival, onCancel, onNoShow, onToggleLock }) => {
  const [filter, setFilter] = useState('all');

  const filteredAppointments =
    filter === 'all'
      ? appointments
      : appointments.filter(a => a.status === filter);

  const cfg = (status) => STATUS_CONFIG[status] || STATUS_CONFIG[APPOINTMENT_STATUSES.FREE];

  return (
    <div className="flex flex-col gap-4">

      {/* Filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 flex gap-2 flex-wrap">
        {FILTER_OPTIONS.map(opt => (
          <button key={opt.value} onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === opt.value ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500">
          <div className="col-span-1">ساعت</div>
          <div className="col-span-3">بیمار</div>
          <div className="col-span-2">موبایل</div>
          <div className="col-span-2">نوع</div>
          <div className="col-span-2">وضعیت</div>
          <div className="col-span-2 text-left">عملیات</div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <CalendarIcon className="mx-auto mb-3 text-gray-300" size={40} />
            <p className="text-sm">هیچ نوبتی یافت نشد</p>
          </div>
        ) : filteredAppointments.map(apt => {
          const { label, color, dot } = cfg(apt.status);
          const isFree             = apt.status === APPOINTMENT_STATUSES.FREE;
          const isPending          = apt.status === APPOINTMENT_STATUSES.PENDING_PAYMENT;
          const isReserved         = apt.status === APPOINTMENT_STATUSES.RESERVED;
          const isActive           = [APPOINTMENT_STATUSES.CONFIRMED, APPOINTMENT_STATUSES.IN_PROGRESS, APPOINTMENT_STATUSES.READY_FOR_PAYMENT].includes(apt.status);
          const isCompleted        = [APPOINTMENT_STATUSES.COMPLETED, APPOINTMENT_STATUSES.PAID].includes(apt.status);
          const isCancelledEmpty   = apt.status === APPOINTMENT_STATUSES.CANCELLED && !apt.patient;
          const isCancelledWithPatient = apt.status === APPOINTMENT_STATUSES.CANCELLED && !!apt.patient;
          const isNoShow           = apt.status === APPOINTMENT_STATUSES.NO_SHOW;

          return (
            <div key={apt.id}
              className={`grid grid-cols-12 gap-2 px-4 py-3 items-center border-b border-gray-100 last:border-0 text-sm transition-colors
                ${isFree ? 'opacity-60' : ''}
                ${isPending ? 'bg-amber-50/40' : ''}
                ${isCancelledEmpty ? 'opacity-40 bg-red-50/30' : ''}
                ${isCompleted ? 'opacity-70 bg-teal-50/20' : ''}
                ${isNoShow ? 'opacity-50' : ''}
                ${!isFree && !isPending && !isCancelledEmpty && !isCompleted && !isNoShow ? 'hover:bg-gray-50' : ''}`}>

              <div className="col-span-1 font-mono font-bold text-gray-700">{apt.time}</div>

              <div className="col-span-3">
                {isFree || isCancelledEmpty ? (
                  <span className="text-gray-400 text-xs">
                    {isCancelledEmpty ? '🔒 قفل شده' : '— خالی —'}
                  </span>
                ) : isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-amber-100 text-amber-700 animate-pulse">
                      <CreditCard size={14} />
                    </div>
                    <span className="font-medium text-amber-700 text-xs">
                      {apt.patient}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                      ${isCompleted ? 'bg-teal-100 text-teal-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {apt.patient?.[0]}
                    </div>
                    <span className={`font-medium truncate ${isCompleted ? 'text-gray-500' : 'text-gray-800'}`}>
                      {apt.patient}
                    </span>
                  </div>
                )}
              </div>

              <div className="col-span-2 text-gray-500 font-mono text-xs" dir="ltr">
                {apt.mobile || '—'}
              </div>

              <div className="col-span-2 text-gray-500 text-xs">
                {apt.type || '—'}
              </div>

              <div className="col-span-2">
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${dot} ${isPending ? 'animate-pulse' : ''}`} />
                  {isCancelledEmpty ? '🔒 قفل' : label}
                </span>
              </div>

              <div className="col-span-2 flex items-center justify-end gap-1">

                {isFree && (
                  <button onClick={() => onToggleLock(apt)} title="قفل کردن نوبت"
                    className="flex items-center gap-1 px-2 py-1 text-gray-500 border border-gray-200 rounded-lg text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                    <Lock size={13} />قفل
                  </button>
                )}

                {isPending && (
                  <span className="text-xs text-amber-500 italic flex items-center gap-1">
                    <CreditCard size={12} className="animate-pulse" />
                    در درگاه پرداخت
                  </span>
                )}

                {isCancelledEmpty && (
                  <button onClick={() => onToggleLock(apt)} title="باز کردن قفل"
                    className="flex items-center gap-1 px-2 py-1 text-emerald-600 border border-emerald-200 rounded-lg text-xs hover:bg-emerald-50 transition-colors">
                    <Unlock size={13} />باز کردن
                  </button>
                )}

                {isReserved && (
                  <>
                    <button onClick={() => onConfirmArrival(apt)}
                      className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors">
                      <CheckCircle size={13} /> تایید
                    </button>
                    <button onClick={() => onCancel(apt.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                      <XCircle size={15} />
                    </button>
                    <button onClick={() => onNoShow(apt.id)}
                      className="p-1.5 rounded-lg text-pink-400 hover:bg-pink-50 transition-colors">
                      <Clock size={15} />
                    </button>
                  </>
                )}

                {isActive && <span className="text-xs text-gray-400 italic">در جریان</span>}

                {isCompleted && <span className="text-xs text-teal-500 italic">✅ پایان یافته</span>}

                {isCancelledWithPatient && <span className="text-xs text-red-400 italic">لغو شده</span>}

                {isNoShow && <span className="text-xs text-pink-400 italic">عدم مراجعه</span>}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentTable;
