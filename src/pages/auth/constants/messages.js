// pages/auth/constants/messages.js

export const PERSIAN_MONTHS = [
  { value: '01', label: 'فروردین' },
  { value: '02', label: 'اردیبهشت' },
  { value: '03', label: 'خرداد' },
  { value: '04', label: 'تیر' },
  { value: '05', label: 'مرداد' },
  { value: '06', label: 'شهریور' },
  { value: '07', label: 'مهر' },
  { value: '08', label: 'آبان' },
  { value: '09', label: 'آذر' },
  { value: '10', label: 'دی' },
  { value: '11', label: 'بهمن' },
  { value: '12', label: 'اسفند' },
];

export const AUTH_MESSAGES = {
  branding: {
    clinicName: 'نوبت‌دهی هوشمند',
    heroTitle: 'سلامتی شما،',
    heroHighlight: 'اولویت ماست',
    description:
      'با ساده‌ترین روش و در کوتاه‌ترین زمان، نوبت پزشک خود را رزرو کنید و پرونده الکترونیک سلامت‌تان را مدیریت نمایید.',
    quickBook: 'رزرو نوبت سریع',
    quickBookSub: 'بدون نیاز به ورود',
  },

  phoneStep: {
    title: 'ورود | ثبت‌نام',
    subtitle: 'برای ورود یا ثبت‌نام، شماره موبایل خود را وارد کنید',
    label: 'شماره موبایل',
    placeholder: '09xxxxxxxxx',
    invalid: 'شماره موبایل وارد شده معتبر نیست',
    cta: 'دریافت کد تأیید',
  },

  otpStep: {
    title: 'تأیید هویت',
    subtitle: 'کد ۵ رقمی ارسال شده به شماره',
    back: 'ویرایش شماره',
    resend: 'ارسال مجدد کد',
    invalid: 'کد وارد شده نادرست است',
    expired: 'کد منقضی شده است، لطفاً مجدداً درخواست دهید',
    cta: 'تأیید و ادامه',
  },

  profileStep: {
    title: 'تکمیل پرونده سلامت',
    subtitle: 'لطفاً اطلاعات هویتی و پزشکی خود را تکمیل کنید',
    fields: {
      fullName: 'نام و نام خانوادگی',
      nationalId: 'کد ملی',
      dateOfBirth: 'تاریخ تولد',
      day: 'روز',
      month: 'ماه',
      year: 'سال',
      biologicalSex: 'جنسیت',
      primaryInsurance: 'بیمه پایه',
      secondaryInsurance: 'بیمه تکمیلی',
      physicalAddress: 'آدرس محل سکونت',
    },
    placeholders: {
      fullName: 'علی محمدی',
      nationalId: '۱۰ رقم',
      day: 'روز',
      year: 'سال',
      address: 'استان، شهر، خیابان...',
      select: 'انتخاب',
      noSecondary: 'ندارم',
    },
    sexOptions: [
      { value: 'male', label: 'مرد' },
      { value: 'female', label: 'زن' },
    ],
    insuranceOptions: [
      { value: 'none', label: 'آزاد' },
      { value: 'tamin', label: 'تأمین اجتماعی' },
      { value: 'salamat', label: 'بیمه سلامت' },
      { value: 'armed', label: 'نیروهای مسلح' },
    ],
    supplementaryOptions: [
      { value: '', label: 'ندارم' },
      { value: 'dana', label: 'دانا' },
      { value: 'asia', label: 'آسیا' },
      { value: 'iran', label: 'ایران' },
    ],
    cta: 'ایجاد پرونده و ورود',
    nationalIdDuplicate: 'این کد ملی قبلاً در سیستم ثبت شده است',
  },

  errors: {
    generic: 'خطایی رخ داد. لطفاً دوباره تلاش کنید',
    network: 'مشکل در اتصال به سرور',
    requiredField: 'این فیلد الزامی است',
  },
};

export default AUTH_MESSAGES;
