import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, UserCog, Calendar, Users, MessageSquare, Settings, LogOut, Menu, Stethoscope, Wallet, Bell, X 
} from 'lucide-react';

export default function ClinicAdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getAdminInfo = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        return {
          name: parsed.name || parsed.fullName || 'مدیر مطب',
          initial: (parsed.name || parsed.fullName || 'A').charAt(0).toUpperCase()
        };
      } catch {
        return { name: 'مدیر مطب', initial: 'A' };
      }
    }
    return { name: 'مدیر مطب', initial: 'A' };
  };

  const adminInfo = getAdminInfo();

  const todayWeekday = new Date().toLocaleDateString('fa-IR', {
    weekday: 'long',
  });

  const todayDate = new Date().toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // منوی اختصاصی و ثابت برای مدیر مطب بدون تداخل با بقیه نقش‌ها
  const menuItems = [
    { title: 'داشبورد', icon: LayoutGrid, path: '/clinic/dashboard' },
    { title: 'مدیریت نوبت‌ها', icon: Calendar, path: '/clinic/appointments' },
    { title: 'لیست بیماران', icon: Users, path: '/clinic/patients' },
    { title: 'امور مالی', icon: Wallet, path: '/clinic/finance' },
    { title: 'مدیریت پرسنل', icon: UserCog, path: '/clinic/staff' },
    { title: 'تنظیمات مطب', icon: Settings, path: '/clinic/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface flex text-right" dir="rtl">
      
      {/* ── Sidebar (مخصوص مدیر مطب) ── */}
      <aside 
        className={`
          fixed right-0 top-0 h-screen bg-white border-l border-surface-border flex flex-col z-30 transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
        style={{ width: "var(--sidebar-w)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-surface-border">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
            <Stethoscope size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm leading-none">اسمارت‌نوبت</p>
            <p className="text-[10px] text-slate-400 mt-0.5">سیستم یکپارچه مدیریت مطب</p>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden mr-auto p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X size={16} />
          </button>
        </div>

        {/* User Chip */}
        <div className="mx-3 mt-3 px-4 py-3 bg-surface-muted rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
              {adminInfo.initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{adminInfo.name}</p>
              <p className="text-[11px] text-slate-500 font-medium">مدیر مطب</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`sidebar-link w-full text-right ${isActive ? "active font-bold" : ""}`}
              >
                <IconComponent size={18} />
                {item.title}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-surface-border">
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600 font-bold"
          >
            <LogOut size={18} />
            خروج از حساب
          </button>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden" style={{ marginRight: "var(--sidebar-w)" }}>
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-surface-border flex items-center justify-between px-6 sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl hover:bg-surface-muted text-slate-500 md:hidden transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xs font-black text-slate-400 hidden sm:block">
              امروز: <span className="text-slate-600 font-bold mr-1">{todayWeekday} {todayDate}</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-surface-muted text-slate-500 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm shadow-sm">
                {adminInfo.initial}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-surface custom-scrollbar">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
