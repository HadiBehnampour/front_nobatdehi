import React, { useState } from 'react';

import { Loader2 } from 'lucide-react';

import FinanceHeader from './components/FinanceHeader';
import RevenueTrendChart from './components/RevenueTrendChart';
import ServicesPieChart from './components/ServicesPieChart';
import StatsCards from './components/StatsCards';
import TransactionsTable from './components/TransactionsTable';
import { useFinanceReport } from './hooks/useFinanceReport';

export default function AdminFinancePage() {
  const [activeRange, setActiveRange] = useState('weekly'); // 'weekly' | 'monthly'

  const { loading, data } = useFinanceReport(activeRange);

  if (loading && !data?.transactions?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-400 gap-4">
        <Loader2 size={50} className="animate-spin text-brand" />
        <p className="font-bold">در حال محاسبه تراز مالی...</p>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 text-right"
      dir="rtl"
    >
      <FinanceHeader />

      <StatsCards activeRange={activeRange} stats={data?.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <RevenueTrendChart
          loading={loading}
          activeRange={activeRange}
          onChangeRange={setActiveRange}
          data={data?.chartData}
        />

        <ServicesPieChart pieData={data?.pieData} />
      </div>

      <TransactionsTable transactions={data?.transactions} />
    </div>
  );
}

