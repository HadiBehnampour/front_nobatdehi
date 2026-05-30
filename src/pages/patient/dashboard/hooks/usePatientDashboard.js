import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../../../api/services/patient';

const usePatientDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    patientName: "",
    upcomingAppointments: [],
    lastVisit: null,
    recordsSummary: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // ✅ فیکس: مستقیم result بگیر (چون patientService.getDashboardStats خودش response.data برمیگردونه)
        const result = await patientService.getDashboardStats();
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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

export default usePatientDashboard;