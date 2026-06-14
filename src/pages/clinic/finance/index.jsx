import React, { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { DollarSign, TrendingDown, Plus, CreditCard, Calendar, Wallet, FileText, Loader2, ArrowUpRight, PlusCircle, AlertCircle, ShieldCheck, X, Save, Users, Clock } from "lucide-react";
import Badge from "../../../components/ui/Badge";
import StatCard from "../../../components/ui/StatCard";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);

// ── داده‌های اولیه تراکنش‌های صندوق کلینیک ──
const INITIAL_INCOME_TRANSACTIONS = [
  { id: "inc-001", patient: "علی محمدی", service: "ویزیت تخصصی قلب", amount: 450000, method: "کارتخوان", date: "۱۴۰۳/۰۸/۱۸", status: "success" },
  { id: "inc-002", patient: "سارا احمدی", service: "اکوکاردیوگرافی قلب", amount: 750000, method: "کارتخوان", date: "۱۴۰۳/۰۸/۱۸", status: "success" },
  { id: "inc-003", patient: "فاطمه کریمی", service: "ویزیت تخصصی ارتوپد", amount: 650000, method: "آنلاین ZP", date: "۱۴۰۳/۰۸/۱۷", status: "success" },
  { id: "inc-004", patient: "کامران علوی", service: "ویزیت عمومی و تست قند", amount: 250000, method: "کارتخوان", date: "۱۴۰۳/۰۸/۱۶", status: "success" },
  { id: "inc-005", patient: "مریم حسینی", service: "نوار قلب و معاینه", amount: 450000, method: "کارتخوان", date: "۱۴۰۳/۰۸/۱۵", status: "pending" },
];

// داده‌های درآمد ماهیانه ۴ ماهه
const FOUR_MONTHS_REVENUE = [
  { month: "مرداد", income: 18500000, expense: 6200000 },
  { month: "شهریور", income: 22300000, expense: 5800000 },
  { month: "مهر", income: 25100000, expense: 7100000 },
  { month: "آبان", income: 28700000, expense: 8500000 },
];

// داده‌های درآمد هفته جاری (شنبه تا جمعه)
const WEEKLY_REVENUE_CHART = [
  { month: "شنبه", income: 1200000, expense: 280000 },
  { month: "۱شنبه", income: 1800000, expense: 0 },
  { month: "۲شنبه", income: 1500000, expense: 420000 },
  { month: "۳شنبه", income: 2400000, expense: 150000 },
  { month: "۴شنبه", income: 2900000, expense: 8000000 }, // اجاره مطب
  { month: "۵شنبه", income: 3200000, expense: 0 },
  { month: "جمعه", income: 800000, expense: 0 },
];

// داده‌های درآمد امروز مطب (بر حسب ساعت)
const TODAY_REVENUE_CHART = [
  { month: "۰۹:۰۰", income: 450000, expense: 0 },
  { month: "۱۰:۰۰", income: 750000, expense: 0 },
  { month: "۱۱:۰۰", income: 0, expense: 285000 }, // خرید الکل
  { month: "۱۲:۰۰", income: 1200000, expense: 0 },
];

const COLORS_PALETTE = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function ClinicFinancials() {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [timeFilter, setTimeFilter] = useState("four_months"); // "today" | "weekly" | "four_months"
  
  // هزینه‌های جاری
  const [expenseList, setExpenseList] = useState([
    { id: "exp-001", title: "خرید الکل و مواد ضدعفونی مصرفی", category: "مواد مصرفی", amount: 285000, date: "۱۴۰۳/۰۸/۱۰" },
    { id: "exp-002", title: "پرداخت اجاره مطب آبان ماه", category: "اجاره مطب", amount: 8000000, date: "۱۴۰۳/۰۸/۰۱" },
    { id: "exp-003", title: "تسویه فیش برق و اشتراک خط ویژه", category: "قبوض", amount: 420000, date: "۱۴۰۳/۰۸/۰۵" },
  ]);

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category: "مواد مصرفی",
    amount: "",
    date: new DateObject({ calendar: persian, locale: persian_fa })
  });

  const [savingExpense, setSavingExpense] = useState(false);

  // محاسبات مقادیر پویا بر اساس بازه انتخابی زمان (امروز / هفتگی / ۴ ماهه)
  const getDynamicKPIs = () => {
    if (timeFilter === "today") {
      const revenue = 2400000;
      const expense = 285000;
      return {
        revenue,
        expense,
        net: revenue - expense,
        averageTicket: 600000,
        bookingCost: 450000, // مجموع هزینه رزرو امروز
        chartData: TODAY_REVENUE_CHART,
        incomes: INITIAL_INCOME_TRANSACTIONS.slice(0, 2),
        expenses: expenseList.filter(e => e.date === "۱۴۰۳/۰۸/۱۰" || e.id === "exp-004") // هزینه امروز
      };
    }

    if (timeFilter === "weekly") {
      const revenue = 16800000;
      const expense = 8850000;
      return {
        revenue,
        expense,
        net: revenue - expense,
        averageTicket: 480000,
        bookingCost: 2850000, // مجموع هزینه رزرو این هفته
        chartData: WEEKLY_REVENUE_CHART,
        incomes: INITIAL_INCOME_TRANSACTIONS.slice(0, 4),
        expenses: expenseList.slice(0, 3)
      };
    }

    // پیش‌فرض: ۴ ماهه
    return {
      revenue: totalIncome,
      expense: totalExpense,
      net: totalIncome - totalExpense,
      averageTicket: Math.round(totalIncome / 350) || 0,
      bookingCost: 14500000, // مجموع هزینه رزرو کلان پلتفرم
      chartData: financialsChart,
      incomes: INITIAL_INCOME_TRANSACTIONS,
      expenses: expenseList
    };
  };

  // داده‌های چارت ۴ ماهه اولیه
  const [financialsChart, setFinancialsChart] = useState(FOUR_MONTHS_REVENUE);

  const totalIncome = financialsChart.reduce((acc, cur) => acc + cur.income, 0);
  const baseExpense = financialsChart.reduce((acc, cur) => acc + cur.expense, 0);
  const currentExpensesSum = expenseList.reduce((acc, cur) => acc + cur.amount, 0);
  const totalExpense = baseExpense + currentExpensesSum;

  const kpis = getDynamicKPIs();

  // هندلر ثبت هزینه جاری جدید
  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.title.trim() || !expenseForm.amount) {
      alert("عنوان هزینه و مبلغ الزامی هستند");
      return;
    }
    
    setSavingExpense(true);
    
    setTimeout(() => {
      const newExpenseItem = {
        id: `exp-00${expenseList.length + 1}`,
        title: expenseForm.title.trim(),
        category: expenseForm.category,
        amount: parseInt(expenseForm.amount) || 0,
        date: expenseForm.date ? expenseForm.date.format("YYYY/MM/DD") : "۱۴۰۳/۰۸/۱۸"
      };

      setExpenseList([newExpenseItem, ...expenseList]);

      setFinancialsChart(prev => prev.map(m => {
        if (m.month === "آبان") {
          return { ...m, expense: m.expense + newExpenseItem.amount };
        }
        return m;
      }));

      setExpenseForm({
        title: "",
        category: "مواد مصرفی",
        amount: "",
        date: new DateObject({ calendar: persian, locale: persian_fa })
      });
      setShowExpenseModal(false);
      setSavingExpense(false);
    }, 300);
  };

  // ⚡ محاسبه‌ی کاملاً پویا و زنده سهم خدمات (۴ خدمت برتر + گروه «سایر» بابت رفع ۱۰۰٪ اسکرول)
  const getDynamicServiceShare = () => {
    const shareMap = {};
    let totalAmount = 0;
    
    kpis.incomes.forEach(tx => {
      const amount = tx.amount || 0;
      totalAmount += amount;
      
      const serviceName = tx.service || "سایر";
      if (shareMap[serviceName]) {
        shareMap[serviceName] += amount;
      } else {
        shareMap[serviceName] = amount;
      }
    });
    
    if (totalAmount === 0) return [];
    
    // سورت نزولی بر اساس تراز سهم درآمدی
    const sortedServices = Object.entries(shareMap).sort((a, b) => b[1] - a[1]);
    
    // تفکیک ۴ خدمت اول و جمع زدن مابقی در گروه «سایر»
    const top4 = sortedServices.slice(0, 4);
    const rest = sortedServices.slice(4);
    
    const finalShare = top4.map(([name, val]) => ({ name, amount: val }));
    
    if (rest.length > 0) {
      const otherSum = rest.reduce((sum, [, val]) => sum + val, 0);
      finalShare.push({ name: "سایر", amount: otherSum });
    }
    
    return finalShare.map((item, idx) => ({
      name: item.name,
      value: Math.round((item.amount / totalAmount) * 100),
      color: COLORS_PALETTE[idx % COLORS_PALETTE.length]
    }));
  };

  const serviceShareData = getDynamicServiceShare();

  return (
    <div className="space-y-6 fade-in text-right" dir="rtl">
      
      {/* هدر صفحه و انتخابگر پویای فیلتر زمان */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">مدیریت مالی کلینیک</h1>
          <p className="text-xs text-slate-500 mt-0.5">پایش هوشمند و تفکیک‌شده درآمدها، هزینه‌ها و تراز صندوق مالی کلینیک</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* دکمه‌های فیلتر بازه زمانی پویای درآمد */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {[
              { id: "today", label: "امروز" },
              { id: "weekly", label: "هفتگی" },
              { id: "four_months", label: "۴ ماهه" }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setTimeFilter(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeFilter === tab.id ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowExpenseModal(true)} 
            className="btn-primary py-2.5 px-4 shadow-md shadow-primary-100 rounded-xl text-xs font-bold shrink-0"
          >
            <Plus size={16} /> ثبت هزینه جدید
          </button>
        </div>
      </div>

      {/* ۱. ردیف اول: کارت‌های آمار مالی گسترده شده (SaaS Financial KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {/* درآمد */}
        <div className="card p-4 border border-slate-100 bg-white shadow-sm flex items-center gap-3 h-[95px]">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400">درآمد بازه انتخابی</p>
            <p className="text-base font-black text-emerald-600 mt-0.5">{fmt(kpis.revenue)} <span className="text-[9px] text-slate-400 font-bold">تومان</span></p>
          </div>
        </div>

        {/* هزینه */}
        <div className="card p-4 border border-slate-100 bg-white shadow-sm flex items-center gap-3 h-[95px]">
          <div className="p-2 bg-red-50 text-red-500 rounded-xl shrink-0">
            <TrendingDown size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400">هزینه‌ها در این بازه</p>
            <p className="text-base font-black text-red-500 mt-0.5">{fmt(kpis.expense)} <span className="text-[9px] text-slate-400 font-bold">تومان</span></p>
          </div>
        </div>

        {/* سود خالص */}
        <div className="card p-4 border border-slate-100 bg-white shadow-sm flex items-center gap-3 h-[95px]">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400">سود خالص تراز مالی</p>
            <p className="text-base font-black text-blue-600 mt-0.5">{fmt(kpis.net)} <span className="text-[9px] text-slate-400 font-bold">تومان</span></p>
          </div>
        </div>

        {/* درآمد میانگین هر بیمار */}
        <div className="card p-4 border border-slate-100 bg-white shadow-sm flex items-center gap-3 h-[95px]">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400">میانگین دریافتی هر بیمار</p>
            <p className="text-base font-black text-purple-600 mt-0.5">{fmt(kpis.averageTicket)} <span className="text-[9px] text-slate-400 font-bold">تومان</span></p>
          </div>
        </div>

        {/* مجموع هزینه رزرو */}
        <div className="card p-4 border border-slate-100 bg-white shadow-sm flex items-center gap-3 h-[95px]">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400">مجموع هزینه رزرو</p>
            <p className="text-base font-black text-amber-600 mt-0.5">{fmt(kpis.bookingCost)} <span className="text-[9px] text-slate-400 font-bold">تومان</span></p>
          </div>
        </div>

      </div>

      {/* ۲. ردیف دوم: نمودارهای مقایسه‌ای درآمد و سهم خدمات (Analytics Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* نمودار درآمد/هزینه/سود */}
        <div className="card lg:col-span-2 border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-700">ترازنامه دوره انتخابی</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">مقایسه هم‌زمان درآمد, هزینه‌ها و سود خالص کسب شده در مطب</p>
          </div>
          
          <div className="w-full h-[240px] mt-5">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={kpis.chartData.map(d => ({ ...d, net: d.income - d.expense }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Vazirmatn", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis 
                  tickFormatter={v => timeFilter === "four_months" ? `${v/1000000}M` : `${v/1000}K`} 
                  tick={{ fontSize: 11, fontFamily: "Vazirmatn", fill: "#94a3b8" }} 
                  axisLine={false} tickLine={false} 
                />
                <Tooltip formatter={v => [`${fmt(v)} تومان`, 'مبلغ']} contentStyle={{ fontFamily: "Vazirmatn", borderRadius: "12px", border: "1px solid #f1f5f9" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, fontFamily: "Vazirmatn", color: "#475569", fontWeight: "bold" }} />
                
                <Bar dataKey="income" name="درآمد" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="هزینه جاری" fill="#f87171" radius={[4, 4, 0, 0]} />
                <Bar dataKey="net" name="سود خالص" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* نمودار سهم خدمات از درآمد با راهنمای راست‌چین و فیکس بدون اسکرول (۴ خدمت برتر + سایر) */}
        <div className="card border-slate-100 shadow-sm flex flex-col justify-between p-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <ArrowUpRight size={16} className="text-primary-600" /> سهم درآمدی کل خدمات فاکتور شده
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">محاسبه‌ی پویا بر اساس کل خدمات ارائه شده</p>
          </div>

          <div className="flex-1 flex flex-col justify-center min-h-[220px] mt-2">
            {/* چارت دونات */}
            <div className="w-full h-32 shrink-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie data={serviceShareData} cx="50%" cy="50%" innerRadius={35} outerRadius={52} paddingAngle={4} dataKey="value">
                    {serviceShareData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={v => [`${v}٪`, 'سهم']} contentStyle={{ fontFamily: "Vazirmatn", borderRadius: "12px", border: "1px solid #f1f5f9" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* ⚡ راهنمای بدون اسکرول: حداکثر ۵ سطر (۴ خدمت برتر + سایر) در کمال آراستگی تراز شده است */}
            <div className="space-y-2 mt-4 px-1">
              {serviceShareData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] font-bold text-slate-600 transition-colors hover:bg-slate-50 p-1 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate max-w-[130px]">{item.name}</span>
                  </div>
                  <span className="text-slate-400 font-extrabold">% {fmt(item.value)}</span>
                </div>
              ))}
              {serviceShareData.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center">هیچ خدمتی ثبت نشده است</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ۳. ردیف سوم: دو جدول موازی درآمد صندوق و هزینه‌های جاری مطب با فونت‌های تراز شده زیبا */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* جدول اول: دریافتی‌های صندوق و درآمدها */}
        <div className="card border-slate-100 shadow-sm overflow-hidden !p-0">
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">لیست تراکنش‌های دریافتی صندوق (درآمدها)</h3>
            <p className="text-[10px] text-slate-400 mt-1">تراکنش‌های اخیر واریز مراجعان بابت ویزیت و نسخ</p>
          </div>
          <div className="table-container border-none rounded-none overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 text-right">نام بیمار</th>
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 text-right">نوع خدمت</th>
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">مبلغ دریافتی</th>
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {kpis.incomes.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-5 py-3 text-right text-xs font-bold text-slate-800">{tx.patient}</td>
                    <td className="px-5 py-3 text-right text-xs text-slate-500 font-medium">{tx.service}</td>
                    {/* فوند شکیل فارسی بدون فونت‌مونو برای اعداد و مبالغ */}
                    <td className="px-5 py-3 text-center text-xs font-black text-emerald-600 font-sans">{fmt(tx.amount)} تومان</td>
                    <td className="px-5 py-3 text-center align-middle text-xs font-bold text-slate-400 font-sans">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* جدول دوم: لیست هزینه‌های جاری مطب */}
        <div className="card border-slate-100 shadow-sm overflow-hidden !p-0">
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">دفترچه ثبت هزینه‌های جاری مطب</h3>
            <p className="text-[10px] text-slate-400 mt-1">لیست پرداختی‌های ثبت شده بابت قبوض، اجاره، تجهیزات و حقوق پرسنل</p>
          </div>
          <div className="table-container border-none rounded-none overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 text-right">عنوان هزینه</th>
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 text-right">دسته‌بندی</th>
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">مبلغ پرداختی</th>
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 text-center">تاریخ ثبت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {kpis.expenses.map((exp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-5 py-3 text-right text-xs font-bold text-slate-800">{exp.title}</td>
                    <td className="px-5 py-3 text-right text-[10px] text-slate-500">
                      <span className="badge badge-gray">{exp.category}</span>
                    </td>
                    <td className="px-5 py-3 text-center text-xs font-black text-red-500 font-sans">{fmt(exp.amount)} تومان</td>
                    <td className="px-5 py-3 text-center text-xs text-slate-500 font-sans font-bold">{exp.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 🔹 ۴. مودال وسط صفحه ثبت هزینه جاری جدید (Add Expense Center Modal) */}
      {showExpenseModal && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setShowExpenseModal(false)}>
          <div className="modal-content max-w-md h-fit border border-slate-100" onClick={e => e.stopPropagation()}>
            
            {/* هدر مودال */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingDown size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">ثبت هزینه جاری جدید</h3>
                  <p className="text-[10px] text-slate-400 mt-1">اطلاعات هزینه‌های پرداختی مطب را ثبت نمایید</p>
                </div>
              </div>
              <button onClick={() => setShowExpenseModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 transition-colors"><X size={18} /></button>
            </div>

            {/* بدنه فرم مودال */}
            <form onSubmit={handleAddExpenseSubmit} className="p-6 space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-500 mb-1.5">عنوان هزینه <span className="text-red-500">*</span></label>
                <input 
                  className="input focus:ring-red-500" 
                  value={expenseForm.title} 
                  onChange={e => setExpenseForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="مثال: خرید الکل و تجهیزات پانسمان" 
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 mb-1.5">مبلغ پرداختی (تومان) <span className="text-red-500">*</span></label>
                  <input 
                    type="number"
                    min="0"
                    className="input focus:ring-red-500 ltr text-left" 
                    value={expenseForm.amount} 
                    onChange={e => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="مثال: ۲۸۵۰۰۰" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1.5">دسته‌بندی هزینه</label>
                  <select 
                    className="input focus:ring-red-500 bg-white"
                    value={expenseForm.category}
                    onChange={e => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option>مواد مصرفی</option>
                    <option>اجاره مطب</option>
                    <option>قبوض</option>
                    <option>حقوق پرسنل</option>
                    <option>تجهیزات</option>
                    <option>سایر</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1.5">تاریخ پرداخت</label>
                <DatePicker
                  value={expenseForm.date}
                  onChange={date => setExpenseForm(prev => ({ ...prev, date }))}
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  containerClassName="w-full"
                  inputClass="input text-center h-11 focus:ring-red-500 cursor-pointer font-bold font-mono"
                />
              </div>

              {/* دکمه‌های تایید */}
              <div className="pt-3 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowExpenseModal(false)}
                  className="btn-secondary flex-1 justify-center rounded-xl h-11"
                >
                  انصراف
                </button>
                <button 
                  type="submit" 
                  disabled={savingExpense}
                  className="btn-primary flex-1 justify-center rounded-xl bg-red-600 hover:bg-red-700 h-11 shadow-lg shadow-red-100"
                >
                  {savingExpense ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  ثبت نهایی هزینه
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
