import React from 'react';
import { TrendingUp, CreditCard, Globe } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

export default function StatsCards({ activeRange, stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* کارت اصلی - درآمد کل */}
      <div className="bg-brand text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
        <span className="text-sm opacity-80 block mb-2 font-bold">
          درآمد بازه انتخابی ({activeRange === 'weekly' ? 'هفتگی' : 'ماهانه'})
        </span>
        <div className="text-4xl font-black">
          {formatPrice(stats?.totalIncome)} <small className="text-xs">تومان</small>
        </div>
        <div className="mt-6 flex items-center gap-2 text-xs bg-white/20 w-fit px-3 py-1.5 rounded-xl">
          <TrendingUp size={14} /> تراز مثبت
        </div>
      </div>

      {/* کارت درآمد امروز */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <CreditCard size={16} className="text-gray-400" />
          <span className="text-gray-400 text-xs font-bold">درآمد امروز</span>
        </div>
        <div className="text-2xl font-black text-gray-800">
          {formatPrice(stats?.todayIncome)} تومان
        </div>
      </div>

      {/* کارت پیش‌پرداخت رزرو */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <Globe size={16} className="text-green-500" />
          <span className="text-gray-400 text-xs font-bold">پیش‌پرداخت رزروها</span>
        </div>
        <div className="text-2xl font-black text-green-600">
          {formatPrice(stats?.prepayments)} تومان
        </div>
        {stats?.prepaymentsTodayCount > 0 && (
          <div className="flex items-center gap-1.5 mt-2 text-sm text-green-600 font-bold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {stats.prepaymentsTodayCount} رزرو آنلاین امروز
          </div>
        )}
      </div>
    </div>
  );
}