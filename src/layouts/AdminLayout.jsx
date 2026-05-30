import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  Stethoscope,
  Wallet
} from 'lucide-react';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getAdminInfo = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        return {
          name: parsed.name || parsed.fullName || 'مدیر سیستم',
          initial: (parsed.name || parsed.fullName || 'A').charAt(0).toUpperCase()
        };
      } catch {
        return { name: 'مدیر سیستم', initial: 'A' };
      }
    }
    return { name: 'مدیر سیستم', initial: 'A' };
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

  const menuItems = [
    { title: 'داشبورد', icon: <LayoutGrid size={20} />, path: '/admin/dashboard' },
    { title: 'مدیریت نوبت‌ها', icon: <Calendar size={20} />, path: '/admin/appointments' },
    { title: 'لیست بیماران', icon: <Users size={20} />, path: '/admin/patients' },
    { title: 'مشاوره‌ها', icon: <MessageSquare size={20} />, path: '/admin/consults' },
    { title: 'امور مالی', icon: <Wallet size={20} />, path: '/admin/finance' },
    { title: 'تنظیمات مطب', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex relative text-right" dir="rtl">
      
      {/* 1. SIDEBAR */}
      <aside 
        className={`
          fixed inset-y-0 right-0 z-40 w-72 bg-brand-dark text-white shadow-2xl transition-transform duration-300 ease-in-out
          md:translate-x-0 md:relative md:flex md:flex-col
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="h-24 flex items-center justify-center border-b border-white/10 bg-black/10 shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-brand-light backdrop-blur-sm">
              <Stethoscope size={22} />
            </span>
            پنل مدیریت
          </h2>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium group ${
                  isActive 
                    ? 'bg-white text-brand-dark shadow-lg' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-brand-dark' : 'text-gray-400 group-hover:text-white'}>
                  {item.icon}
                </span>
                {item.title}
              </button>
            );
          })}
        </nav>

        <div className="w-full p-4 border-t border-white/10 bg-black/10 shrink-0">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-300 hover:bg-white/5 hover:text-red-200 px-4 py-3 rounded-xl transition-colors text-sm font-bold"
          >
            <LogOut size={18} />
            خروج از سیستم
          </button>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 bg-gray-50 rounded-lg text-gray-500 md:hidden hover:text-brand"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold text-gray-700 hidden sm:block">
              امروز: <span className="text-gray-900">{todayWeekday} {todayDate}</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* ✅ فقط اطلاعات ادمین بدون زنگوله */}
            <div className="flex items-center gap-3">
                <div className="text-left hidden md:block">
                    <span className="block text-sm font-bold text-gray-800">{adminInfo.name}</span>
                    <span className="block text-xs text-brand">مدیر سیستم</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {adminInfo.initial}
                </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-gray-50">
          <Outlet />
        </div>

      </main>
    </div>
  );
};

export default AdminLayout;
