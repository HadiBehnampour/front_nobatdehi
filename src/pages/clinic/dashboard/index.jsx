import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { DollarSign, Calendar, Users, Stethoscope, ArrowUpRight, ChevronRight, Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import Badge from "../../../components/ui/Badge";

const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);

// ── داده‌های شبیه‌سازی برای نمودار درآمد (هفتگی / ماهانه) ──
const WEEKLY_REVENUE = [
  { name: "شنبه", amount: 1200000 },
  { name: "۱شنبه", amount: 1800000 },
  { name: "۲شنبه", amount: 1500000 },
  { name: "۳شنبه", amount: 2400000 },
  { name: "۴شنبه", amount: 2900000 },
  { name: "۵شنبه", amount: 3200000 },
  { name: "جمعه", amount: 800000 },
];

const MONTHLY_REVENUE = [
  { name: "فروردین", amount: 18500000 },
  { name: "اردیبهشت", amount: 22300000 },
  { name: "خرداد", amount: 25100000 },
  { name: "تیر", amount: 28700000 },
  { name: "مرداد", amount: 32000000 },
  { name: "شهریور", amount: 35400000 },
  { name: "مهر", amount: 38100000 },
  { name: "آبان", amount: 42300000 },
];

// ── داده‌های شبیه‌سازی برای سهم درآمد (پزشکان / خدمات) ──
const DOCTOR_SHARE = [
  { name: "دکتر هادی", value: 45, color: "#3b82f6" },
  { name: "دکتر اکبری", value: 30, color: "#10b981" },
  { name: "دکتر صابری", value: 25, color: "#f59e0b" },
];

const SERVICE_SHARE = [
  { name: "ویزیت عمومی", value: 40, color: "#8b5cf6" },
  { name: "جراحی سرپایی", value: 35, color: "#ec4899" },
  { name: "مشاوره تخصص", value: 25, color: "#06b6d4" },
];

// داده‌های Sparkline برای کارت درآمد
const SPARKLINE_DATA = [
  { v: 12 }, { v: 18 }, { v: 15 }, { v: 24 }, { v: 29 }, { v: 32 }, { v: 22 }
];

// داده‌های لاگ رویدادها (Audit Logs)
const AUDIT_LOGS = [
  { id: 1, time: "۱۱:۲۰", text: "منشی ۱ در ساعت ۱۱:۲۰ نوبت آقای مرادی را حذف کرد", user: "منشی ۱", type: "delete" },
  { id: 2, time: "۱۱:۰۵", text: "دکتر حسینی در ساعت ۱۱:۰۵ پرونده بیمار شماره ۲۳ را ویرایش کرد", user: "دکتر حسینی", type: "edit" },
  { id: 3, time: "۱۰:۴۵", text: "منشی ۲ نوبت جدیدی برای خانم کریمی در ساعت ۱۶:۰۰ ثبت کرد", user: "منشی ۲", type: "create" },
  { id: 4, time: "۰۹:۳۰", text: "دکتر هادی ویزیت بیمار علی محمدی را خاتمه داد", user: "دکتر هادی", type: "complete" },
  { id: 5, time: "۰۸:۱۵", text: "سیستم پیامک یادآوری نوبت‌ها را به ۴۰ بیمار ارسال کرد", user: "سیستم", type: "system" },
];

export default function ClinicDashboard() {
  const [revenuePeriod, setRevenuePeriod] = useState("weekly"); // "weekly" | "monthly"
  const [donutType, setDonutType] = useState("doctors"); // "doctors" | "services"
  const [noShowRate, setNoShowRate] = useState(12); // درصد غیبت (مثال ۱۲٪ برای شبیه‌سازی هشدار بالای ۱۰٪)

  // محاسبات کارت نوبت‌های امروز
  const doneCount = 24;
  const totalCount = 40;
  const progressPercent = Math.round((doneCount / totalCount) * 100);
  const r = 16;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="space-y-6 fade-in text-right" dir="rtl">
      
      {/* هدر صفحه */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">داشبورد مدیریت مطب</h1>
        <p className="text-xs text-slate-400 mt-1">خلاصه وضعیت، تحلیل درآمدها و آخرین رویدادهای زنده کلینیک</p>
      </div>

      {/* 🔹 ردیف اول: کارت‌های وضعیت (KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* ۱. کارت درآمد امروز با Sparkline */}
        <div className="card p-5 border-slate-100 bg-white shadow-sm flex items-center justify-between relative overflow-hidden h-[105px]">
          <div>
            <p className="text-[11px] font-bold text-slate-400 mb-1">درآمد امروز مطب</p>
            <p className="text-xl font-black text-slate-800">۳,۴۵۰,۰۰۰ <span className="text-[10px] text-slate-400 font-bold">تومان</span></p>
            <p className="text-[10px] text-emerald-600 font-bold mt-1">▲ %۱۴ رشد نسبت به دیروز</p>
          </div>
          <div className="w-20 h-10 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPARKLINE_DATA}>
                <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ۲. کارت نوبت‌های امروز با Progress Circle */}
        <div className="card p-5 border-slate-100 bg-white shadow-sm flex items-center justify-between h-[105px]">
          <div>
            <p className="text-[11px] font-bold text-slate-400 mb-1">نوبت‌های امروز</p>
            <p className="text-xl font-black text-slate-800">{doneCount} <span className="text-xs text-slate-400 font-bold">انجام شده</span></p>
            <p className="text-[10px] text-slate-400 font-bold mt-1">از کل {totalCount} نوبت برنامه‌ریزی شده</p>
          </div>
          {/* Progress Circle SVG */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r={r} stroke="#f1f5f9" strokeWidth="4.5" fill="transparent" />
              <circle 
                cx="24" cy="24" r={r} stroke="#3b82f6" strokeWidth="4.5" fill="transparent" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[10px] font-black text-primary-600">% {progressPercent}</span>
          </div>
        </div>

        {/* ۳. کارت نرخ غیبت با شرط حساسیت بالای ۱۰ درصد */}
        <div className={`card p-5 border shadow-sm flex items-center justify-between h-[105px] transition-all duration-300 ${
          noShowRate >= 10 ? "bg-red-50/50 border-red-200" : "bg-white border-slate-100"
        }`}>
          <div>
            <p className="text-[11px] font-bold text-slate-400 mb-1">نرخ غیبت بیماران (No-Show)</p>
            <p className={`text-xl font-black ${noShowRate >= 10 ? "text-red-600" : "text-slate-800"}`}>
              {fmt(noShowRate)}٪
            </p>
            {noShowRate >= 10 ? (
              <div className="flex items-center gap-1 mt-1 text-[10px] text-red-500 font-bold">
                <AlertTriangle size={11} />
                <span>نرخ غیبت نگران‌کننده است (بالای ۱۰٪)</span>
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 font-bold mt-1">وضعیت غیبت بیماران در حالت ایده آل</p>
            )}
          </div>
          {/* امکان جابجایی نرخ غیبت برای نمایش شرط UX به کارفرما */}
          <button 
            onClick={() => setNoShowRate(noShowRate >= 10 ? 5 : 12)}
            className="text-[9px] font-black bg-slate-200/80 hover:bg-slate-300 text-slate-600 px-2 py-1 rounded-lg self-end shrink-0 transition-colors"
          >
            تغییر وضعیت تست
          </button>
        </div>

        {/* ۴. کارت پزشکان حاضر با افکت هاور باکس با جزییات */}
        <div className="card p-5 border-slate-100 bg-white shadow-sm flex items-center justify-between relative overflow-hidden group h-[105px] hover:shadow-md transition-shadow">
          <div>
            <p className="text-[11px] font-bold text-slate-400 mb-1">پزشکان حاضر در مطب</p>
            <p className="text-xl font-black text-slate-800">۳ <span className="text-xs text-slate-400 font-bold">از ۵ فعال</span></p>
            <p className="text-[9px] text-primary-500 font-bold mt-1.5 animate-pulse">✨ برای دیدن اسامی موس را نگه دارید</p>
          </div>
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
            <Stethoscope size={22} />
          </div>

          {/* ⚡ شرط UX: نمایش اسامی پزشکان حاضر در هاور با افکت نرم */}
          <div className="absolute inset-0 bg-white/95 flex flex-col justify-center px-5 py-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto border border-primary-100 shadow-lg">
            <p className="text-[9px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">لیست پزشکان حاضر هم‌اکنون:</p>
            <div className="space-y-1">
              {["دکتر هادی (قلب)", "دکتر اکبری (ارتوپد)", "دکتر صابری (پوست)"].map(name => (
                <div key={name} className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 🔹 ردیف دوم: بخش اصلی نمودارها (Charts Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ستون بزرگتر: درآمد مطب (خطی - ۷۰٪ عرض) */}
        <div className="card lg:col-span-2 border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-slate-700">نمودار تحلیل درآمد مطب</h3>
            
            {/* سوییچ تب بین هفتگی و ماهانه */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setRevenuePeriod("weekly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${revenuePeriod === "weekly" ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                هفتگی
              </button>
              <button 
                onClick={() => setRevenuePeriod("monthly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${revenuePeriod === "monthly" ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
              >
                ماهانه
              </button>
            </div>
          </div>

          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenuePeriod === "weekly" ? WEEKLY_REVENUE : MONTHLY_REVENUE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Vazirmatn", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis 
                  tickFormatter={v => `${v/1000000}M`} 
                  tick={{ fontSize: 11, fontFamily: "Vazirmatn", fill: "#94a3b8" }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip formatter={v => [`${fmt(v)} تومان`, 'درآمد']} contentStyle={{ fontFamily: "Vazirmatn", borderRadius: "12px", border: "1px solid #f1f5f9" }} />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ستون کوچکتر: سهم درآمد (دوناتی - ۳۰٪ عرض) */}
        <div className="card border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <ArrowUpRight size={16} className="text-primary-600" /> سهم درآمدی
            </h3>
            
            {/* دکمه دوحالته سوییچ سهم درآمد */}
            <button 
              onClick={() => setDonutType(donutType === "doctors" ? "services" : "doctors")}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-xl text-[10px] font-black transition-colors"
            >
              {donutType === "doctors" ? "نمایش بر اساس خدمات" : "نمایش بر اساس پزشکان"}
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center min-h-[220px]">
            <div className="w-full h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {/* دونات چارت با داشتن سوراخ وسط (innerRadius) */}
                  <Pie 
                    data={donutType === "doctors" ? DOCTOR_SHARE : SERVICE_SHARE} 
                    cx="50%" cy="50%" 
                    innerRadius={35} 
                    outerRadius={55} 
                    paddingAngle={4} 
                    dataKey="value"
                  >
                    {(donutType === "doctors" ? DOCTOR_SHARE : SERVICE_SHARE).map((d, i) => (
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

      {/* 🔹 ردیف سوم: جدول آخرین فعالیت‌ها (Audit Logs) */}
      <div className="card border-slate-100 shadow-sm overflow-hidden !p-0">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-700">جدول آخرین فعالیت‌ها (Audit Logs)</h3>
            <p className="text-[10px] text-slate-400 mt-1">ثبت زنده رویدادهای انجام شده توسط پرسنل و سیستم نوبت‌دهی</p>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> سیستم فعال
          </span>
        </div>
        
        <div className="table-container border-none rounded-none overflow-x-auto">
          <table className="w-full text-right border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 text-right w-24">ساعت</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 text-right">متن رویداد</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 text-center w-36">کاربر عامل</th>
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 text-left w-32">نوع عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {AUDIT_LOGS.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-400 text-right text-xs ltr" style={{ textAlign: "right" }}>
                    {log.time}
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-slate-700 text-right text-sm">
                    {log.text}
                  </td>
                  <td className="px-6 py-3.5 text-center align-middle font-bold text-slate-500 text-xs">
                    {log.user}
                  </td>
                  <td className="px-6 py-3.5 text-left align-middle">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${
                      log.type === "delete" ? "bg-red-50 text-red-600 border-red-100" :
                      log.type === "create" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      log.type === "edit" ? "bg-amber-50 text-amber-600 border-amber-100" :
                      log.type === "complete" ? "bg-blue-50 text-blue-600 border-blue-100" :
                      "bg-slate-50 text-slate-500 border-slate-100"
                    }`}>
                      {log.type === "delete" ? "حذف نوبت" :
                       log.type === "create" ? "ثبت نوبت" :
                       log.type === "edit" ? "ویرایش پرونده" :
                       log.type === "complete" ? "اتمام ویزیت" :
                       "سیستمی"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
