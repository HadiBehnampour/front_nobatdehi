import React from 'react';

import { TrendingUp } from 'lucide-react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function RevenueTrendChart({ loading, activeRange, onChangeRange, data }) {
  return (
    <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
          <TrendingUp className="text-brand" /> روند مالی مطب
        </h3>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
          <button
            type="button"
            onClick={() => onChangeRange('weekly')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
              activeRange === 'weekly' ? 'bg-white text-brand shadow-sm' : 'text-gray-400'
            }`}
          >
            هفتگی
          </button>
          <button
            type="button"
            onClick={() => onChangeRange('monthly')}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
              activeRange === 'monthly' ? 'bg-white text-brand shadow-sm' : 'text-gray-400'
            }`}
          >
            ماهانه
          </button>
        </div>
      </div>

      <div className="h-80 w-full" dir="ltr">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-300">در حال ترسیم نمودار...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <YAxis yAxisId="left" hide />
              <Tooltip
                contentStyle={{
                  borderRadius: '15px',
                  border: 'none',
                  direction: 'rtl',
                  textAlign: 'right',
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="income"
                name="درآمد"
                fill="#3fa34d"
                stroke="#3fa34d"
                fillOpacity={0.1}
                strokeWidth={3}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

