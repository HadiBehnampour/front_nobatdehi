export default function Badge({ status, children, className = "" }) {
  const map = {
    active: "badge-green",
    trial: "badge-yellow",
    expired: "badge-red",
    suspended: "badge-red",
    success: "badge-green",
    failed: "badge-red",
    pending: "badge-yellow",
    completed: "badge-green",
    in_consultation: "badge-blue",
    waiting: "badge-yellow",
    scheduled: "badge-gray",
    no_show: "badge-red",
    vip: "badge badge-blue",
  };
  const label = {
    active: "فعال", trial: "آزمایشی", expired: "منقضی", suspended: "تعلیق",
    success: "موفق", failed: "ناموفق", pending: "در انتظار",
    completed: "ویزیت شد", in_consultation: "داخل اتاق",
    waiting: "منتظر", scheduled: "برنامه‌ریزی‌شده", no_show: "غایب",
  };
  return (
    <span className={`badge ${map[status] || "badge-gray"} ${className}`}>
      {children ?? label[status] ?? status}
    </span>
  );
}
