import React, { useState, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Clock, Calendar, AlertTriangle, CheckCircle, Flame, ArrowUpRight, Loader2, User, ChevronLeft } from "lucide-react";
import Badge from "../../../components/ui/Badge";

const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);

// داده‌های آفلاین کانال‌های ثبت نوبت
const CHANNEL_DATA = [
  { name: "آنلاین (وب‌سایت)", value: 55, color: "#3b82f6" },
  { name: "تلفنی (منشی)", value: 30, color: "#f59e0b" },
  { name: "مراجعه حضوری", value: 15, color: "#10b981" },
];

// دیتای نوبت‌های شبیه‌سازی‌شده هر پزشک برای ردیف سوم تعاملی
const DOCTORS_TODAYS_LISTS = {
  "دکتر هادی": [
    { id: 1, time: "۰۹:۰۰", patient: "علی محمدی", service: "ویزیت قلب", status: "completed" },
    { id: 2, time: "۰۹:۳۰", patient: "sara احمدی", service: "اکوکاردیوگرافی", status: "completed" },
    { id: 3, time: "۱۰:۰۰", patient: "رضا کریمی", service: "ویزیت قلب", status: "waiting" },
    { id: 4, time: "۱۰:۳۰", patient: "مریم حسینی", service: "نوار قلب", status: "waiting" },
    { id: 5, time: "۱۱:۰۰", patient: "کامران علوی", service: "ویزیت قلب", status: "no_show" },
  ],
  "دکتر اکبری": [
    { id: 1, time: "۱۴:۰۰", patient: "رضا شایان", service: "ویزیت ارتوپد", status: "completed" },
    { id: 2, time: "۱۴:۳۰", patient: "فریبا نوری", service: "گچ‌گیری پا", status: "completed" },
    { id: 3, time: "۱۵:۰۰", patient: "امیر حسین منفرد", service: "ویزیت ارتوپد", status: "completed" },
  ],
  "دکتر صابری": [
    { id: 1, time: "۱۶:۰۰", patient: "حامد کرمی", service: "ویزیت پوست", status: "completed" },
    { id: 2, time: "۱۶:۳۰", patient: "شیما مرادی", service: "پاکسازی پوست", status: "waiting" },
    { id: 3, time: "۱۷:۰۰", patient: "سعید راد", service: "لیزر درمانی", status: "no_show" },
  ]
};

export default function ClinicAppointments() {
  const [selectedDate, setSelectedDate] = useState(() => new DateObject({ calendar: persian, locale: persian_fa }));
  const [loading, setLoading] = useState(false);
  
  // استیت پزشک انتخاب شده برای دیدن نوبت‌ها در ردیف سوم
  const [selectedDoc, setSelectedDoc] = useState("دکتر هادی");

  // شبیه‌سازی لودینگ به ازای تغییر تاریخ
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [selectedDate]);

  // تغییر پویای دیتا بر اساس تاریخ انتخاب شده
  const dateSeed = selectedDate ? selectedDate.day % 3 : 0;

  const waitTime = 15 + (dateSeed * 3);
  const emptyAppointments = 2 + dateSeed; // جایگزین اسلات سوخته -> نوبت‌های خالی امروز
  const occupancyRate = 75 + (dateSeed * 4); // نرخ اشغال ظرفیت نوبت‌ها
  const completionRate = 80 + (dateSeed * 5);

  // داده‌های جدید: نمودار بهره‌وری نوبت‌های پزشکان (Stacked Bar Chart)
  const doctorsProductivityData = [
    { name: "دکتر هادی", visited: 12 + dateSeed, waiting: 4 - dateSeed, expired: 2 },
    { name: "دکتر اکبری", visited: 10, waiting: 0, expired: 2 + dateSeed },
    { name: "دکتر صابری", visited: 6 - dateSeed, waiting: 2 + dateSeed, expired: 2 },
  ];

  // دیتای پایش کلی پزشکان
  const doctorsMonitor = [
    { id: "doc-1", name: "دکتر هادی", total: 18, visited: 12 + dateSeed, remaining: 6 - dateSeed, status: "۲۵ دقیقه عقب‌تر از برنامه ⚠️", statusType: "warning" },
    { id: "doc-2", name: "دکتر اکبری", total: 12, visited: 12, remaining: 0, status: "اتمام طبق برنامه ⏱", statusType: "success" },
    { id: "doc-3", name: "دکتر صابری", total: 10, visited: 8 - dateSeed, remaining: 2 + dateSeed, status: "طبق برنامه ⏱", statusType: "info" },
  ];

  const currentAppointmentsList = DOCTORS_TODAYS_LISTS[selectedDoc] || [];

  // دایره پیشرفت بصری برای کارت نرخ اشغال ظرفیت
  const rCircle = 16;
  const circumferenceCircle = 2 * Math.PI * rCircle;
  const strokeDashoffsetCircle = circumferenceCircle - (occupancyRate / 100) * circumferenceCircle;

  return (
    <div className="space-y-6 fade-in text-right" dir="rtl">
      
      {/* 🔹 بخش هدر: انتخابگر تاریخ (Date Toolbar) */}
      <div className="card p-4 sm:p-5 bg-white border-slate-100 shadow-sm rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">پایش و تحلیل نوبت‌ها</h1>
          <p className="text-xs text-slate-400 mt-0.5">وضعیت شلوغی مطب، زمان انتظار و آمار نوبت‌دهی روزانه</p>
        </div>
        
        {/* انتخابگر تاریخ شمسی */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-black text-slate-400 flex items-center gap-1.5"><Calendar size={14}/> نمایش اطلاعات روز:</span>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            containerClassName="w-full sm:w-auto"
            inputClass="bg-surface-muted hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl h-10 px-4 cursor-pointer outline-none border-none text-center transition-all focus:ring-2 focus:ring-primary-500 w-[140px]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-36 gap-4 bg-transparent">
          <Loader2 className="animate-spin text-primary-500" size={40} />
          <p className="text-xs font-bold text-slate-400">در حال بروزرسانی اطلاعات روز {selectedDate.format("DD MMMM YYYY")}...</p>
        </div>
      ) : (
        <>
          {/* 🔹 ردیف اول: کارت‌های وضعیت جریان نوبت‌ها (Appointment Flow KPIs) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* ۱. کارت میانگین زمان انتظار */}
            <div className="card p-5 border-slate-100 bg-white shadow-sm flex items-center gap-4 h-[100px]">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Clock size={22} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400">میانگین زمان انتظار</p>
                <p className="text-lg font-black text-slate-800 mt-0.5">{fmt(waitTime)} <span className="text-xs text-slate-400 font-bold">دقیقه</span></p>
                <p className="text-[9px] text-slate-400 font-bold mt-1">مدت معطلی در سالن انتظار</p>
              </div>
            </div>

            {/* ۲. کارت نوبت‌های خالی امروز (جایگزین اسلات سوخته بدون استفاده از کلمه اسلات یا سوخت) */}
            <div className="card p-5 border-slate-100 bg-white shadow-sm flex items-center gap-4 h-[100px]">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <AlertTriangle size={22} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400">نوبت‌های خالی امروز</p>
                <p className="text-lg font-black text-rose-600 mt-0.5">{fmt(emptyAppointments)} <span className="text-xs text-rose-400 font-bold">نوبت خالی</span></p>
                <p className="text-[9px] text-rose-400 font-bold mt-1">ظرفیت نوبت‌های رزرو نشده و خالی</p>
              </div>
            </div>

            {/* ۳. کارت نرخ اشغال ظرفیت نوبت‌ها (جدید - جایگزین کارت اضطراری با مشخصات مدنظر کارفرما) */}
            <div className="card p-5 border-slate-100 bg-white shadow-sm flex items-center justify-between h-[100px]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                  <Flame size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400">نرخ اشغال ظرفیت</p>
                  <p className="text-lg font-black text-slate-800 mt-0.5">٪ {fmt(occupancyRate)}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1">میزان بهره‌وری از کل ظرفیت زمانی مطب</p>
                </div>
              </div>
              
              {/* مینی نمودار دایره‌ای پیشرفت در گوشه کارت */}
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="20" cy="20" r={rCircle} stroke="#f1f5f9" strokeWidth="3.5" fill="transparent" />
                  <circle 
                    cx="20" cy="20" r={rCircle} stroke="#f59e0b" strokeWidth="3.5" fill="transparent" 
                    strokeDasharray={circumferenceCircle}
                    strokeDashoffset={strokeDashoffsetCircle}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[8px] font-black text-amber-600">% {occupancyRate}</span>
              </div>
            </div>

            {/* ۴. کارت نرخ اتمام نوبت‌ها */}
            <div className="card p-5 border-slate-100 bg-white shadow-sm flex items-center gap-4 h-[100px]">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle size={22} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400">نرخ اتمام نوبت‌ها</p>
                <p className="text-lg font-black text-emerald-600 mt-0.5">٪ {fmt(completionRate)}</p>
                <p className="text-[9px] text-emerald-400 font-bold mt-1">نسبت ویزیت‌های موفق به کل نوبت‌ها</p>
              </div>
            </div>

          </div>

          {/* 🔹 ردیف دوم: نمودارهای تحلیلی اصلاح شده (Analytics Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ستون بزرگتر: نمودار بهره‌وری نوبت‌های پزشکان (Stacked Bar Chart) */}
            <div className="card lg:col-span-2 border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">نمودار بهره‌وری نوبت‌های پزشکان</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">تفکیک وضعیت کل ظرفیت نوبت‌دهی پزشکان در تاریخ انتخاب شده</p>
              </div>
              
              <div className="w-full h-[220px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={doctorsProductivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Vazirmatn", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fontFamily: "Vazirmatn", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={v => [`${fmt(v)} نوبت`, 'تعداد']} contentStyle={{ fontFamily: "Vazirmatn", borderRadius: "12px", border: "1px solid #f1f5f9" }} />
                    {/* تنظیم وزن ضخیم و تیره برای رنگ نوشته‌های لژند پایین نمودار بر اساس درخواست کارفرما */}
                    <Legend 
                      iconType="circle" 
                      iconSize={8} 
                      wrapperStyle={{ fontSize: 10, fontFamily: "Vazirmatn", color: "#334155", fontWeight: "800" }} 
                    />
                    {/* ساختار انباشته با افکت گوشه گرد در بالاترین لایه، رنگ جدید و عرض باریک‌تر */}
                    <Bar dataKey="visited" stackId="slots" barSize={28} fill="#10B981" name="ویزیت‌شده" />
                    <Bar dataKey="waiting" stackId="slots" barSize={28} fill="#3B82F6" name="در انتظار" />
                    <Bar dataKey="expired" stackId="slots" barSize={28} fill="#b6b9be" radius={[6, 6, 0, 0]} name="ظرفیت خالی" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ستون کوچکتر: کانال‌های ثبت نوبت */}
            <div className="card border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <ArrowUpRight size={16} className="text-primary-600" /> کانال‌های ثبت نوبت
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">سهم روش‌های رزرواسیون امروز</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center min-h-[220px]">
                <div className="w-full h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={CHANNEL_DATA} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={4} dataKey="value">
                        {CHANNEL_DATA.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={v => [`${v}٪`, 'سهم']} contentStyle={{ fontFamily: "Vazirmatn", borderRadius: "12px", border: "1px solid #f1f5f9" }} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: "Vazirmatn", color: "#64748b" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>

          {/* 🔹 ردیف سوم تعاملی: جدول پایش به همراه نمایش زنده نوبت‌های پزشک در زیر آن */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* جدول پایش وضعیت پزشکان (سمت راست) */}
            <div className="lg:col-span-2 card border-slate-100 shadow-sm overflow-hidden !p-0">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700">وضعیت پیشرفت زمانی و پایداری نوبت پزشکان</h3>
                <p className="text-[10px] text-slate-400 mt-1">💡 برای مشاهده لیست نوبت‌های امروز هر پزشک، بر روی ردیف آن کلیک کنید</p>
              </div>
              
              <div className="table-container border-none rounded-none overflow-x-auto">
                <table className="w-full text-right border-collapse bg-white">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-500 text-right">نام پزشک</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-500 text-center">کل نوبت‌ها</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-500 text-center">ویزیت شده</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-500 text-center">باقی‌مانده</th>
                      <th className="px-5 py-3.5 text-xs font-bold text-slate-500 text-left">وضعیت پایداری زمان‌بندی</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {doctorsMonitor.map((doc, idx) => (
                      <tr 
                        key={idx} 
                        onClick={() => setSelectedDoc(doc.name)}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedDoc === doc.name ? "bg-primary-50/50 font-bold" : "hover:bg-slate-50/40"
                        }`}
                      >
                        <td className="px-5 py-3.5 text-right text-sm">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${selectedDoc === doc.name ? "bg-primary-600 scale-125" : "bg-transparent"}`} />
                            <span className={selectedDoc === doc.name ? "text-primary-700 font-extrabold" : "text-slate-800"}>{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center align-middle text-slate-600 text-sm">
                          {fmt(doc.total)} نوبت
                        </td>
                        <td className="px-5 py-3.5 text-center align-middle text-emerald-600 text-sm">
                          {fmt(doc.visited)} ویزیت
                        </td>
                        <td className="px-5 py-3.5 text-center align-middle text-amber-600 text-sm">
                          {fmt(doc.remaining)} نوبت
                        </td>
                        <td className="px-5 py-3.5 text-left align-middle">
                          <span className={`text-[10px] px-2.5 py-1 rounded-xl border font-bold ${
                            doc.statusType === "warning" ? "bg-red-50 text-red-600 border-red-100" :
                            doc.statusType === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            "bg-blue-50 text-blue-600 border-blue-100"
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* لیست زنده نوبت‌های امروز پزشک انتخاب شده (سمت چپ) */}
            <div className="card border-slate-100 shadow-sm flex flex-col justify-between p-5 bg-white">
              <div>
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <h3 className="text-xs font-black text-slate-400 flex items-center gap-1.5">
                    <User size={14} className="text-primary-500" /> لیست نوبت‌های امروز
                  </h3>
                  <span className="text-[10px] font-black bg-primary-50 text-primary-700 px-2.5 py-1 rounded-xl border border-primary-100">
                    {selectedDoc}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                  {currentAppointmentsList.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-2.5 bg-slate-50/80 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 font-mono bg-white px-2 py-1 rounded-lg border border-slate-100">
                          {apt.time}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{apt.patient}</p>
                          <p className="text-[9px] text-slate-400 font-medium mt-0.5">{apt.service}</p>
                        </div>
                      </div>
                      
                      <span>
                        {apt.status === "completed" && (
                          <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-lg font-bold">ویزیت شد</span>
                        )}
                        {apt.status === "waiting" && (
                          <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-lg font-bold">در انتظار</span>
                        )}
                        {apt.status === "no_show" && (
                          <span className="text-[9px] bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-lg font-bold">غایب</span>
                        )}
                      </span>
                    </div>
                  ))}
                  {currentAppointmentsList.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-8">هیچ نوبتی برای این پزشک ثبت نشده است</p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span>مجموع نوبت‌ها: {fmt(currentAppointmentsList.length)} بیمار</span>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
