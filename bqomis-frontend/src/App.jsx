import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'; // Import Navigate and Outlet
import AdminLayout from './components/layout/AdminLayout';
import ClientLayout from './components/layout/ClientLayout';
import { useAuth } from './contexts/AuthContext'; // Import useAuth

// Import client pages
import ClientHomePage from './pages/client/ClientHomePage';
import ClientFindBranchPage from './pages/client/ClientFindBranchPage';
import ClientBookAppointmentPage from './pages/client/ClientBookAppointmentPage';
import ClientMyAppointmentsPage from './pages/client/ClientMyAppointmentsPage';
import ClientProfilePage from './pages/client/ClientProfilePage';

// Import admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage'; // Assuming you created this
import AdminBranchManagementPage from './pages/admin/AdminBranchManagementPage';
import AdminServiceManagementPage from './pages/admin/AdminServiceManagementPage';
import AdminBranchServiceManagementPage from './pages/admin/AdminBranchServiceManagementPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import AdminAppointmentManagementPage from './pages/admin/AdminAppointmentManagementPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import DevDataToolsPage from './pages/admin/DevDataToolsPage';


// pages shared between client and admin
import SignInPage from './pages/SignInPage';
import NotFoundPage from './pages/NotFoundPage';
import SignUpPage from './pages/SignUpPage';


// Protected Route Component for Admin
const AdminProtectedRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated || !isAdmin) {
    // Redirect them to the /signin page, but save the current location they were
    // trying to go to so we can send them along after they login.
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />; // Renders the child routes if authenticated and admin
};

// Protected Route Component for Client (general authenticated user)
const ClientProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  return <Outlet />;
};


function App() {
  const { user, loading } = useAuth();

  if (loading) {
    // You might want a global loading spinner here if the app is large
    // or if the initial auth check is critical before rendering anything.
    return <div>Application Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="/signin" element={!user ? <SignInPage /> : (user.role === 'ADMIN' ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/client/home" replace />)} />
      <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/client/home" replace />} />
      {/* <Route path="/about" element={<AboutPage />} /> */}

      {/* Client Routes */}
      <Route path="/client" element={<ClientProtectedRoute />}>
        <Route element={<ClientLayout />}> {/* ClientLayout wraps protected client routes */}
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<ClientHomePage />} />
          <Route path="branches" element={<ClientFindBranchPage />} />
          <Route path="book-appointment" element={<ClientBookAppointmentPage />} />
          <Route path="appointments" element={<ClientMyAppointmentsPage />} />
          <Route path="profile" element={<ClientProfilePage />} />
        </Route>
      </Route>


      {/* Admin Routes */}
      <Route path="/admin" element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}> {/* AdminLayout wraps protected admin routes */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="branches" element={<AdminBranchManagementPage />} />
          <Route path="services" element={<AdminServiceManagementPage />} />
          <Route path="branch-services" element={<AdminBranchServiceManagementPage />} />
          <Route path="users" element={<AdminUserManagementPage />} />
          <Route path="appointments" element={<AdminAppointmentManagementPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="dev-data-tools" element={<DevDataToolsPage />} />
        </Route>
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;