import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea,
} from 'recharts';

export default function PhysicalChart({ chartData }) {
  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">تحلیل فیزیکی (روند وزن و BMI)</h3>
        <div className="h-56 flex items-center justify-center text-gray-400 text-sm rounded-xl bg-gray-50 border border-dashed border-gray-200">
          داده‌ای برای نمایش وجود ندارد
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-800 mb-4">تحلیل فیزیکی (روند وزن و BMI)</h3>
      <div className="h-56 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
            />
            
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              domain={[15, 35]}
            />
            
            <ReferenceArea 
              yAxisId="right" 
              y1={18.5} 
              y2={25} 
              fill="#10b981" 
              fillOpacity={0.08} 
            />
            
            <Tooltip
              contentStyle={{ 
                borderRadius: 12, 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                direction: 'rtl',
                textAlign: 'right'
              }}
              formatter={(value, name) => {
                if (name === 'weight') return [`${value} کیلوگرم`, 'وزن'];
                return [value.toFixed(1), 'BMI'];
              }}
              labelFormatter={l => `تاریخ: ${l}`}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            
            <Legend 
              wrapperStyle={{ fontSize: 11 }} 
              formatter={v => (v === 'weight' ? 'وزن (کیلوگرم)' : 'شاخص توده بدنی (BMI)')} 
            />
            
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="weight"
              name="weight"
              fill="url(#weightGradient)"
              stroke="#10b981"
              strokeWidth={2}
            />
            
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bmi"
              name="bmi"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#f59e0b' }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
