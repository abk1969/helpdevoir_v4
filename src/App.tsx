import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import PublicLayout from './components/layout/PublicLayout';
import LandingPage from './pages/LandingPage';
import RegisterForm from './components/auth/RegisterForm';
import RegistrationSuccess from './components/auth/RegistrationSuccess';
import AddStudentForm from './components/dashboard/AddStudentForm';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import StudentDashboard from './pages/StudentDashboard';
import SubjectHomework from './pages/SubjectHomework';
import SubscriptionPage from './pages/SubscriptionPage';
import DyslexiaPathway from './components/dyslexia/DyslexiaPathway';
import HearingPathway from './components/hearing/HearingPathway';
import VisualImpairmentPathway from './components/visual/VisualImpairmentPathway';
import PrivacyPolicy from './pages/PrivacyPolicy';
import LegalNotice from './pages/LegalNotice';
import SettingsPage from './pages/SettingsPage';
import { Toaster } from 'react-hot-toast';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <PublicLayout>
                <LandingPage />
              </PublicLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <PublicLayout>
                <RegisterForm />
              </PublicLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/registration-success"
          element={
            <PrivateRoute>
              <Layout>
                <RegistrationSuccess />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/legal" element={<LegalNotice />} />

        {/* Routes privées */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/students"
          element={
            <PrivateRoute>
              <Layout>
                <StudentsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/students/add"
          element={
            <PrivateRoute>
              <Layout>
                <AddStudentForm />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/students/:studentId"
          element={
            <PrivateRoute>
              <Layout>
                <StudentDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/students/:studentId/subjects/:subjectId"
          element={
            <PrivateRoute>
              <Layout>
                <SubjectHomework />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <PrivateRoute>
              <Layout>
                <SubscriptionPage />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Parcours spécialisés */}
        <Route
          path="/students/:studentId/dyslexia"
          element={
            <PrivateRoute>
              <Layout>
                <DyslexiaPathway />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/students/:studentId/hearing"
          element={
            <PrivateRoute>
              <Layout>
                <HearingPathway />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/students/:studentId/visual"
          element={
            <PrivateRoute>
              <Layout>
                <VisualImpairmentPathway />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Route par défaut - redirige vers le tableau de bord si connecté, sinon vers la page d'accueil */}
        <Route
          path="*"
          element={
            <PrivateRoute>
              <Navigate to="/dashboard" replace />
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}