import { Navigate } from 'react-router-dom';

// چک کردن لاگین بودن
const isAuthenticated = () => {
  return !!localStorage.getItem('access');
};

// گرفتن نقش کاربر
const getUserRole = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      return JSON.parse(user).role;
    } catch {
      return null;
    }
  }
  return null;
};

// ─── محافظت از صفحات (فقط لاگین) ───
export const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// ─── فقط ادمین ───
export const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  
  const role = getUserRole();
  if (role !== 'admin') {
    return <Navigate to="/patient/dashboard" replace />;
  }
  
  return children;
};

// ─── فقط بیمار ───
export const PatientRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  
  const role = getUserRole();
  if (role !== 'patient') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
};