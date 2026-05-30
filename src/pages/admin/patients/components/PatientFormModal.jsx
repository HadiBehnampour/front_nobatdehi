import React, { useEffect, useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import CustomSelect from './CustomSelect';

const PatientFormModal = ({
  isOpen, onClose, initialData,
  formData, setFormData, isLoading, onSubmit
}) => {

  /* ---------------------- اضافه‌شده: state برای تاریخ تولد ---------------------- */
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [noMedications, setNoMedications] = useState(false);
  const [noMedicalHistory, setNoMedicalHistory] = useState(false);
  const [noAllergies, setNoAllergies] = useState(false);


  /* ---------------------- اضافه‌شده: تولید سال‌ها (۱۰۰ سال گذشته) ---------------------- */
  const currentYearJalali = new Date().getFullYear() - 621;
  const years = Array.from({ length: 101 }, (_, i) => {
    const y = currentYearJalali - i;
    return { value: String(y), label: String(y) };
  });

  /* ---------------------- اضافه‌شده: ماه‌های فارسی ---------------------- */
  const months = [
    { value: "01", label: "فروردین" },
    { value: "02", label: "اردیبهشت" },
    { value: "03", label: "خرداد" },
    { value: "04", label: "تیر" },
    { value: "05", label: "مرداد" },
    { value: "06", label: "شهریور" },
    { value: "07", label: "مهر" },
    { value: "08", label: "آبان" },
    { value: "09", label: "آذر" },
    { value: "10", label: "دی" },
    { value: "11", label: "بهمن" },
    { value: "12", label: "اسفند" }
  ];

  /* ---------------------- اضافه‌شده: روزهای ۱ تا ۳۱ ---------------------- */
  const days = Array.from({ length: 31 }, (_, i) => {
    const d = i + 1;
    return { value: d < 10 ? `0${d}` : String(d), label: String(d) };
  });

  /* ---------------------- اصلاح اصلی: ریست درست تاریخ هنگام تغییر بیمار ---------------------- */


  const medicalHistoryOptions = [
    'دیابت',
    'فشار خون',
    'بیماری قلبی',
    'بیماری تیروئید',
    'آسم'
  ]


  const medicationOptions = [
    'آسپرین',
    'وارفارین',
    'متفورمین',
    'انسولین',
    'بتابلوکر'
  ];

  useEffect(() => {
	  if (initialData) {
	    const medicalList = initialData.medicalHistory || [];
	    const medicationList = initialData.medications || [];

	    const hasNoMedicalHistory = medicalList.includes('ندارد');
	    const hasNoMedications = medicationList.includes('ندارد');
	    const hasNoAllergies = initialData.allergies === 'ندارد';




	    const standardMedical = medicalList.filter(item =>
	      medicalHistoryOptions.includes(item)
	    );
	    const otherMedical = medicalList.filter(item =>
	      !medicalHistoryOptions.includes(item) && item !== 'ندارد'
	    );

	    const standardMedication = medicationList.filter(item =>
	      medicationOptions.includes(item)
	    );
	    const otherMedication = medicationList.filter(item =>
	      !medicationOptions.includes(item) && item !== 'ندارد'
	    );

	    setNoMedicalHistory(hasNoMedicalHistory);
	    setNoMedications(hasNoMedications);
	    setNoAllergies(hasNoAllergies);


	    setFormData({
	      name: initialData.name || "",
	      nationalId: initialData.nationalId || "",
	      mobile: initialData.mobile || "",
	      birthDate: initialData.birthDate || "",
	      insuranceType: initialData.insuranceType || "none",
	      insuranceCode: initialData.insuranceCode || "",
	      supplementary: initialData.supplementary || "none",
	      medicalHistory: hasNoMedicalHistory ? [] : standardMedical,
	      medications: hasNoMedications ? [] : standardMedication,
	      allergies: hasNoAllergies ? "" : (initialData.allergies || ""),
	      surgeryHistory: initialData.surgeryHistory ?? null,
	      surgeryType: initialData.surgeryType || "",
	      surgeryProsthesis: initialData.surgeryProsthesis || false,
	      bloodType: initialData.bloodType || "",
	      isMarried: initialData.isMarried || "single",
	      education: initialData.education || "",
	      job: initialData.job || "",
	      phone: initialData.phone || "",
	      referralSource: initialData.referralSource || "",
	      referralName: initialData.referralName || "",
	      address: initialData.address || "",
	      medicalHistoryOther: hasNoMedicalHistory ? "" : otherMedical.join("، "),
	      medicationsOther: hasNoMedications ? "" : otherMedication.join("، ")
	    });

	    if (initialData.birthDate && initialData.birthDate.includes("/")) {
	      const [y, m, d] = initialData.birthDate.split("/");
	      setBirthYear(y || "");
	      setBirthMonth(m || "");
	      setBirthDay(d || "");
	    } else {
	      setBirthYear("");
	      setBirthMonth("");
	      setBirthDay("");
	    }
	  }
	}, [initialData, setFormData]);

  /* ---------------------- آپدیت فرم هنگام تغییر هر بخش تاریخ ---------------------- */
  const updateBirthDate = (year, month, day) => {
    if (year && month && day) {
      setFormData(prev => ({ ...prev, birthDate: `${year}/${month}/${day}` }));
    } else {
      setFormData(prev => ({ ...prev, birthDate: "" }));
    }
  };

  

  const toggleArrayValue = (array, value) => {
    if (array.includes(value)) {
      return array.filter(v => v !== value);
    }
    return [...array, value];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <style>
        {`
          .custom-scroll {
            scrollbar-width: thin;
            scrollbar-color: #008236 transparent;
          }

          .custom-scroll::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scroll::-webkit-scrollbar-track {
            background: transparent;
            margin-top: 18px;
            margin-bottom: 18px;
            border-radius: 9999px;
          }

          .custom-scroll::-webkit-scrollbar-thumb {
            background: #008236;
            border-radius: 9999px;
          }

          .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: #006e2e;
          }

          select {
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg fill='gray' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M5.516 7.548c.436-.446 1.14-.446 1.576 0L10 10.516l2.908-2.968c.436-.446 1.14-.446 1.576 0s.436 1.168 0 1.614l-3.696 3.764a1.1 1.1 0 01-1.576 0L5.516 9.162c-.436-.446-.436-1.168 0-1.614z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: left 0.8rem center;
            background-size: 1rem;
            padding-left: 2.2rem !important;
            border-radius: 14px !important;
            border: 1px solid #e5e7eb !important;
            transition: all .2s;
          }

          select:focus {
            border-color: #008236 !important;
            box-shadow: 0 0 6px rgba(0,130,54,.25);
          }

          option {
            padding: 10px;
          }
        `}
      </style>

      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-6 relative animate-in zoom-in duration-200 my-4 overflow-hidden">

        <div className="max-h-[90vh] overflow-y-auto custom-scroll pr-6">

          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
            <h3 className="font-bold text-lg text-gray-800">
              {initialData ? '✏️ ویرایش پرونده' : '🆕 تشکیل پرونده جدید'}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full">
              <X size={20} />
            </button>
          </div>

          <form
		  onSubmit={(e) => {
		    e.preventDefault();

		    const finalData = { ...formData };

		    // --- Medical History ---
		    if (noMedicalHistory) {
		      finalData.medicalHistory = ['ندارد'];
		      finalData.medicalHistoryOther = "";
		    } else {
		      finalData.medicalHistory = finalData.medicalHistory.filter(item =>
		        medicalHistoryOptions.includes(item)
		      );

		      if (finalData.medicalHistoryOther && finalData.medicalHistoryOther.trim() !== "") {
		        const otherItems = finalData.medicalHistoryOther
			  .split("،")
			  .map(item => item.trim())
			  .filter(Boolean);

		        finalData.medicalHistory = [
			  ...finalData.medicalHistory,
			  ...otherItems
		        ];
		      }

		      // جلوگیری از ذخیره مقدار تکراری
		      finalData.medicalHistory = [...new Set(finalData.medicalHistory)];
		    }

		    // --- Medications ---
		    if (noMedications) {
		      finalData.medications = ['ندارد'];
		      finalData.medicationsOther = "";
		    } else {
		      finalData.medications = finalData.medications.filter(item =>
		        medicationOptions.includes(item)
		      );

		      if (finalData.medicationsOther && finalData.medicationsOther.trim() !== "") {
		        const otherItems = finalData.medicationsOther
			  .split("،")
			  .map(item => item.trim())
			  .filter(Boolean);

		        finalData.medications = [
			  ...finalData.medications,
			  ...otherItems
		        ];
		      }

		      // جلوگیری از ذخیره مقدار تکراری
		      finalData.medications = [...new Set(finalData.medications)];
		    }

		    // --- Allergies ---
		    if (noAllergies) {
		      finalData.allergies = 'ندارد';
		    }

		    if (finalData.surgeryHistory === false) {
			  finalData.surgeryType = "";
			  finalData.surgeryProsthesis = false;
			}

		    onSubmit(finalData);
		  }}
		  className="space-y-4"
		>





            {/* اطلاعات هویتی */}
            <div>
              <h4 className="text-sm font-bold text-gray-500 mb-2 border-b border-gray-50 pb-1">اطلاعات هویتی</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">نام و نام خانوادگی *</label>
                  <input type="text" required value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand text-sm" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">کد ملی *</label>
                  <input type="text" required maxLength={10} value={formData.nationalId}
                    onChange={e => setFormData({ ...formData, nationalId: e.target.value.replace(/\D/g, '') })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand text-sm"
                    placeholder="0012345678" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">موبایل *</label>
                  <input type="tel" required maxLength={11} value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand text-sm"
                    placeholder="09121234567" />
                </div>

                {/* ---------------------- تاریخ تولد ---------------------- */}
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">تاریخ تولد</label>
                  <div className="grid grid-cols-3 gap-2">

                    <CustomSelect
                      value={birthYear}
                      onChange={(e) => {
                        setBirthYear(e.target.value);
                        updateBirthDate(e.target.value, birthMonth, birthDay);
                      }}
                      options={years}
                      placeholder="سال"
                    />

                    <CustomSelect
                      value={birthMonth}
                      onChange={(e) => {
                        setBirthMonth(e.target.value);
                        updateBirthDate(birthYear, e.target.value, birthDay);
                      }}
                      options={months}
                      placeholder="ماه"
                    />

                    <CustomSelect
                      value={birthDay}
                      onChange={(e) => {
                        setBirthDay(e.target.value);
                        updateBirthDate(birthYear, birthMonth, e.target.value);
                      }}
                      options={days}
                      placeholder="روز"
                    />

                  </div>
                </div>
                {/* ---------------------- پایان ---------------------- */}

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">وضعیت تاهل</label>
                  <div className="flex gap-4 text-sm">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        checked={formData.isMarried === 'single'}
                        onChange={() => setFormData({ ...formData, isMarried: 'single' })}
                      />
                      مجرد
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        checked={formData.isMarried === 'married'}
                        onChange={() => setFormData({ ...formData, isMarried: 'married' })}
                      />
                      متاهل
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">تحصیلات</label>
                  <CustomSelect
                    value={formData.education}
                    onChange={e => setFormData({ ...formData, education: e.target.value })}
                    placeholder="انتخاب کنید"
                    options={[
                      { value: "", label: "انتخاب کنید" },
                      { value: "diploma", label: "دیپلم" },
                      { value: "bachelor", label: "کارشناسی" },
                      { value: "master", label: "کارشناسی ارشد" },
                      { value: "phd", label: "دکتری" },
      		      { value: "other", label: "سایر" }
                    ]}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">شغل</label>
                  <input type="text" value={formData.job}
                    onChange={e => setFormData({ ...formData, job: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand text-sm"
                    placeholder="مثلاً کارمند بانک، معلم، مهندس عمران" // NEW: Placeholder
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">تلفن ثابت</label>
                  <input type="text" value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand text-sm"
                    placeholder="مثلاً 02112345678" // NEW: Placeholder
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">آدرس</label>
                  <textarea rows="2" value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand resize-none text-sm"
                    placeholder="مثلاً تهران، خیابان ولیعصر، کوچه گلستان، پلاک ۱۲، واحد ۳" // NEW: Placeholder
                  />
                </div>

              </div>
            </div>

            {/* اطلاعات بیمه */}
            <div>
              <h4 className="text-sm font-bold text-gray-500 mb-2 border-b border-gray-50 pb-1">اطلاعات بیمه</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">نوع بیمه</label>
                  <CustomSelect
                    value={formData.insuranceType}
                    onChange={e => setFormData({ ...formData, insuranceType: e.target.value })}
                    options={[
                      { value: "none", label: "آزاد" },
                      { value: "tamin", label: "تامین اجتماعی" },
                      { value: "salamat", label: "سلامت" },
                      { value: "armed", label: "نیروهای مسلح" }
                    ]}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">شماره بیمه</label>
                  <input type="text" value={formData.insuranceCode}
                    onChange={e => setFormData({ ...formData, insuranceCode: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand text-sm" />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">بیمه تکمیلی</label>
                  <CustomSelect
                    value={formData.supplementary}
                    onChange={e => setFormData({ ...formData, supplementary: e.target.value })}
                    options={[
                      { value: "none", label: "ندارد" },
                      { value: "dana", label: "دانا" },
                      { value: "asia", label: "آسیا" },
                      { value: "iran", label: "ایران" }
                    ]}
                  />
                </div>

              </div>
            </div>

            {/* اطلاعات پزشکی */}
            <div>
              <h4 className="text-sm font-bold text-gray-500 mb-2 border-b border-gray-50 pb-1">اطلاعات پزشکی</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <div className="col-span-2">
		  <label className="text-xs font-bold text-gray-600 block mb-2">
		    سوابق جراحی
		  </label>

		  <div className="border border-gray-200 rounded-xl px-4 py-3 space-y-3">

		    <label className="flex items-center gap-2 text-sm">
		      <input
			type="radio"
			name="surgeryHistory"
			checked={formData.surgeryHistory === true}
			onChange={() =>
			  setFormData({
			    ...formData,
			    surgeryHistory: true
			  })
			}
		      />
		      دارای سابقه جراحی هستم
		    </label>

		    <label className="flex items-center gap-2 text-sm">
		      <input
			type="radio"
			name="surgeryHistory"
			checked={formData.surgeryHistory === false}
			onChange={() =>
			  setFormData({
			    ...formData,
			    surgeryHistory: false,
			    surgeryType: "",
			    surgeryProsthesis: false
			  })
			}
		      />
		      بدون سابقه جراحی
		    </label>

		    {formData.surgeryHistory === true && (
		      <>
			<div>
			  <label className="text-xs font-bold text-gray-600 mb-1 block">
			    نوع جراحی
			  </label>

			  <input
			    type="text"
			    placeholder="مثلاً جراحی بینی، آپاندیس، پا"
			    value={formData.surgeryType}
			    onChange={e =>
			      setFormData({
				...formData,
				surgeryType: e.target.value
			      })
			    }
			    className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand text-sm"
			  />
			</div>

			<label className="flex items-center gap-2 text-sm">
			  <input
			    type="checkbox"
			    checked={formData.surgeryProsthesis}
			    onChange={e =>
			      setFormData({
				...formData,
				surgeryProsthesis: e.target.checked
			      })
			    }
			  />
			  آیا عمل پروتز یا پلاتین داشته‌اید؟
			</label>
		      </>
		    )}

		  </div>
	        </div>


                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-600 block mb-2">
                    داروهای مصرفی
                  </label>

                  <button
                    type="button"
                    onClick={() => setNoMedications(!noMedications)}
                    className={`mb-3 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      noMedications
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {noMedications ? 'بدون مورد' : 'ندارد'}
                  </button>

                  {!noMedications && (
                    <div className="border border-gray-200 rounded-xl px-4 py-2 text-sm space-y-1">
                      {medicationOptions.map(opt => (
                        <label key={opt} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={Array.isArray(formData.medications) && formData.medications.includes(opt)}
                            onChange={() => {
                              setFormData({
                                ...formData,
                                medications: toggleArrayValue(
                                  Array.isArray(formData.medications)
                                    ? formData.medications.filter(item => item !== 'ندارد')
                                    : [],
                                  opt
                                )
                              });
                            }}
                          />
                          {opt}
                        </label>
                      ))}

                      <input
                        type="text"
                        placeholder="سایر..."
                        value={formData.medicationsOther}
                        onChange={e => {
                          setFormData({
                            ...formData,
                            medications: Array.isArray(formData.medications)
                              ? formData.medications.filter(item => item !== 'ندارد')
                              : [],
                            medicationsOther: e.target.value
                          });
                        }}
                        className="w-full border border-gray-200 rounded-xl px-2 py-1 mt-2 focus:outline-none focus:border-brand text-xs"
                      />
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-600 block mb-2">
                    سوابق بیماری
                  </label>

                  <button
                    type="button"
                    onClick={() => setNoMedicalHistory(!noMedicalHistory)}
                    className={`mb-3 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      noMedicalHistory
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {noMedicalHistory ? 'بدون مورد' : 'ندارد'}
                  </button>

                  {!noMedicalHistory && (
                    <div className="border border-gray-200 rounded-xl px-4 py-2 text-sm space-y-1">
                      {medicalHistoryOptions.map(opt => (
                        <label key={opt} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={Array.isArray(formData.medicalHistory) && formData.medicalHistory.includes(opt)}
                            onChange={() => {
                              setFormData({
                                ...formData,
                                medicalHistory: toggleArrayValue(
                                  Array.isArray(formData.medicalHistory)
                                    ? formData.medicalHistory.filter(item => item !== 'ندارد')
                                    : [],
                                  opt
                                )
                              });
                            }}
                          />
                          {opt}
                        </label>
                      ))}

                      <input
                        type="text"
                        placeholder="سایر..."
                        value={formData.medicalHistoryOther}
                        onChange={e => {
                          setFormData({
                            ...formData,
                            medicalHistory: Array.isArray(formData.medicalHistory)
                              ? formData.medicalHistory.filter(item => item !== 'ندارد')
                              : [],
                            medicalHistoryOther: e.target.value
                          });
                        }}
                        className="w-full border border-gray-200 rounded-xl px-2 py-1 mt-2 focus:outline-none focus:border-brand text-xs"
                      />
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-600 block mb-2">
                    حساسیت‌ها
                  </label>

                  <button
                    type="button"
                    onClick={() => setNoAllergies(!noAllergies)}
                    className={`mb-3 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      noAllergies
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {noAllergies ? 'بدون مورد' : 'ندارد'}
                  </button>

                  {!noAllergies && (
                    <textarea
                      rows="2"
                      value={formData.allergies}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          allergies: e.target.value
                        });
                      }}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand resize-none text-sm"
                      placeholder="مثلاً حساسیت دارویی یا غذایی (مثل پنی‌سیلین، گردو)" // NEW: Placeholder
                    />
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-600 mb-1 block">نحوه آشنایی</label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <CustomSelect
                      value={formData.referralSource}
                      onChange={e => setFormData({ ...formData, referralSource: e.target.value })}
                      placeholder="انتخاب کنید"
                      options={[
                        { value: "", label: "انتخاب کنید" },
                        { value: "website", label: "وب‌سایت" },
                        { value: "instagram", label: "اینستاگرام" },
                        { value: "signboard", label: " تابلو مطب" },
                        { value: "other", label: "سایر" }
                      ]}
                    />

                    <input
                      type="text"
                      placeholder="توضیح / نام معرف"
                      value={formData.referralName}
                      onChange={e => setFormData({ ...formData, referralName: e.target.value })}
                      className="border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-brand text-sm"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 text-sm transition-colors"

              >
                انصراف
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-brand-dark text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 flex items-center justify-center gap-2 disabled:opacity-50 text-sm transition-all"

              >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {initialData ? 'ذخیره تغییرات' : 'ثبت پرونده'}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default PatientFormModal;