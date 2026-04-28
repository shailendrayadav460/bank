import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import AdminLayout from '../layouts/AdminLayout';
import PatientLayout from '../layouts/PatientLayout';
import StudentLayout from '../layouts/StudentLayout';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import SuperAdminDashboard from '../pages/super-admin/Dashboard';
import SuperAdminUsers from '../pages/super-admin/Users';
import SuperAdminAnalytics from '../pages/super-admin/Analytics';
import SuperAdminTraining from '../pages/super-admin/TrainingDashboard';
import SuperAdminTrainingModules from '../pages/super-admin/TrainingModules';
import SuperAdminLearning from '../pages/super-admin/LearningModules';
import SuperAdminQuizzes from '../pages/super-admin/Quizzes';
import SuperAdminClinicalCases from '../pages/super-admin/ClinicalCases';
import SuperAdminSettings from '../pages/super-admin/Settings';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminPatients from '../pages/admin/Patients';
import AdminLearning from '../pages/admin/Learning';
import AdminProfile from '../pages/admin/Profile';
import PatientDashboard from '../pages/patient/Dashboard';
import StudentDashboard from '../pages/student/Dashboard';
import StudentCourses from '../pages/student/Courses';
import StudentCourseDetail from '../pages/student/CourseDetail';
import StudentQuiz from '../pages/student/Quiz';
import LearningModules from '../pages/learning/LearningModules';
import ModuleContent from '../pages/learning/ModuleContent';
import NotFound from '../pages/common/NotFound';
import Unauthorized from '../pages/common/Unauthorized';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Super Admin Routes */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SuperAdminDashboard />} />
        <Route path="users" element={<SuperAdminUsers />} />
        <Route path="analytics" element={<SuperAdminAnalytics />} />
        <Route path="training" element={<SuperAdminTraining />} />
        <Route path="training-modules" element={<SuperAdminTrainingModules />} />
        <Route path="modules" element={<SuperAdminLearning />} />
        <Route path="quizzes" element={<SuperAdminQuizzes />} />
        <Route path="cases" element={<SuperAdminClinicalCases />} />
        <Route path="settings" element={<SuperAdminSettings />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="learning" element={<AdminLearning />} />
        <Route path="progress" element={<AdminProfile />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Patient Routes */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientDashboard />} />
      </Route>

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="course/:id" element={<StudentCourseDetail />} />
        <Route path="quiz/:id" element={<StudentQuiz />} />
      </Route>

      {/* Shared Learning Routes (available to student and above) */}
      <Route
        path="/learning"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'superadmin']}>
            <LearningModules />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learning/module/:id"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin', 'superadmin']}>
            <ModuleContent />
          </ProtectedRoute>
        }
      />

      {/* Common Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
