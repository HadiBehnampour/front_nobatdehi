import { Stethoscope, GraduationCap, Award } from 'lucide-react';

const ICON_MAP = {
  graduation: GraduationCap,
  award: Award
};

const DoctorHero = ({ info }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-brand-light relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-brand-light/30 to-transparent" />
      
      {/* Doctor Image - از STATIC */}
      <div className="relative shrink-0">
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-white shadow-xl overflow-hidden relative z-10 bg-brand-light">
          <img 
            src={info.image} 
            alt={info.doctorName} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-brand rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg z-20">
          <Stethoscope size={32} />
        </div>
      </div>

      {/* Text Content */}
      <div className="flex-1 text-center md:text-right relative z-10">
        {/* از API */}
        <h1 className="text-3xl font-black text-gray-800 mb-2">
          {info.doctorName || 'در حال بارگذاری...'}
        </h1>
        <p className="text-brand font-bold text-lg mb-6">
          {info.specialty}
        </p>
        
        {/* از STATIC */}
        <p className="text-gray-500 leading-8 text-justify mb-6">
          {info.bio}
        </p>

        {/* از STATIC */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          {info.credentials?.map((cred, idx) => {
            const Icon = ICON_MAP[cred.icon] || Award;
            return (
              <span 
                key={idx}
                className="bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-gray-100"
              >
                <Icon size={16} className="text-brand" />
                {cred.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DoctorHero;