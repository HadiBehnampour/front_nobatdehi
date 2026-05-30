import React from 'react';

import { PieChart as PieIcon } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export default function ServicesPieChart({ pieData }) {
  return (
    <div className="lg:col-span-4 bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
      <h3 className="font-black text-gray-800 text-lg mb-8 flex items-center gap-2">
        <PieIcon className="text-brand" /> سهم خدمات
      </h3>

      <div className="h-64" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {pieData?.map((entry, index) => (
                <Cell key={entry.name || index} fill={entry.color || '#3fa34d'} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {pieData?.map((item) => (
          <div key={item.name} className="flex justify-between items-center text-xs font-bold">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: item.color || '#ccc' }}
              />
              <span className="text-gray-500">{item.name}</span>
            </div>
            <span className="text-gray-800">{item.value}٪</span>
          </div>
        ))}
      </div>
    </div>
  );
}

