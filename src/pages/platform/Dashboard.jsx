import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Building2, TrendingUp, Users, Calendar, Activity, ArrowUpRight, Loader2 } from "lucide-react";
import StatCard from "../../components/ui/StatCard";
import apiClient from "../../api/core";

const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);

export default function PlatformDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    apiClient.get("/platform/dashboard/")
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  const kpi = data?.kpi || {};
  const charts = data?.charts || {};
  const activityLog = data?.activity_log || [];

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800">داشبورد کلان</h1>
        <p className="text-sm text-slate-500 mt-0.5">خلاصه وضعیت پلتفرم اسمارت‌نوبت</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<TrendingUp size={22} className="text-primary-600" />}
          iconBg="bg-primary-50"
          label="درآمد ماهانه (MRR)"
          value={`${fmt(kpi.mrr?.value || 0)} ت`}
          sub={kpi.mrr?.note}
          trend={1}
        />
        <StatCard
          icon={<Building2 size={22} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          label="کلینیک‌های فعال"
          value={`${kpi.clinics?.active || 0} / ${kpi.clinics?.total || 0}`}
          sub={`${kpi.clinics?.trial || 0} آزمایشی · ${kpi.clinics?.expired || 0} تعلیق`}
        />
        <StatCard
          icon={<Users size={22} className="text-purple-600" />}
          iconBg="bg-purple-50"
          label="نرخ ریزش (Churn)"
          value={kpi.churn?.value || "۰٪"}
          sub={kpi.churn?.note}
          trend={1}
        />
        <StatCard
          icon={<Calendar size={22} className="text-amber-600" />}
          iconBg="bg-amber-50"
          label="نوبت‌های ۲۴ ساعت اخیر"
          value={fmt(kpi.traffic_24h || 0)}
          sub="در کل پلتفرم"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* MRR Line Chart */}
        <div className="card xl:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-600" /> رشد درآمد ماهانه (تومان)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={charts.mrr || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Vazirmatn" }} />
              <YAxis tickFormatter={(v) => `${v / 1000000}M`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${fmt(v)} ت`, "MRR"]} labelStyle={{ fontFamily: "Vazirmatn" }} />
              <Line type="monotone" dataKey="mrr" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: "#2563eb" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <ArrowUpRight size={16} className="text-primary-600" /> سهم پکیج‌ها
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={charts.plan_share || []} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value">
                {(charts.plan_share || []).map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}٪`, ""]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, fontFamily: "Vazirmatn" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* New clinics chart */}
        <div className="card xl:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">ثبت‌نام کلینیک‌های جدید (ماهانه)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={charts.new_clinics || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Vazirmatn" }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip labelStyle={{ fontFamily: "Vazirmatn" }} />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Activity log */}
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Activity size={16} className="text-primary-600" />
            فید زنده فعالیت‌ها
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot mr-auto" />
          </h3>
          <div className="space-y-3">
            {activityLog.map((log) => {
              const colors = {
                emerald: "bg-emerald-100 text-emerald-600",
                blue: "bg-blue-100 text-blue-600",
                red: "bg-red-100 text-red-600",
                purple: "bg-purple-100 text-purple-600",
              };
              return (
                <div key={log.id} className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[log.color] || colors.blue}`}>
                    <Activity size={12} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-700 leading-relaxed">{log.text}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{log.time}</p>
                  </div>
                </div>
              );
            })}
            {activityLog.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">فعالیتی ثبت نشده</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
