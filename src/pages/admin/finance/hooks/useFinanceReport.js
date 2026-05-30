import { useEffect, useState } from 'react';

import { adminService } from '../../../../api';

export function useFinanceReport(range) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: { totalIncome: 0, todayIncome: 0, pending: 0 },
    chartData: [],
    pieData: [],
    transactions: [],
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        const response = await adminService.getFinanceReport(range);
        if (!cancelled) setData(response.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('خطا در دریافت گزارش مالی:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [range]);

  return { loading, data };
}

