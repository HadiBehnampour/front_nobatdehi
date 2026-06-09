export default function StatCard({ icon, iconBg, label, value, sub, trend }) {
  const isPos = trend > 0;
  return (
    <div className="stat-card fade-in">
      <div className={`stat-icon ${iconBg}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        {(sub || trend !== undefined) && (
          <p className={`text-xs mt-1 ${isPos ? "text-emerald-600" : trend < 0 ? "text-red-500" : "text-slate-400"}`}>
            {trend !== undefined ? (isPos ? "▲" : trend < 0 ? "▼" : "") : ""} {sub}
          </p>
        )}
      </div>
    </div>
  );
}
