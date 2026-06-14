import React from 'react';
import { Loader2 } from 'lucide-react';

// Components
import SettingsHeader from './components/SettingsHeader';
import SettingsSidebar from './components/SettingsSidebar';
import GeneralSettings from './components/GeneralSettings';
import WorkingHoursSettings from './components/WorkingHoursSettings';
import SecuritySettings from './components/SecuritySettings';

// Hooks & Constants
import { useSettings } from './hooks/useSettings';
import { TABS } from './constants/defaultValues';

const AdminSettings = () => {
  const {
    loading,
    saving,
    activeTab,
    generalInfo,
    schedule,
    security,
    setActiveTab,
    handleSave,
    toggleDay,
    updateTime,
    updateGeneralInfo,
    updateSecurity
  } = useSettings();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin text-brand" size={40}/>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GENERAL:
        return (
          <GeneralSettings 
            generalInfo={generalInfo} 
            onUpdate={updateGeneralInfo} 
          />
        );
      case TABS.HOURS:
        return (
          <WorkingHoursSettings 
            schedule={schedule} 
            onToggleDay={toggleDay}
            onUpdateTime={updateTime}
          />
        );
      case TABS.SECURITY:
        return (
          <SecuritySettings 
            security={security} 
            onUpdate={updateSecurity} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20 text-right" 
      dir="rtl"
    >
      <SettingsHeader saving={saving} onSave={handleSave} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SettingsSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        <div className="md:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;