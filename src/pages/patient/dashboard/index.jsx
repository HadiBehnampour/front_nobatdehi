import React from 'react';
import { Loader2 } from 'lucide-react';
import usePatientDashboard from './hooks/usePatientDashboard';
import WelcomeHeader from './components/WelcomeHeader';
import LastVisitCard from './components/LastVisitCard';
import UpcomingAppointments from './components/UpcomingAppointments';
import RecentRecords from './components/RecentRecords';

const PatientDashboard = () => {
  const { loading, data, navigate } = usePatientDashboard();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin text-brand" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10 text-right font-sans px-4 md:px-0" dir="rtl">

      <WelcomeHeader patientName={data.patientName} navigate={navigate} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* بخش اصلی: گزارش آخرین ویزیت */}
        <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">
          <LastVisitCard lastVisit={data.lastVisit} />
        </div>

        {/* سایدبار: نوبت‌ها و سوابق */}
        <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
          <UpcomingAppointments appointments={data.upcomingAppointments} />
          <RecentRecords records={data.recordsSummary} navigate={navigate} />
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;