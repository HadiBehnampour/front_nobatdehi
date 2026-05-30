import React from 'react';
import { MessageCircle, Lock } from 'lucide-react';

const RecentConsults = ({ consults, navigate }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-amber-200 p-6 relative overflow-hidden">
      
      {/* هدر با بج قفل */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          پیام‌های مشاوره اخیر
          <span className="bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            <Lock size={10} /> به زودی
          </span>
        </h3>
      </div>

      {/* محتوای قفل شده */}
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
          <Lock className="text-amber-400" size={28} />
        </div>
        <p className="text-gray-400 text-sm font-bold mb-1">این بخش در حال توسعه است</p>
        <p className="text-gray-300 text-xs">مشاوره آنلاین به زودی فعال می‌شود</p>
      </div>
    </div>
  );
};

export default RecentConsults;