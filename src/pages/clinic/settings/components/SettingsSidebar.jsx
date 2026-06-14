import React from 'react';
import { MapPin, Clock, Shield } from 'lucide-react';
import { TABS } from '../constants/defaultValues';

const menuItems = [
  { id: TABS.GENERAL, label: 'اطلاعات مطب', icon: MapPin },
  { id: TABS.HOURS, label: 'ساعات کاری', icon: Clock },
  { id: TABS.SECURITY, label: 'امنیت و پیامک', icon: Shield },
];

const SettingsSidebar = ({ activeTab, onTabChange }) => {
  return (
    <div className="md:col-span-1 space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button 
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full text-right p-4 rounded-xl font-bold flex items-center gap-3 transition-all ${
              isActive 
                ? 'bg-white text-brand shadow-md border border-gray-100' 
                : 'text-gray-500 hover:bg-white/50'
            }`}
          >
            <Icon size={20} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default SettingsSidebar;