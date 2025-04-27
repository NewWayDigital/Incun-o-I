import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, setupBeforeUnloadHandler } from '../../../services/authService';
import '../../../styles/dashboard/Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection, onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Configurer le gestionnaire de fermeture du navigateur
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
    
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  useEffect(() => {
    if (onToggle) {
      onToggle(collapsed);
    }
  }, [collapsed, onToggle]);

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

  const handleSectionClick = (section) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
        <i className="fas fa-user-shield"></i>
        <span>{userName}</span>
      </div>

      <div className="sidebar-menu">
        <div className="sidebar-menu-item">
          <a 
            href="#dashboard" 
            className={`sidebar-menu-link ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('dashboard');
            }}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Tableau de bord</span>
          </a>
        </div>

        <div className="sidebar-menu-item">
          <a 
            href="#users" 
            className={`sidebar-menu-link ${activeSection === 'users' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('users');
            }}
          >
            <i className="fas fa-users"></i>
            <span>Utilisateurs</span>
          </a>
        </div>

        <div className="sidebar-menu-item">
          <a 
            href="#incubators" 
            className={`sidebar-menu-link ${activeSection === 'incubators' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('incubators');
            }}
          >
            <i className="fas fa-baby-carriage"></i>
            <span>Incubateurs</span>
          </a>
        </div>

        <div className="sidebar-menu-item">
          <a 
            href="#patients" 
            className={`sidebar-menu-link ${activeSection === 'patients' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('patients');
            }}
          >
            <i className="fas fa-procedures"></i>
            <span>Patients</span>
          </a>
        </div>

        <div className="sidebar-menu-item">
          <a 
            href="#alerts" 
            className={`sidebar-menu-link ${activeSection === 'alerts' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('alerts');
            }}
          >
            <i className="fas fa-bell"></i>
            <span>Alertes</span>
          </a>
        </div>

        <div className="sidebar-menu-item">
          <a 
            href="#settings" 
            className={`sidebar-menu-link ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('settings');
            }}
          >
            <i className="fas fa-cog"></i>
            <span>Paramètres</span>
          </a>
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

export default Sidebar;