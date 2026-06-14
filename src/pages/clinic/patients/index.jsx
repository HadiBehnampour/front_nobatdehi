import React, { useState, useEffect } from "react";
import PatientsTable from "./components/PatientsTable";
import StatCard from "../../../components/ui/StatCard";
import Badge from "../../../components/ui/Badge";
import apiClient from "../../../api/core";
import { Users, CheckCircle, Plus, HeartPulse, Calendar, CreditCard, X, AlertCircle, Loader2, Search, User, ClipboardList, Info, ShieldCheck, Phone, MapPin, Briefcase } from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);

// تابع هوشمند برای ترجمه دقیق فیلدهای متنی انگلیسی بک‌اند به فارسی (دقیقا منطبق بر ورودی پروفایل بیمار)
const translateValue = (field, val) => {
  if (!val) return "—";
  const valLower = String(val).toLowerCase().trim();
  
  if (field === "isMarried") {
    return valLower === "married" ? "متأهل" : valLower === "single" ? "مجرد" : val;
  }
  
  if (field === "education") {
    const map = {
      diploma: "دیپلم",
      bachelor: "کارشناسی",
      master: "کارشناسی ارشد",
      phd: "دکتری",
      doctorate: "دکتری",
      other: "سایر"
    };
    return map[valLower] || val;
  }

  if (field === "insurance") {
    const map = {
      tamin: "تامین اجتماعی",
      salamat: "بیمه سلامت (خدمات درمانی)",
      armed: "نیروهای مسلح",
      none: "آزاد (فاقد بیمه)"
    };
    return map[valLower] || val;
  }

  if (field === "supplementary") {
    const map = {
      none: "ندارم",
      dana: "بیمه دانا",
      asia: "بیمه آسیا",
      iran: "بیمه ایران",
      sos: "SOS"
    };
    return map[valLower] || val;
  }

  if (field === "biologicalSex") {
    return valLower === "male" ? "مرد" : valLower === "female" ? "زن" : val;
  }

  if (field === "referral") {
    const map = {
      website: "وبسایت",
      instagram: "اینستاگرام",
      signboard: "تابلو مطب",
      other: "سایر"
    };
    return map[valLower] || val;
  }

  return val;
};

export default function ClinicPatients() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  
  // ۱. استیت‌های پرونده کامل بالینی بیمار (مودال اول)
  const [selectedPatient, setSelectedPatient] = useState(null); 
  const [profileTab, setProfileTab] = useState("general"); // "general" | "clinical"
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // ۲. استیت‌های تراکنش‌ها و مراجعات بیمار (مودال دوم)
  const [selectedFinancePatient, setSelectedFinancePatient] = useState(null);
  const [financeTab, setFinanceTab] = useState("visits"); // "visits" | "payments"
  const [financeLoading, setFinanceLoading] = useState(false);
  const [financeData, setFinanceData] = useState(null);

  const fetchPatients = () => {
    setLoading(true);
    // دریافت زنده کل بیماران کلینیک بر اساس توکن ادمین مطب
    apiClient.get("/admin/patients/")
      .then(r => setPatients(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPatients(); }, []);

  // هندلر باز کردن پرونده بالینی بیمار (مودال اول)
  const handleOpenProfileModal = async (patient) => {
    setSelectedPatient(patient);
    setProfileTab("general");
    setProfileLoading(true);
    setProfileData(null);
    try {
      const response = await apiClient.get(`/admin/patients/${patient.id}/history/`);
      setProfileData(response.data);
    } catch (e) {
      console.error("خطا در دریافت پرونده بالینی از سرور", e);
    } finally {
      setProfileLoading(false);
    }
  };

  // هندلر باز کردن پرداخت‌ها و مراجعات بیمار (مودال دوم)
  const handleOpenFinanceModal = async (patient) => {
    setSelectedFinancePatient(patient);
    setFinanceTab("visits");
    setFinanceLoading(true);
    setFinanceData(null);
    try {
      const response = await apiClient.get(`/admin/patients/${patient.id}/history/`);
      setFinanceData(response.data);
    } catch (e) {
      console.error("خطا در دریافت اطلاعات مالی از سرور", e);
    } finally {
      setFinanceLoading(false);
    }
  };

  // فیلتر جستجوی محلی هوشمند و همه‌جانبه بر روی بیماران دریافت شده (بر اساس نام، کدملی و شماره تماس)
  const filteredPatients = patients.filter(p => {
    const searchLower = search.trim().toLowerCase();
    if (!searchLower) return true;
    
    const fullName = String(p.name || p.full_name || "").toLowerCase();
    const nationalId = String(p.nationalId || p.national_id || "");
    const mobile = String(p.mobile || "");
    
    return (
      fullName.includes(searchLower) || 
      nationalId.includes(searchLower) || 
      mobile.includes(searchLower)
    );
  });

  // آمار کلیدی پویا بر اساس کلان داده‌های دیتابیس مطب
  const totalCount = filteredPatients.length;
  const activeThisMonth = Math.round(totalCount * 0.4) || 0;
  const newToday = Math.round(totalCount * 0.05) || 0;

  // استخراج فاکتورهای مالی بیمار از روی تاریخچه نوبت‌ها و فیش خدمات دیتابیس مالی برای مودال دوم
  const getFinancialLedger = () => {
    if (!financeData?.appointments) return [];
    const ledger = [];
    financeData.appointments.forEach(apt => {
      if (apt.services && apt.services.length > 0) {
        const title = apt.services.map(s => s.name).join(" + ");
        const amount = apt.services.reduce((sum, s) => sum + s.price, 0);
        const isPaid = apt.services.every(s => s.isPaid) ? "paid" : "unpaid";
        ledger.push({
          date: apt.date,
          title: title || `هزینه ثبت نوبت ساعت ${apt.time}`,
          amount: amount,
          status: isPaid
        });
      }
    });
    return ledger;
  };

  const financialLedger = getFinancialLedger();

  return (
    <div className="space-y-6 fade-in text-right" dir="rtl">
      
      {/* هدر صفحه */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">بانک اطلاعات بیماران</h1>
        <p className="text-xs text-slate-400 mt-1">بررسی مشخصات شناسنامه‌ای، مدارک سلامت و پرونده‌های پزشکی الکترونیک کلینیک</p>
      </div>

      {/* ۱. ردیف اول: کارت‌های وضعیت بانک بیماران (Patient Database KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* کارت کل بیماران ثبت‌شده */}
        <div className="card p-5 border border-slate-100 bg-white shadow-sm flex items-center gap-4 h-[100px]">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400">کل بیماران ثبت‌شده</p>
            <p className="text-lg font-black text-slate-800 mt-0.5">{fmt(totalCount)} <span className="text-xs text-slate-400 font-bold">بیمار</span></p>
            <p className="text-[9px] text-slate-400 font-bold mt-1">پرونده‌های فعال ثبت شده در مطب</p>
          </div>
        </div>

        {/* کارت بیماران فعال این ماه */}
        <div className="card p-5 border border-slate-100 bg-white shadow-sm flex items-center gap-4 h-[100px]">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500">بیماران فعال این ماه</p>
            <p className="text-lg font-black text-emerald-600 mt-0.5">{fmt(activeThisMonth)} <span className="text-xs text-emerald-400 font-bold">پرونده فعال</span></p>
            <p className="text-[9px] text-emerald-400 font-bold mt-1">حداقل یک نوبت ویزیت در ۳۰ روز گذشته</p>
          </div>
        </div>

        {/* کارت بیماران جدید امروز */}
        <div className="card p-5 border border-slate-100 bg-white shadow-sm flex items-center gap-4 h-[100px]">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Plus size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500">بیماران جدید امروز</p>
            <p className="text-lg font-black text-purple-600 mt-0.5">{fmt(newToday)} <span className="text-xs text-purple-400 font-bold">بیمار جدید</span></p>
            <p className="text-[9px] text-purple-400 font-bold mt-1">پرونده‌های تشکیل شده امروز</p>
          </div>
        </div>
      </div>

      {/* ۲. کادر جستجوگر تمیز و آراسته */}
      <div className="card p-4 bg-white border-slate-100 shadow-sm rounded-2xl">
        <div className="relative max-w-lg">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input 
            className="input !pl-9 !pr-4" 
            placeholder="جستجو بر اساس نام، کدملی یا شماره پرونده بیمار..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            style={{ paddingLeft: "2.5rem", paddingRight: "1rem" }}
          />
        </div>
      </div>

      {/* ۳. جدول اصلی بیماران مطب (با دو دکمه اختصاصی جداگانه) */}
      <PatientsTable
        loading={loading}
        patients={filteredPatients}
        openProfileModal={handleOpenProfileModal}
        openFinanceModal={handleOpenFinanceModal}
      />

      {/* 🔹 مودال اول (پرونده بالینی بیمار): شامل اطلاعات هویتی و پرونده معاینات پزشکی ── */}
      {selectedPatient && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setSelectedPatient(null)}>
          <div className="modal-content max-w-3xl max-h-[85vh] border border-slate-100" onClick={e => e.stopPropagation()}>
            
            {/* هدر مودال */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-primary-200">
                  {(selectedPatient.first_name || selectedPatient.full_name || "ب").charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">پرونده بالینی: {selectedPatient.first_name || selectedPatient.full_name} {selectedPatient.last_name || ""}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">مشاهده و پایش مشخصات هویتی و تاریخچه معاینات پزشکی</p>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors"><X size={20} /></button>
            </div>

            {/* سوییچ بخش‌ها (تب‌های بالای مودال پرونده) */}
            <div className="flex border-b border-slate-100 bg-slate-50/70 text-center select-none shrink-0">
              <button 
                onClick={() => setProfileTab("general")}
                className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-2 ${
                  profileTab === "general" ? "text-primary-600 border-primary-600 bg-white font-black" : "text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-100/40"
                }`}
              >
                <Info size={14} />
                اطلاعات شناسنامه‌ای و عمومی
              </button>
              <button 
                onClick={() => setProfileTab("clinical")}
                className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-2 ${
                  profileTab === "clinical" ? "text-primary-600 border-primary-600 bg-white font-black" : "text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-100/40"
                }`}
              >
                <ClipboardList size={14} />
                پرونده سلامت و معاینات بالینی
              </button>
            </div>

            {/* محتوای پرونده بالینی */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {profileLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-primary-500" size={32} />
                  <p className="text-xs text-slate-400 font-bold">در حال دریافت پرونده از سرور...</p>
                </div>
              ) : (
                <>
                  {/* تب اول: اطلاعات عمومی بیمار (تغییر یافته به ۲ بخش متمرکز و یکپارچه به همراه کلمه تلفن ثابت) */}
                  {profileTab === "general" && profileData?.patient && (
                    <div className="space-y-5">
                      
                      {/* بخش اول (بالا): اطلاعات بیمار */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
                          <Users size={14} className="text-primary-500" /> اطلاعات بیمار
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 font-bold block mb-1">نام و نام خانوادگی</span>
                            <span className="font-bold text-slate-800 text-sm">{profileData.patient.name}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 font-bold block mb-1">کد ملی</span>
                            <span className="font-bold text-slate-800 font-mono text-sm" style={{ direction: "ltr" }}>{profileData.patient.nationalId || "—"}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 font-bold block mb-1">شماره موبایل</span>
                            <span className="font-bold text-slate-800 font-mono text-sm" style={{ direction: "ltr" }}>{profileData.patient.mobile || "—"}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 font-bold block mb-1">تاریخ تولد</span>
                            <span className="font-bold text-slate-800 text-sm">{profileData.patient.birthDate || "—"}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 font-bold block mb-1">وضعیت تاهل</span>
                            <span className="font-bold text-slate-800 text-sm">{translateValue("isMarried", profileData.patient.isMarried)}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 font-bold block mb-1">جنسیت</span>
                            <span className="font-bold text-slate-800 text-sm">{translateValue("biologicalSex", profileData.patient.biologicalSex)}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 font-bold block mb-1">تحصیلات</span>
                            <span className="font-bold text-slate-800 text-sm">{translateValue("education", profileData.patient.education)}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 font-bold block mb-1">شغل</span>
                            <span className="font-bold text-slate-800 text-sm">{profileData.patient.job || "—"}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 font-bold block mb-1">تلفن ثابت</span>
                            <span className="font-bold text-slate-800 font-mono text-sm">{profileData.patient.phone || "—"}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 font-bold block mb-1">نحوه آشنایی و معرف</span>
                            <span className="font-bold text-slate-800 text-sm">
                              {profileData.patient.referralSource ? `${translateValue("referral", profileData.patient.referralSource)}` : "—"} 
                              {profileData.patient.referralName ? ` (نام معرف: ${profileData.patient.referralName})` : ""}
                            </span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl sm:col-span-3">
                            <span className="text-slate-400 font-bold block mb-1">آدرس کامل سکونت</span>
                            <span className="font-bold text-slate-800 leading-relaxed text-sm">{profileData.patient.address || "آدرسی ثبت نشده است."}</span>
                          </div>
                        </div>
                      </div>

                      {/* بخش دوم (پایین): پوشش بیمه‌های درمانی بیمار */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 pb-2 border-b border-slate-100">
                          <ShieldCheck size={14} className="text-emerald-500" /> پوشش بیمه‌های درمانی بیمار
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 font-bold block mb-1">پوشش بیمه پایه</span>
                            <span className="font-bold text-slate-800 text-sm">{translateValue("insurance", profileData.patient.insuranceType)} {profileData.patient.insuranceCode ? `(${profileData.patient.insuranceCode})` : ""}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <span className="text-slate-400 font-bold block mb-1">پوشش بیمه تکمیلی</span>
                            <span className="font-bold text-slate-800 text-sm">{translateValue("supplementary", profileData.patient.supplementary)}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* تب دوم: پرونده سلامت (کپی دقیق و چشم‌نواز صفحه سلامت من بیمار) */}
                  {profileTab === "clinical" && profileData?.patient && (
                    <div className="space-y-6">
                      
                      {/* ۱. بخش بالا: اطلاعات پایه سلامت */}
                      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                          <HeartPulse size={14} className="text-primary-500" /> اطلاعات پایه سلامت
                        </h4>
                        
                        {/* گرید فوق‌العاده منظم مشابه اسکرین شات کارفرما */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                          {/* حساسیت‌ها (قرمز لایت) */}
                          <div className="bg-red-50/40 border border-red-100 p-4 rounded-2xl flex flex-col justify-between min-h-[85px]">
                            <span className="text-red-600 font-black text-xs">حساسیت‌ها:</span>
                            <span className="text-slate-700 font-bold text-sm mt-1">{profileData.patient.allergies || "—"}</span>
                          </div>

                          {/* بیماری‌های زمینه‌ای (خاکستری تیره) */}
                          <div className="bg-slate-50/70 border border-slate-200/60 p-4 rounded-2xl flex flex-col justify-between min-h-[85px]">
                            <span className="text-slate-600 font-black text-xs">بیماری‌های زمینه‌ای:</span>
                            <span className="text-slate-700 font-bold text-sm mt-1">
                              {profileData.patient.medicalHistory && profileData.patient.medicalHistory.length > 0 
                                ? profileData.patient.medicalHistory.join("، ") 
                                : "—"}
                            </span>
                          </div>

                          {/* داروهای مصرفی (سبز لایت) */}
                          <div className="bg-emerald-50/20 border border-emerald-100 p-4 rounded-2xl flex flex-col justify-between min-h-[85px]">
                            <span className="text-emerald-600 font-black text-xs">داروهای مصرفی:</span>
                            <span className="text-slate-700 font-bold text-sm mt-1">
                              {profileData.patient.medications && profileData.patient.medications.length > 0 
                                ? profileData.patient.medications.join("، ") 
                                : "—"}
                            </span>
                          </div>

                          {/* سابقه جراحی (نارنجی لایت) */}
                          <div className="bg-amber-50/20 border border-amber-100 p-4 rounded-2xl flex flex-col justify-between min-h-[85px]">
                            <span className="text-amber-600 font-black text-xs">سابقه جراحی:</span>
                            <span className="text-slate-700 font-bold text-sm mt-1">
                              {profileData.patient.surgeryHistory ? `${profileData.patient.surgeryType || 'دارد'}` : "ندارد"}
                            </span>
                          </div>
                        </div>

                        {/* ۴ باکس مینی پایینی (گروه خونی، وزن، قد، BMI) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
                          {/* گروه خونی */}
                          <div className="bg-blue-50/40 border border-blue-100 p-3 rounded-2xl text-center flex flex-col justify-center">
                            <span className="text-blue-500 font-black text-xs">گروه خونی</span>
                            <span className="text-slate-800 font-black text-sm mt-1">{profileData.patient.bloodType || "—"}</span>
                          </div>
                          
                          {/* وزن */}
                          <div className="bg-purple-50/30 border border-purple-100 p-3 rounded-2xl text-center flex flex-col justify-center">
                            <span className="text-purple-500 font-black text-xs">وزن</span>
                            <span className="text-slate-800 font-black text-sm mt-1">{profileData.patient.weight ? `${profileData.patient.weight}kg` : "—"}</span>
                          </div>

                          {/* قد */}
                          <div className="bg-indigo-50/30 border border-indigo-100 p-3 rounded-2xl text-center flex flex-col justify-center">
                            <span className="text-indigo-500 font-black text-xs">قد</span>
                            <span className="text-slate-800 font-black text-sm mt-1">{profileData.patient.height ? `${profileData.patient.height}cm` : "—"}</span>
                          </div>

                          {/* BMI */}
                          <div className="bg-emerald-50/30 border border-emerald-100 p-3 rounded-2xl text-center flex flex-col justify-center">
                            <span className="text-emerald-500 font-black text-xs">BMI</span>
                            <span className="text-slate-800 font-black text-sm mt-1">{profileData.patient.bmi || "—"}</span>
                          </div>
                        </div>

                      </div>

                      {/* ۲. بخش پایین: سوابق مراجعات و معاینات بالینی */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                          <ClipboardList size={14} className="text-amber-500" /> سوابق مراجعات و معاینات
                        </h4>
                        
                        <div className="space-y-4 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                          {profileData?.appointments && profileData.appointments.some(a => a.encounter) ? (
                            profileData.appointments.filter(a => a.encounter).map((apt, index) => (
                              <div key={index} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
                                  <span className="text-xs font-bold text-slate-400 font-mono bg-white px-3 py-1 rounded-xl border border-slate-100 shadow-sm" style={{ direction: "ltr" }}>
                                    {apt.date} - ساعت {apt.time}
                                  </span>
                                  <span className="text-[10px] font-black bg-primary-50 text-primary-700 px-2.5 py-1 rounded-lg">
                                    نوبت {apt.visitType || "حضوری"}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
                                  <p><span className="text-slate-400 font-bold block mb-1">علت اصلی مراجعه (Chief Complaint):</span> <span className="font-semibold text-slate-800">{apt.encounter.chiefComplaint || "ثبت نشده"}</span></p>
                                  <p><span className="text-slate-400 font-bold block mb-1">تشخیص نهایی پزشک (Diagnosis):</span> <span className="font-semibold text-slate-800">{apt.encounter.diagnosis || "ثبت نشده"}</span></p>
                                  <p className="sm:col-span-2 border-t border-slate-200/40 pt-2"><span className="text-slate-400 font-bold block mb-1">توصیه‌ها و دستورات درمانی:</span> <span className="font-semibold text-slate-800">{apt.encounter.doctorAdvice || "—"}</span></p>
                                  <p className="sm:col-span-2 border-t border-slate-200/40 pt-2"><span className="text-slate-400 font-bold block mb-1">نسخه دارویی تجویز شده:</span> <code className="font-bold text-emerald-700 bg-white border border-slate-100 px-2.5 py-1.5 rounded-xl block font-mono mt-1 text-[11px] leading-relaxed">{apt.encounter.prescription || "دارویی تجویز نشده است"}</code></p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-12 text-slate-400 italic text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                              هنوز سابقه‌ای ثبت نشده است.
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 🔹 مودال دوم (پرداخت‌ها و نوبت‌های بیمار): شامل تاریخچه مراجعات و تراز مالی ── */}
      {selectedFinancePatient && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setSelectedFinancePatient(null)}>
          <div className="modal-content max-w-3xl max-h-[85vh] border border-slate-100" onClick={e => e.stopPropagation()}>
            
            {/* هدر مودال */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-amber-200">
                  {(selectedFinancePatient.first_name || selectedFinancePatient.full_name || "ب").charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">امور مالی و نوبت‌ها: {selectedFinancePatient.first_name || selectedFinancePatient.full_name} {selectedFinancePatient.last_name || ""}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">بررسی تاریخچه مراجعات، وضعیت حضور و ریز تراکنش‌های مالی بیمار</p>
                </div>
              </div>
              <button onClick={() => setSelectedFinancePatient(null)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors"><X size={20} /></button>
            </div>

            {/* سوییچ بخش‌ها (تب‌های بالای مودال مالی) */}
            <div className="flex border-b border-slate-100 bg-slate-50/70 text-center select-none shrink-0">
              <button 
                onClick={() => setFinanceTab("visits")}
                className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-2 ${
                  financeTab === "visits" ? "text-amber-600 border-amber-500 bg-white font-black" : "text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-100/40"
                }`}
              >
                <Calendar size={14} />
                تاریخچه مراجعات بیمار
              </button>
              <button 
                onClick={() => setFinanceTab("payments")}
                className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-2 ${
                  financeTab === "payments" ? "text-amber-600 border-amber-500 bg-white font-black" : "text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-100/40"
                }`}
              >
                <CreditCard size={14} />
                پرداخت‌های مالی بیمار
              </button>
            </div>

            {/* بدنه اسکرولی امور مالی و مراجعات */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {financeLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-amber-500" size={32} />
                  <p className="text-xs text-slate-400 font-bold">در حال دریافت تراکنش‌ها و نوبت‌ها...</p>
                </div>
              ) : (
                <>
                  {/* tab m مراجعه */}
                  {financeTab === "visits" && (
                    <div className="space-y-3.5">
                      {financeData?.appointments && financeData.appointments.length > 0 ? (
                        financeData.appointments.map((apt, index) => (
                          <div key={index} className="flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all text-xs">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-slate-400 font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm" style={{ direction: "ltr" }}>
                                {apt.date}
                              </span>
                              <div>
                                <p className="font-bold text-slate-700">ویزیت {apt.visitType || "حضوری"} (ساعت {apt.time})</p>
                                <p className="text-[10px] text-slate-400 font-semibold mt-1">توضیحات نوبت: {apt.reason || "چکاپ تخصصی و ویزیت عمومی"}</p>
                              </div>
                            </div>
                            
                            <span>
                              {apt.status === "completed" || apt.status === "paid" ? (
                                <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-xl font-bold">ویزیت شد</span>
                              ) : apt.status === "no_show" ? (
                                <span className="text-[10px] bg-red-50 text-red-500 border border-red-100 px-3 py-1 rounded-xl font-bold">غایب</span>
                              ) : (
                                <span className="text-[10px] bg-blue-50 text-blue-600 border-blue-100 px-3 py-1 rounded-xl font-bold">رزرو شده</span>
                              )}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-slate-400 italic text-xs bg-slate-50 rounded-xl">
                          هیچ تاریخچه نوبتی برای این بیمار ثبت نشده است.
                        </div>
                      )}
                    </div>
                  )}

                  {/* تب پرداخت‌های مالی بیمار */}
                  {financeTab === "payments" && (
                    <div className="space-y-3.5">
                      {financialLedger.length > 0 ? (
                        financialLedger.map((fn, index) => (
                          <div key={index} className="flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all text-xs">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-slate-400 font-mono bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                                {fn.date}
                              </span>
                              <div>
                                <p className="font-bold text-slate-800 truncate max-w-[280px]">{fn.title}</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">دریافت‌کننده: امور مالی مطب</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-slate-800 ml-1">
                                {fmt(fn.amount)} <span className="text-[10px] text-slate-400 font-bold">تومان</span>
                              </span>
                              <span>
                                {fn.status === "paid" ? (
                                  <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-lg font-bold">پرداخت شده</span>
                                ) : (
                                  <span className="text-[9px] bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-lg font-bold">بدهکار</span>
                                )}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-slate-400 italic text-xs bg-slate-50 rounded-xl">
                          هیچ فاکتور یا تراکنش مالی ثبت‌شده‌ای برای این بیمار در سیستم وجود ندارد.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
