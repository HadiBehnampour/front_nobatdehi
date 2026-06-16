import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// --- Layouts ---
import PatientLayout from './layouts/PatientLayout';
import AdminLayout from './layouts/AdminLayout';
import ClinicAdminLayout from './layouts/ClinicAdminLayout';
import SecretaryLayout from './layouts/SecretaryLayout';

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
const AdminStaff = lazy(() => import('./pages/admin/staff'));

// صفحات پنل مدیر مطب (کاملاً اختصاصی و تفکیک شده)
const ClinicDashboard = lazy(() => import('./pages/clinic/dashboard'));
const ClinicAppointments = lazy(() => import('./pages/clinic/appointments'));
const ClinicPatients = lazy(() => import('./pages/clinic/patients'));
const ClinicPatientHistory = lazy(() => import('./pages/clinic/patient-history'));
const ClinicConsults = lazy(() => import('./pages/clinic/Consults'));
const ClinicFinance = lazy(() => import('./pages/clinic/finance'));
const ClinicSettings = lazy(() => import('./pages/clinic/settings'));
const ClinicStaff = lazy(() => import('./pages/clinic/staff'));

// صفحات پنل منشی مطب (کاملاً اختصاصی و تفکیک شده)
const SecretaryDashboard = lazy(() => import('./pages/secretary/dashboard'));
const SecretaryAppointments = lazy(() => import('./pages/secretary/appointments'));
const SecretaryPatients = lazy(() => import('./pages/secretary/patients'));
const SecretarySettings = lazy(() => import('./pages/secretary/settings'));

// صفحات پلتفرم
import PlatformLayout from './layouts/PlatformLayout';
const PlatformDashboard = lazy(() => import('./pages/platform/Dashboard'));
const PlatformClinics = lazy(() => import('./pages/platform/Clinics'));
const PlatformPlans = lazy(() => import('./pages/platform/Plans'));
const PlatformFinancials = lazy(() => import('./pages/platform/Financials'));

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
            <Route path="staff" element={<AdminStaff />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* پنل اختصاصی مدیر مطب (کاملاً تفکیک شده پوشه‌به‌پوشه) */}
          <Route path="/clinic" element={
            <AdminRoute>
              <ClinicAdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ClinicDashboard />} />
            <Route path="appointments" element={<ClinicAppointments />} />
            <Route path="patients" element={<ClinicPatients />} />
            <Route path="patient-history/:id" element={<ClinicPatientHistory />} />
            <Route path="finance" element={<ClinicFinance />} />
            <Route path="staff" element={<ClinicStaff />} />
            <Route path="settings" element={<ClinicSettings />} />
          </Route>

          {/* پنل اختصاصی منشی مطب (کاملاً تفکیک شده پوشه‌به‌پوشه) */}
          <Route path="/secretary" element={
            <AdminRoute>
              <SecretaryLayout />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SecretaryDashboard />} />
            <Route path="appointments" element={<SecretaryAppointments />} />
            <Route path="patients" element={<SecretaryPatients />} />
            <Route path="settings" element={<SecretarySettings />} />
          </Route>

          {/* پنل پلتفرم */}
          <Route path="/platform" element={
            <AdminRoute><PlatformLayout /></AdminRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<PlatformDashboard />} />
            <Route path="clinics" element={<PlatformClinics />} />
            <Route path="plans" element={<PlatformPlans />} />
            <Route path="financials" element={<PlatformFinancials />} />
          </Route>

          {/* مسیر اشتباه */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
