import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../../../api';

const useDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    stats: {
      patientsToday: 0,
      incomeToday: 0,
      pendingConsults: 0, // 🔒 این فیلد استفاده نمیشه فعلاً
      newPatientsMonth: 0
    },
    growthChart: [],
    recentConsults: [], // 🔒 این فیلد استفاده نمیشه فعلاً
    todaysAppointments: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await adminService.getStats();
        
        // 🔒 مشاوره رو صفر کن چون قفله
        setData({
          ...result,
          stats: {
            ...result.stats,
            pendingConsults: 0 // قفل شده
          },
          recentConsults: [] // قفل شده
        });
      } catch (error) {
        console.error("خطا در دریافت اطلاعات داشبورد", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    loading,
    data,
    navigate,
  };
};

export default useDashboard;