import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="content-page">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
