import React from 'react';

const WorkingHoursSettings = ({ schedule, onToggleDay, onUpdateTime }) => {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 animate-in slide-in-from-right-4">
      <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-4 mb-4">
        برنامه هفتگی مطب
      </h3>
      
      <div className="space-y-3">
        {/* Header */}
        <div className="grid grid-cols-12 text-xs font-bold text-gray-400 pb-2 px-2">
          <div className="col-span-3">روز هفته</div>
          <div className="col-span-3 text-center">وضعیت</div>
          <div className="col-span-6 text-center">ساعت کاری</div>
        </div>
        
        {/* Days */}
        {schedule.map((day, index) => (
          <div 
            key={index} 
            className={`grid grid-cols-12 items-center p-3 rounded-xl border transition-all ${
              day.isOpen 
                ? 'bg-white border-gray-200' 
                : 'bg-gray-50 border-transparent opacity-60'
            }`}
          >
            <div className="col-span-3 font-bold text-gray-700 text-sm">
              {day.day}
            </div>
            
            <div className="col-span-3 flex justify-center">
              <button 
                onClick={() => onToggleDay(index)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  day.isOpen 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {day.isOpen ? 'باز است' : 'تعطیل'}
              </button>
            </div>

            <div className="col-span-6 flex items-center justify-center gap-2">
              <input 
                type="time" 
                disabled={!day.isOpen}
                value={day.start}
                onChange={(e) => onUpdateTime(index, 'start', e.target.value)}
                className="bg-gray-100 rounded-lg px-2 py-1 text-sm font-mono focus:outline-none disabled:opacity-50"
              />
              <span className="text-gray-400">-</span>
              <input 
                type="time" 
                disabled={!day.isOpen}
                value={day.end}
                onChange={(e) => onUpdateTime(index, 'end', e.target.value)}
                className="bg-gray-100 rounded-lg px-2 py-1 text-sm font-mono focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkingHoursSettings;