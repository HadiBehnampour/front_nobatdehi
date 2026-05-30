import doctorImage from '../../../../assets/images/doctor.jpg';

// اطلاعات استاتیک (فرانت)
export const STATIC_INFO = {
  image: doctorImage,
  bio: 'دکتر ناصح یوسفی با بیش از ۱۵ سال سابقه درخشان در زمینه درمان غیرجراحی دیسک کمر و گردن، آرتروز مفاصل و آسیب‌های ورزشی فعالیت دارند. ایشان فارغ‌التحصیل از دانشگاه علوم پزشکی تهران و عضو انجمن جهانی طب فیزیکی می‌باشند.',
  credentials: [
    { icon: 'graduation', label: 'بورد تخصصی ناسیونال' },
    { icon: 'award', label: 'عضو انجمن طب فیزیکی آمریکا' }
  ],
  mapEmbedUrl: 'https://balad.ir/embed?p=654W4LlU5VNonf'
};

// مقادیر پیش‌فرض
export const DEFAULT_API_INFO = {
  doctorName: '',
  specialty: '',
  address: '',
  phone: '',
  mobile: '',
  workingHours: []
};
