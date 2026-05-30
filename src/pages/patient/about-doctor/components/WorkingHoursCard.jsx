import { Clock } from 'lucide-react';

const WorkingHoursCard = ({ workingHours }) => {
  // اگه خالی بود، پیام نمایش بده
  if (!workingHours || workingHours.length === 0) {
    return (
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-brand-light">
        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
          <Clock size={24} />
        </div>
        <h3 className="font-bold text-gray-800 text-lg mb-2">ساعات کاری</h3>
        <p className="text-gray-400 text-sm">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-brand-light hover:shadow-md transition-all group">
      <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Clock size={24} />
      </div>
      <h3 className="font-bold text-gray-800 text-lg mb-2">ساعات کاری</h3>
      <ul className="space-y-2 text-sm text-gray-500">
        {workingHours.map((item, idx) => (
          <li 
            key={idx}
            className={`flex justify-between ${
              idx < workingHours.length - 1 ? 'border-b border-gray-100 pb-2' : 'pt-1'
            } ${!item.isOpen ? 'text-red-400' : ''}`}
          >
            <span>{item.days}:</span>
            <span className={item.isOpen ? 'font-bold text-gray-800' : ''}>
              {item.hours}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkingHoursCard;