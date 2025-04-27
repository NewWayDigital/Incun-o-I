// src/components/dashboard/medical/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, setupBeforeUnloadHandler } from '../../../services/authService';
import '../../../styles/dashboard/Sidebar.css';

const MedicalSidebar = ({ activeSection, setActiveSection }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setupBeforeUnloadHandler();
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    
    if (newCollapsedState) {
      document.body.classList.add('sidebar-collapsed-mode');
    } else {
      document.body.classList.remove('sidebar-collapsed-mode');
    }
  };

  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed-mode');
    } else {
      document.body.classList.remove('sidebar-collapsed-mode');
    }
  }, [collapsed]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-baby"></i>
          <span>IncuNeo-I</span>
        </div>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <i className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </button>
      </div>

      <div className="user-info">
        <i className="fas fa-user-md"></i>
        <span>{userName}</span>
      </div>

      <div className="sidebar-menu">
        <div className="sidebar-menu-item">
          <Link to="/medical/dashboard" className={`sidebar-menu-link ${activeSection === 'overview' ? 'active' : ''}`}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Tableau de bord</span>
          </Link>
        </div>

        <div className="sidebar-menu-item">
          <Link to="/medical/alertes" className={`sidebar-menu-link ${activeSection === 'alertes' ? 'active' : ''}`}>
            <i className="fas fa-bell"></i>
            <span>Alertes</span>
          </Link>
        </div>

        <div className="sidebar-menu-item">
          <Link to="/medical/incubateurs" className={`sidebar-menu-link ${activeSection === 'incubateurs' ? 'active' : ''}`}>
            <i className="fas fa-baby-carriage"></i>
            <span>Incubateurs</span>
          </Link>
        </div>

        <div className="sidebar-menu-item">
          <Link to="/medical/patients" className={`sidebar-menu-link ${activeSection === 'patients' ? 'active' : ''}`}>
            <i className="fas fa-user-injured"></i>
            <span>Patients</span>
          </Link>
        </div>

        <div className="sidebar-menu-item">
          <Link to="/medical/ordonnances" className={`sidebar-menu-link ${activeSection === 'ordonnances' ? 'active' : ''}`}>
            <i className="fas fa-file-medical"></i>
            <span>Ordonnances</span>
          </Link>
        </div>

        <div className="sidebar-menu-item">
          <Link to="/medical/messagerie" className={`sidebar-menu-link ${activeSection === 'messagerie' ? 'active' : ''}`}>
            <i className="fas fa-comments"></i>
            <span>Messagerie</span>
          </Link>
        </div>

        <div className="sidebar-menu-item">
          <Link to="/medical/parametres" className={`sidebar-menu-link ${activeSection === 'parametres' ? 'active' : ''}`}>
            <i className="fas fa-cog"></i>
            <span>Paramètres</span>
          </Link>
        </div>
      </div>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default MedicalSidebar;
