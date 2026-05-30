import React from 'react';
import { Users, MessageCircle, TrendingUp, CreditCard, Lock } from 'lucide-react';

const StatsCards = ({ stats, navigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* کارت بیماران امروز */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
        <div className="w-14 h-14 rounded-2xl bg-brand-light text-brand flex items-center justify-center">
          <Users size={28} />
        </div>
        <div>
          <span className="block text-3xl font-black text-gray-800">{stats.patientsToday}</span>
          <span className="text-xs text-gray-400 font-bold">بیماران امروز</span>
        </div>
      </div>

      {/* کارت درآمد امروز */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <CreditCard size={28} />
        </div>
        <div>
          <span className="block text-2xl font-black text-gray-800">{stats.incomeToday.toLocaleString()}</span>
          <span className="text-xs text-gray-400 font-bold">تراکنش‌های امروز (تومان)</span>
        </div>
      </div>

      {/* 🔒 کارت مشاوره‌ها - قفل شده */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-amber-200 flex items-center gap-4 relative overflow-hidden opacity-60 cursor-not-allowed">
        {/* بج قفل */}
        <div className="absolute top-2 left-2 bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
          <Lock size={10} /> به زودی
        </div>
        
        <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-300 flex items-center justify-center">
          <MessageCircle size={28} />
        </div>
        <div>
          <span className="block text-3xl font-black text-gray-400">--</span>
          <span className="text-xs text-gray-400 font-bold">مشاوره منتظر پاسخ</span>
        </div>
      </div>

      {/* کارت بیماران جدید */}
      <div
        className="bg-brand-dark p-6 rounded-[2rem] shadow-lg text-white flex items-center gap-4 group cursor-pointer"
        onClick={() => navigate('/admin/patients')}
      >
        <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center group-hover:bg-brand transition-colors">
          <TrendingUp size={28} />
        </div>
        <div>
          <span className="block text-3xl font-black">{stats.newPatientsMonth}</span>
          <span className="text-xs opacity-60 font-bold">بیماران جدید (ماه)</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;