import { User, CreditCard } from 'lucide-react';
import { TABS } from '../constants/options';
import defaultAvatar from '../../../../assets/images/default-avatar.jpg';

const ProfileSidebar = ({ userData, stats, activeTab, setActiveTab }) => {
  const menuItems = [
    { key: TABS.PERSONAL, icon: User, label: 'اطلاعات فردی و پزشکی' },
    { key: TABS.INSURANCE, icon: CreditCard, label: 'اطلاعات بیمه' },
  ];

  return (
    <div className="lg:col-span-4 space-y-6">
      {/* Card Info */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-brand-light flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 w-full h-24 bg-gradient-to-r from-brand to-brand-dark" />
        
        {/* Avatar - بدون دکمه آپلود */}
        <div className="relative mt-8 mb-4">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
            <img 
              src={defaultAvatar} 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800">{userData.fullName}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1 mb-6">
          <span>{userData.mobile}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span>{userData.birthDate}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full border-t border-gray-50 pt-6">
          <div>
            <span className="block text-2xl font-black text-brand">{stats.totalAppointments}</span>
            <span className="text-xs text-gray-400">نوبت‌های دریافت شده</span>
          </div>
          <div>
            <span className="block text-2xl font-black text-brand">{stats.cancelledAppointments}</span>
            <span className="text-xs text-gray-400">نوبت‌های کنسل شده</span>
          </div>
        </div>
      </div>

      {/* Menu Tabs */}
      <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-brand-light flex flex-col gap-2">
        {menuItems.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
              activeTab === key 
                ? 'bg-brand text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileSidebar;
