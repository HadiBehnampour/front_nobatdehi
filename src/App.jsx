import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// --- Layouts ---
import PatientLayout from './layouts/PatientLayout';
import AdminLayout from './layouts/AdminLayout';

// --- Protected Routes ---
import { AdminRoute, PatientRoute } from './components/ProtectedRoute';

// --- Lazy Loading Pages ---
const AuthPage = lazy(() => import('./pages/auth'));

// صفحات پنل بیمار
const Dashboard = lazy(() => import('./pages/patient/dashboard'));
const Appointments = lazy(() => import('./pages/patient/Appointments'));
const VerifyPayment = lazy(() => import('./pages/patient/Appointments/VerifyPayment'));
const Consult = lazy(() => import('./pages/patient/Consult'));
const Survey = lazy(() => import('./pages/patient/Survey'));
const AboutDoctor = lazy(() => import('./pages/patient/about-doctor'));
const Profile = lazy(() => import('./pages/patient/profile'));
const PatientMedicalRecords = lazy(() => import('./pages/patient/MedicalRecords'));

// صفحات پنل ادمین
const AdminDashboard = lazy(() => import('./pages/admin/dashboard'));
const AdminAppointments = lazy(() => import('./pages/admin/appointments'));
const AdminPatients = lazy(() => import('./pages/admin/patients'));
const AdminPatientHistory = lazy(() => import('./pages/admin/patient-history'));
const AdminConsults = lazy(() => import('./pages/admin/Consults'));
const AdminFinance = lazy(() => import('./pages/admin/finance'));
const AdminSettings = lazy(() => import('./pages/admin/settings'));

// --- Page Loader ---
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-gray-50">
    <Loader2 className="animate-spin text-blue-600" size={40} />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* مسیر اصلی */}
          <Route path="/" element={<AuthPage />} />

          {/* ✅ پنل بیمار - با دسترسی عمومی و محدود */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            
            {/* ✅ صفحات عمومی (بدون نیاز به لاگین) */}
            <Route path="appointments" element={<Appointments />} />
            <Route path="appointments/verify" element={<VerifyPayment />} />
            <Route path="about" element={<AboutDoctor />} />
            
            {/* ✅ صفحات محافظت شده (نیاز به لاگین) */}
            <Route path="dashboard" element={
              <PatientRoute>
                <Dashboard />
              </PatientRoute>
            } />
            <Route path="consult" element={
              <PatientRoute>
                <Consult />
              </PatientRoute>
            } />
            <Route path="survey" element={
              <PatientRoute>
                <Survey />
              </PatientRoute>
            } />
            <Route path="profile" element={
              <PatientRoute>
                <Profile />
              </PatientRoute>
            } />
            <Route path="records" element={
              <PatientRoute>
                <PatientMedicalRecords />
              </PatientRoute>
            } />
          </Route>

          {/* پنل ادمین - فقط ادمین */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="patient-history/:id" element={<AdminPatientHistory />} />
            <Route path="consults" element={<AdminConsults />} />
            <Route path="finance" element={<AdminFinance />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* مسیر اشتباه */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
