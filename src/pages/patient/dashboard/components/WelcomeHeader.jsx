import React from 'react';
import { CalendarCheck, MapPin } from 'lucide-react';

const WelcomeHeader = ({ patientName, navigate }) => {
  return (
    <div className="bg-brand-dark rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
      <div className="absolute left-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-x-20 -translate-y-20"></div>
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h1 className="text-3xl font-black mb-2">سلام، {patientName || 'کاربر'} عزیز</h1>
          <p className="opacity-70 text-lg">به پنل هوشمند مدیریت سلامت خود خوش آمدید.</p>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <button
            onClick={() => navigate('/patient/appointments')}
            className="flex-1 md:flex-none bg-white text-brand-dark px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg cursor-pointer"
          >
            <CalendarCheck size={22} />
            نوبت جدید
          </button>
          <button
            onClick={() => navigate('/patient/about')}
            className="flex-1 md:flex-none bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all cursor-pointer"
          >
           
            ارتباط با ما
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;