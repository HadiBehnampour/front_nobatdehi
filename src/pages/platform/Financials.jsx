import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import Badge from "../../components/ui/Badge";
import StatCard from "../../components/ui/StatCard";
import { DollarSign, Building2, Users, ArrowUpRight } from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);

// داده‌های درآمد ماهیانه پلتفرم (خطی)
const REVENUE_DATA = [
  { month: "فروردین", revenue: 4200000 },
  { month: "اردیبهشت", revenue: 5100000 },
  { month: "خرداد", revenue: 5900000 },
  { month: "تیر", revenue: 6200000 },
  { month: "مرداد", revenue: 7800000 },
  { month: "شهریور", revenue: 8400000 },
  { month: "مهر", revenue: 9100000 },
  { month: "آبان", revenue: 10300000 },
];

const PLAN_SHARE_DATA = [
  { name: "پیشرفته (VIP)", value: 45, color: "#f59e0b" },
  { name: "استاندارد", value: 38, color: "#3b82f6" },
  { name: "اقتصادی", value: 17, color: "#94a3b8" },
];

const TRANSACTIONS_PLATFORM = [
  { id: "tx-001", refId: "IR-8834992", clinic: "کلینیک دکتر اکبری", type: "تمدید اشتراک", plan: "استاندارد", amount: 980000, status: "success", date: "۱۴۰۳/۰۸/۱۸" },
  { id: "tx-002", refId: "IR-8834100", clinic: "دندان‌پزشکی شفا", type: "خرید اشتراک جدید", plan: "آزمایشی", amount: 0, status: "success", date: "۱۴۰۳/۰۸/۱۵" },
  { id: "tx-003", refId: "IR-8799034", clinic: "کلینیک قلب صابری", type: "تمدید اشتراک", plan: "پیشرفته (VIP)", amount: 2450000, status: "success", date: "۱۴۰۳/۰۸/۱۰" },
  { id: "tx-004", refId: "IR-8790021", clinic: "مطب پوست دکتر یزدی", type: "تمدید اشتراک", plan: "اقتصادی", amount: 350000, status: "failed", date: "۱۴۰۳/۰۷/۳۰" },
  { id: "tx-005", refId: "IR-8765000", clinic: "کلینیک دکتر اکبری", type: "بسته پیامک افزایشی", plan: "—", amount: 150000, status: "success", date: "۱۴۰۳/۰۸/۰۵" },
];

export default function PlatformFinancials() {
  return (
    <div className="space-y-5 fade-in" dir="rtl">
      
      {/* هدر صفحه (طبق پروژه نمونه) */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">گزارش مالی پلتفرم</h1>
      </div>

      {/* کارت‌های آمار اصلی (KPI) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          icon={<DollarSign size={22} className="text-primary-600" />} 
          iconBg="bg-primary-50"
          label="درآمد این ماه" 
          value="۱۰,۳۰۰,۰۰۰ تومان" 
          sub="۲۳٪ رشد نسبت به ماه قبل" 
          trend={1} 
        />
        <StatCard 
          icon={<Building2 size={22} className="text-emerald-600" />} 
          iconBg="bg-emerald-50"
          label="مطب‌های جدید این ماه" 
          value="۱۲ کلینیک" 
          sub="ثبت‌نام‌های موفق در ۳۰ روز گذشته" 
        />
        <StatCard 
          icon={<Users size={22} className="text-purple-600" />} 
          iconBg="bg-purple-50"
          label="کلینیک‌های فعال" 
          value="۳ کلینیک" 
          sub="از مجموع ۴ کلینیک کل پلتفرم" 
        />
      </div>

      {/* نمودارهای تحلیلی */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        
        {/* نمودار خطی درآمد ماهیانه */}
        <div className="card xl:col-span-2 border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">نمودار روند درآمد ماهیانه</h3>
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Vazirmatn", fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis 
                  tickFormatter={v => `${v/1000000}M`} 
                  tick={{ fontSize: 11, fontFamily: "Vazirmatn", fill: "#94a3b8" }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip formatter={v => [`${fmt(v)} تومان`, 'درآمد']} contentStyle={{ fontFamily: "Vazirmatn", borderRadius: "12px", border: "1px solid #f1f5f9" }} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* نمودار دایره‌ای کامل سهم بسته‌ها */}
        <div className="card border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <ArrowUpRight size={16} className="text-primary-600" /> سهم پکیج‌ها از درآمد
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[220px]">
            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {/* دایره کامل بدون سوراخ وسط با حذف innerRadius */}
                  <Pie data={PLAN_SHARE_DATA} cx="50%" cy="50%" outerRadius={65} dataKey="value">
                    {PLAN_SHARE_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={v => [`${v}٪`, 'سهم']} contentStyle={{ fontFamily: "Vazirmatn", borderRadius: "12px", border: "1px solid #f1f5f9" }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "Vazirmatn", color: "#64748b" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* جدول تراکنش‌ها */}
      <div className="card border-slate-100 shadow-sm overflow-hidden !p-0">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">لیست تراکنش‌های خرید اشتراک</h3>
        </div>
        
        <div className="table-container border-none rounded-none overflow-x-auto">
          <table className="w-full text-right border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right">کد رهگیری</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right">کلینیک</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 text-right">نوع تراکنش</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 text-center">پکیج</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 text-left">مبلغ</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 text-center">وضعیت</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 text-center">تاریخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TRANSACTIONS_PLATFORM.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-400 text-right">{tx.refId}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 text-right text-sm">{tx.clinic}</td>
                  <td className="px-6 py-4 text-slate-500 text-right text-sm font-medium">{tx.type}</td>
                  <td className="px-6 py-4 text-center align-middle text-xs font-bold text-slate-700">
                    {tx.plan}
                  </td>
                  <td className="px-6 py-4 text-left align-middle font-bold text-slate-700 text-sm">
                    {tx.amount ? `${fmt(tx.amount)} تومان` : "رایگان"}
                  </td>
                  <td className="px-6 py-4 text-center align-middle">
                    <div className="flex justify-center">
                      <Badge status={tx.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center align-middle text-xs font-bold text-slate-400">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
