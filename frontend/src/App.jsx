import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/home/HomePage';
import DoctorsPage from './pages/doctor/DoctorsPage';
import DoctorDetailPage from './pages/doctor/DoctorDetailPage';
import SpecialitiesPage from './pages/speciality/SpecialitiesPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';
import DoctorSchedulePage from './pages/doctor/DoctorSchedulePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />
          <Route path="/specialities" element={<SpecialitiesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Patient Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['PATIENT', 'ADMIN']} />}>
            <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          </Route>

          {/* Doctor Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['DOCTOR', 'ADMIN']} />}>
            <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>

          {/* Fallback */}
          <Route
            path="*"
            element={
              <div className="text-center py-20 text-xs text-slate-500">
                404 - Trang không tồn tại.{' '}
                <a href="/" className="text-teal-600 font-semibold underline">
                  Về trang chủ
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
