import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, CalendarCheck, MessageSquare, User, 
  LogOut, Menu, MessageCircle, Info, 
  Activity, Lock, LogIn 
} from 'lucide-react';
import defaultAvatar from '../assets/images/default-avatar.jpg';

const PatientLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem('access'));
    };
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const isGuest = !isLoggedIn;

  const getUserName = () => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        return parsed.name || parsed.fullName || 'کاربر گرامی';
      } catch {
        return 'کاربر گرامی';
      }
    }
    return 'کاربر گرامی';
  };

  const menuItems = [
    { title: 'داشبورد', icon: <LayoutDashboard size={20} />, path: '/patient/dashboard', onlyForUsers: true },
    { title: 'نوبت‌دهی آنلاین', icon: <CalendarCheck size={20} />, path: '/patient/appointments', onlyForUsers: false },
    { title: 'سلامت من (سوابق)', icon: <Activity size={20} />, path: '/patient/records', onlyForUsers: true }, 
    { title: 'مشاوره پزشکی', icon: <MessageSquare size={20} />, path: '/patient/consult', onlyForUsers: true },
    { title: 'نظرسنجی', icon: <MessageCircle size={20} />, path: '/patient/survey', onlyForUsers: true },
    { title: 'درباره پزشک', icon: <Info size={20} />, path: '/patient/about', onlyForUsers: false },
    { title: 'پروفایل من', icon: <User size={20} />, path: '/patient/profile', onlyForUsers: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  return (
    <div className="h-screen overflow-hidden bg-brand-light flex relative text-right font-sans" dir="rtl">
      
      {/* 1. SIDEBAR */}
      <aside className={`
          fixed inset-y-0 right-0 z-40 w-72 bg-white/80 backdrop-blur-xl border-l border-white/50 shadow-2xl transition-transform duration-300 ease-in-out
          md:translate-x-0 md:relative md:flex md:flex-col md:shadow-none
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
        <div className="h-24 flex items-center justify-center border-b border-brand-light/50 shrink-0">
          <h2 className="text-xl font-black text-brand-text flex items-center gap-2">
            <span className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white">
              <User size={18} />
            </span>
            {isGuest ? 'دسترسی محدود' : 'پنل کاربری'}
          </h2>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isDisabled = isGuest && item.onlyForUsers;

            return (
              <button
                key={item.path}
                disabled={isDisabled}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium relative ${
                  isActive 
                    ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                    : isDisabled 
                      ? 'opacity-40 cursor-not-allowed grayscale' 
                      : 'text-gray-500 hover:bg-brand-light hover:text-brand'
                }`}
              >
                <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-brand'}>
                      {item.icon}
                    </span>
                    {item.title}
                </div>
                {isDisabled && <Lock size={14} className="text-gray-400" />}
              </button>
            );
          })}
        </nav>

        <div className="w-full p-4 border-t border-brand-light/50 shrink-0">
          {isGuest ? (
            <button 
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-2 bg-brand text-white px-4 py-3 rounded-xl transition-colors text-sm font-bold shadow-lg shadow-brand/20"
            >
              <LogIn size={18} />
              ورود / ثبت‌نام
            </button>
          ) : (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl transition-colors text-sm font-bold"
            >
              <LogOut size={18} />
              خروج از حساب
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        
        {/* Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-white flex items-center justify-between px-6 md:px-10 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 bg-white rounded-lg shadow-sm text-gray-500 md:hidden hover:text-brand"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold text-gray-700 hidden sm:block">
              {isGuest ? (
                  <span>به کلینیک <span className="text-brand">خوش آمدید</span></span>
              ) : (
                  <span>خوش آمدید، <span className="text-brand">{getUserName()}</span></span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* ✅ آواتار لوکال بدون وابستگی خارجی */}
            <div 
                onClick={() => !isGuest && navigate('/patient/profile')} 
                className={`w-10 h-10 rounded-full bg-brand-light border-2 border-white shadow-sm overflow-hidden transition-all ${isGuest ? 'cursor-default grayscale' : 'cursor-pointer hover:ring-2 hover:ring-brand'}`}
            >
              <img 
                src={defaultAvatar}
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            {isGuest && location.pathname !== '/patient/appointments' && location.pathname !== '/patient/about' && !location.pathname.startsWith('/patient/appointments') ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in">
                    <div className="w-24 h-24 bg-brand-light rounded-full flex items-center justify-center text-brand">
                        <Lock size={48} />
                    </div>
                    <div className="max-w-md">
                        <h2 className="text-2xl font-black text-gray-800">این بخش نیاز به ورود دارد</h2>
                        <p className="text-gray-500 mt-2">برای دسترسی به سوابق، داشبورد و مشاوره، لطفا ابتدا وارد حساب کاربری خود شوید.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-brand text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-brand/20 hover:scale-105 transition-transform"
                    >
                        ورود یا ثبت‌نام سریع
                    </button>
                    <button 
                        onClick={() => navigate('/patient/appointments')}
                        className="text-brand font-bold text-sm underline"
                    >
                        بازگشت به صفحه نوبت‌دهی
                    </button>
                </div>
            ) : (
                <Outlet /> 
            )}
        </div>

      </main>
    </div>
  );
};

export default PatientLayout;
