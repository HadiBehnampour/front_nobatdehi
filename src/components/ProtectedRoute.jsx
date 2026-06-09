import { Navigate } from 'react-router-dom';

const isAuthenticated = () => !!localStorage.getItem('access');

const getUserRole = () => {
  try { return JSON.parse(localStorage.getItem('user')).role; }
  catch { return null; }
};

const STAFF_ROLES = ['platform_admin', 'clinic_admin', 'doctor', 'secretary', 'admin'];

// هر کسی که لاگین کرده
export const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/" replace />;
  return children;
};

// کارکنان مطب (همه بجز بیمار)
export const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/" replace />;
  const role = getUserRole();
  if (!STAFF_ROLES.includes(role)) return <Navigate to="/patient/dashboard" replace />;
  return children;
};

// فقط بیمار
export const PatientRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/" replace />;
  const role = getUserRole();
  if (role !== 'patient') return <Navigate to="/admin/dashboard" replace />;
  return children;
};
