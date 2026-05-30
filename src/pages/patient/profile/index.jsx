import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useProfile } from './hooks/useProfile';
import { TABS } from './constants/options';
import ProfileSidebar from './components/ProfileSidebar';
import PersonalInfoForm from './components/PersonalInfoForm';
import InsuranceForm from './components/InsuranceForm';

const Profile = () => {
  const [activeTab, setActiveTab] = useState(TABS.PERSONAL);
  
  const { 
    userData, 
    setUserData, 
    stats, 
    loading, 
    saving, 
    saveProfile
  } = useProfile();

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await saveProfile(userData);
    alert(result.message);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin text-brand" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 px-4 md:px-0" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <ProfileSidebar 
          userData={userData}
          stats={stats}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-brand-light min-h-[500px] relative pb-24">
            
            {activeTab === TABS.PERSONAL && (
              <PersonalInfoForm 
                userData={userData} 
                setUserData={setUserData} 
              />
            )}

            {activeTab === TABS.INSURANCE && (
              <InsuranceForm 
                userData={userData} 
                setUserData={setUserData} 
              />
            )}

            {/* Save Button */}
            <div className="absolute bottom-8 left-8">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-brand text-white px-8 py-3 rounded-xl font-bold shadow-xl shadow-brand/20 hover:bg-brand-dark transition-all flex items-center gap-2 active:scale-95"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    ذخیره تغییرات
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;