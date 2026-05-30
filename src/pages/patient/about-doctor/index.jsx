import { Loader2 } from 'lucide-react';
import { useDoctorInfo } from './hooks/useDoctorInfo';
import DoctorHero from './components/DoctorHero';
import ContactCard from './components/ContactCard';
import WorkingHoursCard from './components/WorkingHoursCard';
import MapSection from './components/MapSection';

const AboutDoctor = () => {
  const { info, loading } = useDoctorInfo();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin text-brand" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 px-4 md:px-0">
      
      <DoctorHero info={info} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ContactCard type="address" info={info} />
        <ContactCard type="phone" info={info} />
        <WorkingHoursCard workingHours={info.workingHours} />
      </div>

      {/* فقط نقشه - تمام عرض */}
      <MapSection embedUrl={info.mapEmbedUrl} address={info.address} />

    </div>
  );
};

export default AboutDoctor;