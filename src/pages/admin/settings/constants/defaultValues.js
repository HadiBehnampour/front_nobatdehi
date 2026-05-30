export const DEFAULT_SCHEDULE = [
  { day: 'شنبه', isOpen: true, start: '14:00', end: '20:00' },
  { day: 'یک‌شنبه', isOpen: true, start: '14:00', end: '20:00' },
  { day: 'دوشنبه', isOpen: true, start: '14:00', end: '20:00' },
  { day: 'سه‌شنبه', isOpen: true, start: '14:00', end: '20:00' },
  { day: 'چهارشنبه', isOpen: true, start: '14:00', end: '20:00' },
  { day: 'پنج‌شنبه', isOpen: true, start: '09:00', end: '13:00' },
  { day: 'جمعه', isOpen: false, start: '00:00', end: '00:00' },
];

export const DEFAULT_GENERAL_INFO = {
  clinicName: '',
  doctorName: '',
  specialty: '',
  address: '',
  phone: '',
  mobile: ''
};

export const DEFAULT_SECURITY = {
  smsReminder: true,
  smsBooking: true,
  currentPass: '',
  newPass: '',
  confirmPass: ''
};

export const TABS = {
  GENERAL: 'general',
  HOURS: 'hours',
  SECURITY: 'security'
};