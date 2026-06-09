import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Building2, PackageCheck, CreditCard,
  Settings, LogOut, Bell,
} from "lucide-react";

const MENU = [
  { label: "داشبورد کلان", icon: LayoutDashboard, to: "/platform/dashboard" },
  { label: "مدیریت کلینیک‌ها", icon: Building2, to: "/platform/clinics" },
  { label: "بسته‌های اشتراک", icon: PackageCheck, to: "/platform/plans" },
  { label: "گزارش‌های مالی", icon: CreditCard, to: "/platform/financials" },
  { label: "تنظیمات سیستم", icon: Settings, to: "/platform/settings" },
];

export default function PlatformLayout() {
  const navigate = useNavigate();
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : {};
  const displayName = user.name || "مدیر پلتفرم";
  const avatarChar = displayName.charAt(0);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-surface flex" dir="rtl">
      {/* ── Sidebar ── */}
      <aside
        className="fixed right-0 top-0 h-screen bg-white border-l border-surface-border flex flex-col z-30"
        style={{ width: "var(--sidebar-w)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-surface-border">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SN</span>
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm leading-none">اسمارت‌نوبت</p>
            <p className="text-[10px] text-slate-400 mt-0.5">پنل مدیریت پلتفرم</p>
          </div>
        </div>

        {/* User chip */}
        <div className="mx-3 mt-3 px-4 py-3 bg-surface-muted rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
              {avatarChar}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
              <p className="text-[11px] text-slate-500">مدیر پلتفرم</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link${isActive ? " active" : ""}`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-surface-border">
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            خروج از حساب
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col" style={{ marginRight: "var(--sidebar-w)" }}>
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-surface-border flex items-center justify-between px-6 sticky top-0 z-20">
          <div />
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-surface-muted text-slate-500">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
              {avatarChar}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
