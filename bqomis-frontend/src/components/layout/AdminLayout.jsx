import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import SidebarNav from './SidebarNav';
import Footer from './Footer';
import './AdminLayout.scss';

const AdminLayout = () => {

  const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/admin/branches', label: 'Branch Management', icon: '🏢' },
  { path: '/admin/services', label: 'Service Management', icon: '🛠️' },
  { path: '/admin/branch-services', label: 'Branch Services', icon: '🔗' },
  { path: '/admin/users', label: 'User Management', icon: '👥' },
  { path: '/admin/appointments', label: 'Appointment Management', icon: '📅' },
  { path: '/admin/analytics', label: 'Analytics & Reports', icon: '📊' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

  return (
    <div className="admin-layout">
      <TopNav />
      <div className="admin-layout__main">
        <SidebarNav navigationItems={adminNavItems} />
        <main className="admin-layout__content">
          <Outlet /> {/* Child routes will render here */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;