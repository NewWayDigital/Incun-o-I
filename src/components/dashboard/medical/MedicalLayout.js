import React from 'react';
import MedicalSidebar from './Sidebar';
import '../../../styles/dashboard/MedicalLayout.css';
import { Outlet } from 'react-router-dom';

const MedicalLayout = () => {
  const [activeSection, setActiveSection] = React.useState('overview');
  return (
    <div className="medical-layout" style={{ display: 'flex', minHeight: '100vh' }}>
      <MedicalSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="medical-main-content" style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MedicalLayout; 