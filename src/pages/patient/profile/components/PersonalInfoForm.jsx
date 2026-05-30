import { User, HeartPulse, Briefcase, Stethoscope } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const SimpleDropdown = ({ value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setOpen(prev => !prev)}
        className="w-full p-3 text-sm bg-gray-50 rounded-xl border border-gray-200 cursor-pointer select-none text-gray-700"
      >
        {value || 'انتخاب کنید'}
      </div>

      {open && (
        <div className="absolute top-full mt-1 w-full max-h-40 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-md z-20">
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

  const CheckboxGroup = ({ options, value = [], onChange, allowOther }) => {
	  const [otherText, setOtherText] = useState('');

	  useEffect(() => {
	    if (!allowOther) return;

	    const otherValues = value.filter(v => !options.includes(v));
	    if (otherValues.length > 0) {
	      setOtherText(otherValues.join('، '));
	    }
	  }, [value, options, allowOther]);

  const handleOtherChange = (text) => {
    setOtherText(text);
    const filtered = value.filter(v => v !== otherText);
    if (text.trim()) {
      onChange([...filtered, text]);
    } else {
      onChange(filtered);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(opt)}
              onChange={() => toggle(opt)}
            />
            {opt}
          </label>
        ))}
      </div>

      {allowOther && (
        <input
          type="text"
          placeholder="سایر..."
          value={otherText}
          onChange={(e) => handleOtherChange(e.target.value)}
          className="w-full p-3 bg-white rounded-xl border border-gray-200 outline-none text-sm text-gray-800"
        />
      )}
    </div>
  );
};

const SectionCard = ({ icon: Icon, title, subtitle, children }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0">
          <Icon className="text-brand w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-base md:text-lg">{title}</h4>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

const FieldWrapper = ({ label, children, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
};

const inputClassName =
  'w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm text-gray-800 placeholder:text-gray-400';

const textareaClassName =
  'w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm text-gray-800 placeholder:text-gray-400 resize-none';

const PersonalInfoForm = ({ userData, setUserData }) => {
  const handleChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const referralOptions = [
	  { value: 'website', label: 'وبسایت' },
	  { value: 'instagram', label: 'اینستاگرام' },
	  { value: 'signboard', label: 'تابلو مطب' },
	  { value: 'other', label: 'سایر' }
	];


  const educationOptions = [
              { value: "", label: "انتخاب کنید" },
              { value: "diploma", label: "دیپلم" },
              { value: "bachelor", label: "کارشناسی" },
              { value: "master", label: "کارشناسی ارشد" },
              { value: "phd", label: "دکتری" },
	      { value: "other", label: "سایر" }
  ];

  const medicalHistoryOptions = [
    'فشار خون',
    'دیابت',
    'بیماری قلبی',
    'بیماری ریوی',
    'روماتیسم'
];

  const medicationOptions = [
    'آسپرین',
    'وارفارین',
    'متفورمین',
    'انسولین',
    'بتابلوکر'
  ];



  const currentYear = 1405;
  const years = Array.from({ length: 121 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i)
  }));

  const months = [
    { value: '01', label: 'فروردین' }, { value: '02', label: 'اردیبهشت' },
    { value: '03', label: 'خرداد' }, { value: '04', label: 'تیر' },
    { value: '05', label: 'مرداد' }, { value: '06', label: 'شهریور' },
    { value: '07', label: 'مهر' }, { value: '08', label: 'آبان' },
    { value: '09', label: 'آذر' }, { value: '10', label: 'دی' },
    { value: '11', label: 'بهمن' }, { value: '12', label: 'اسفند' }
  ];

  const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1)
  }));

  const [dateParts, setDateParts] = useState({ day: '01', month: '01', year: '1370' });

  useEffect(() => {
    if (userData.birthDate && userData.birthDate.includes('-')) {
      const parts = userData.birthDate.split('-');
      setDateParts({
        year: parts[0] || '1370',
        month: parts[1] || '01',
        day: parts[2] || '01'
      });
    }
  }, [userData.birthDate]);

  const handleDateChange = (part, value) => {
    const newParts = { ...dateParts, [part]: value };
    setDateParts(newParts);
    setUserData(prev => ({
      ...prev,
      birthDate: `${newParts.year}-${newParts.month}-${newParts.day}`
    }));
  };

  return (
    <form className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-2">
        <User className="text-brand" />
        <h3 className="font-bold text-xl text-gray-800">اطلاعات هویتی و سلامت</h3>
      </div>

      <div className="grid grid-cols-1 gap-6">

        <SectionCard
          icon={User}
          title="اطلاعات فردی"
          subtitle="مشخصات پایه بیمار را در این بخش تکمیل کنید"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <FieldWrapper label="نام و نام خانوادگی">
              <input
                type="text"
                value={userData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={inputClassName}
              />
            </FieldWrapper>

            <FieldWrapper label="کد ملی">
              <input
                type="text"
                value={userData.nationalId}
                onChange={(e) => handleChange('nationalId', e.target.value)}
                className={inputClassName}
              />
            </FieldWrapper>

            <FieldWrapper label="شماره موبایل">
              <input
                type="tel"
                value={userData.mobile}
                readOnly
                className="w-full p-3 bg-gray-100 text-gray-400 rounded-xl border border-gray-200 cursor-not-allowed text-sm"
              />
            </FieldWrapper>

            <FieldWrapper label="تاریخ تولد">
              <div className="grid grid-cols-3 gap-2">
                <SimpleDropdown value={dateParts.year} options={years} onChange={(v) => handleDateChange('year', v)} />
                <SimpleDropdown value={months.find(m => m.value === dateParts.month)?.label} options={months} onChange={(v) => handleDateChange('month', v)} />
                <SimpleDropdown value={dateParts.day} options={days} onChange={(v) => handleDateChange('day', v)} />
              </div>
            </FieldWrapper>

            <FieldWrapper label="وضعیت تاهل">
              <div className="flex items-center gap-6 p-3 bg-gray-50 rounded-xl border border-gray-200 min-h-[46px]">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="radio"
                    value="single"
                    checked={userData.isMarried === 'single'}
                    onChange={(e) => handleChange('isMarried', e.target.value)}
                    className="text-brand focus:ring-brand"
                  />
                  مجرد
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="radio"
                    value="married"
                    checked={userData.isMarried === 'married'}
                    onChange={(e) => handleChange('isMarried', e.target.value)}
                    className="text-brand focus:ring-brand"
                  />
                  متاهل
                </label>
              </div>
            </FieldWrapper>

            <FieldWrapper label="تحصیلات">
              <SimpleDropdown
                value={educationOptions.find(o => o.value === userData.education)?.label || 'انتخاب کنید'}
                options={educationOptions}
                onChange={(v) => handleChange('education', v)}
              />
            </FieldWrapper>

            <FieldWrapper label="شغل">
              <input
                type="text"
                value={userData.job}
                onChange={(e) => handleChange('job', e.target.value)}
                className={inputClassName}
              />
            </FieldWrapper>

            <FieldWrapper label="تلفن ثابت">
              <input
                type="text"
                value={userData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={inputClassName}
              />
            </FieldWrapper>

          </div>
        </SectionCard>

        <SectionCard
          icon={Stethoscope}
          title="اطلاعات پزشکی"
          subtitle="سوابق درمانی و اطلاعات مرتبط با سلامت بیمار"
        >
          <div className="grid grid-cols-1 gap-5">

            <FieldWrapper label="سوابق جراحی">
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={userData.surgeryHistory}
                      onChange={(e) => handleChange('surgeryHistory', e.target.checked)}
                    />
                    دارای سابقه جراحی هستم
                  </label>
                </div>

                {userData.surgeryHistory && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 space-y-3">
                    <FieldWrapper label="نوع جراحی" className="space-y-2">
                      <input
                        type="text"
                        placeholder="مثلاً جراحی بینی، آپاندیس، زایمان و ..."
                        value={userData.surgeryType}
			onChange={(e) => handleChange('surgeryType', e.target.value)}
                        className="w-full p-3 bg-white rounded-xl border border-rose-100 outline-none text-sm text-gray-800 placeholder:text-gray-400"
                      />
                    </FieldWrapper>

                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={userData.surgeryProsthesis}
                        onChange={(e) => handleChange('surgeryProsthesis', e.target.checked)}
                      />
                      آیا عمل پروتز یا پلاتین داشته‌اید؟
                    </label>
                  </div>
                )}
              </div>
            </FieldWrapper>

            <FieldWrapper label="داروهای مصرفی">
              <CheckboxGroup
                options={medicationOptions}
                value={userData.medications}
                onChange={(v) => handleChange('medications', v)}
                allowOther
              />
            </FieldWrapper>

            <FieldWrapper label="سوابق بیماری">
              <CheckboxGroup
                options={medicalHistoryOptions}
                value={userData.medicalHistory}
                onChange={(v) => handleChange('medicalHistory', v)}
                allowOther
              />
            </FieldWrapper>

	    <FieldWrapper label="حساسیت‌ها">
		  <input
		    type="text"
		    placeholder="مثلاً پنی‌سیلین، گردو، گرد و غبار و ..."
		    value={userData.allergies}
		    onChange={(e) => handleChange('allergies', e.target.value)}
		    className={inputClassName}
		  />
	    </FieldWrapper>


          </div>
        </SectionCard>

        <SectionCard
          icon={Briefcase}
          title="اطلاعات آشنایی و ارتباط"
          subtitle="نحوه آشنایی بیمار با مجموعه را مشخص کنید"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <FieldWrapper label="نحوه آشنایی">
              <SimpleDropdown
                value={referralOptions.find(o => o.value === userData.referralSource)?.label || 'انتخاب کنید'}
                options={referralOptions}
                onChange={(v) => handleChange('referralSource', v)}
              />
            </FieldWrapper>

            {userData.referralSource && (
              <FieldWrapper label="نام معرف">
                <input
                  type="text"
                  value={userData.referralName}
                  onChange={(e) => handleChange('referralName', e.target.value)}
                  className={inputClassName}
                />
              </FieldWrapper>
            )}

          </div>
        </SectionCard>

      </div>
    </form>
  );
};

export default PersonalInfoForm;
