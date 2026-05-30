import React from 'react';
import { Bell, Clock } from 'lucide-react';

const UpcomingAppointments = ({ appointments }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-brand-light relative overflow-hidden">
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-brand/5 rounded-full"></div>
      <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Bell className="text-brand animate-bounce" size={20} />
        نوبت‌های پیش رو
      </h3>

      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map(appt => (
            <div key={appt.id} className="p-5 rounded-2xl bg-brand text-white shadow-lg shadow-brand/20 relative">
              <div className="flex justify-between items-start mb-3">
                <span className="text-2xl font-black">{appt.date}</span>
                <Clock size={20} className="opacity-60" />
              </div>
              <div className="text-sm font-bold opacity-90 mb-1">ساعت {appt.time}</div>
              <div className="text-xs bg-white/20 p-2 rounded-lg inline-block">{appt.type}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400 text-xs">نوبت فعالی ندارید</div>
      )}
    </div>
  );
};

export default UpcomingAppointments;