import React from 'react';
import { Loader2 } from 'lucide-react';
import useDashboard from './hooks/useDashboard';
import StatsCards from './components/StatsCards';
import GrowthChart from './components/GrowthChart';
import QuickActions from './components/QuickActions';
import RecentConsults from './components/RecentConsults';
import TodaysAppointments from './components/TodaysAppointments';

const AdminDashboard = () => {
  const { loading, data, navigate } = useDashboard();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-400 gap-4">
        <Loader2 size={50} className="animate-spin text-brand" />
        <p className="font-bold text-lg">در حال تحلیل داده‌های کلینیک...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 text-right pb-10" dir="rtl">

      <StatsCards stats={data.stats} navigate={navigate} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <GrowthChart chartData={data.growthChart} navigate={navigate} />

        <div className="space-y-6">
          <QuickActions navigate={navigate} />
          <RecentConsults consults={data.recentConsults} navigate={navigate} />
        </div>
      </div>

      <TodaysAppointments appointments={data.todaysAppointments} navigate={navigate} />
    </div>
  );
};

export default AdminDashboard;