import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, setupBeforeUnloadHandler } from '../../../services/authService';
import '../../../styles/dashboard/Sidebar.css';

const ParentSidebar = ({ activeSection, setActiveSection }) => {
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
        <i className="fas fa-user"></i>
        <span>{userName}</span>
      </div>

      <div className="sidebar-menu">
        <div className="sidebar-menu-item">
          <a 
            href="#overview" 
            className={`sidebar-menu-link ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('overview');
            }}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Tableau de bord</span>
          </a>
        </div>

        <div className="sidebar-menu-item">
          <a 
            href="#video" 
            className={`sidebar-menu-link ${activeSection === 'video' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('video');
            }}
          >
            <i className="fas fa-video"></i>
            <span>Flux vidéo</span>
          </a>
        </div>

        <div className="sidebar-menu-item">
          <a 
            href="#vitals" 
            className={`sidebar-menu-link ${activeSection === 'vitals' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('vitals');
            }}
          >
            <i className="fas fa-chart-line"></i>
            <span>Suivi des paramètres</span>
          </a>
        </div>

        <div className="sidebar-menu-item">
          <a 
            href="#gallery" 
            className={`sidebar-menu-link ${activeSection === 'gallery' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('gallery');
            }}
          >
            <i className="fas fa-image"></i>
            <span>Galerie photos</span>
          </a>
        </div>

        <div className="sidebar-menu-item">
          <a 
            href="#messages" 
            className={`sidebar-menu-link ${activeSection === 'messages' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('messages');
            }}
          >
            <i className="fas fa-comments"></i>
            <span>Messages</span>
          </a>
        </div>

        <div className="sidebar-menu-item">
          <a 
            href="#resources" 
            className={`sidebar-menu-link ${activeSection === 'resources' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick('resources');
            }}
          >
            <i className="fas fa-book-medical"></i>
            <span>Ressources</span>
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

export default ParentSidebar; 