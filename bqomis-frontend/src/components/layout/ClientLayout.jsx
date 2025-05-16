import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import TopNav from './TopNav';
import SidebarNav from './SidebarNav';
import Footer from './Footer';
import './ClientLayout.scss';

const ClientLayout = () => {

  const clientNavItems = [
    { path: '/client/home', label: 'Home', icon: '🏠' },
    { path: '/client/branches', label: 'Find Branch & Services', icon: '🏢' },
    { path: '/client/appointments', label: 'My Appointments', icon: '📅' },
    { path: '/client/history', label: 'My History', icon: '🛠️' },
    { path: '/client/profile', label: 'My Profile', icon: '👤' },
  ];
  

  return (
    <div className="client-layout">
      <TopNav />
      <div className="client-layout__main">
        <SidebarNav navigationItems={clientNavItems} />
        <main className="client-layout__content">
          <Outlet /> {/* Child routes will render here */}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ClientLayout;