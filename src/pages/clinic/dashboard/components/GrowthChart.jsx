import React from 'react';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import {
  ComposedChart, Line, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const GrowthChart = ({ chartData, navigate }) => {
  return (
    <div
      className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 hover:border-brand/30 transition-all cursor-pointer group"
      onClick={() => navigate('/admin/finance')}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-black text-xl text-gray-800 flex items-center gap-2">
            <TrendingUp className="text-brand" /> تحلیل رشد بیماران و درآمد
          </h3>
          <p className="text-xs text-gray-400 mt-1">نمودار ترکیبی عملکرد هفته جاری</p>
        </div>
        <ArrowUpRight className="text-gray-300 group-hover:text-brand transition-colors" />
      </div>

      <div className="h-72 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3fa34d" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3fa34d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" hide />
            <YAxis yAxisId="right" hide />
            <Tooltip
              contentStyle={{
                borderRadius: '15px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                textAlign: 'right'
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
            <Area yAxisId="right" type="monotone" dataKey="income" name="درآمد (تومان)" fill="url(#colorIncome)" stroke="#3fa34d" strokeWidth={3} />
            <Line yAxisId="left" type="monotone" dataKey="patients" name="تعداد بیمار" stroke="#1f2937" strokeWidth={3} dot={{ r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GrowthChart;