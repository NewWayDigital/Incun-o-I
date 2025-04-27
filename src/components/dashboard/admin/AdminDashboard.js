import React, { useState, useEffect } from 'react';
import '../../../styles/dashboard/Components.css';
import '../../../styles/AdminDashboard.css';
import Sidebar from './Sidebar';
import StatsCards from './StatsCards';
import UserManagement from './UserManagement';
import IncubatorManagement from './IncubatorManagement';
import SystemLogs from './SystemLogs';
import SecuritySettings from './SecuritySettings';
import Patient from './patient';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Fonction pour gérer l'état du sidebar
  const handleSidebarToggle = (isCollapsed) => {
    setSidebarCollapsed(isCollapsed);
  };

  // Surveiller les changements de taille de fenêtre
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      
      // Auto-collapse sidebar on smaller screens
      if (window.innerWidth < 768 && !sidebarCollapsed) {
        setSidebarCollapsed(true);
        // Notifier le composant Sidebar du changement forcé
        const sidebarComponent = document.querySelector('.sidebar');
        if (sidebarComponent && !sidebarComponent.classList.contains('sidebar-collapsed')) {
          sidebarComponent.classList.add('sidebar-collapsed');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Vérifier la taille initiale
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarCollapsed]);

  // Ajouter une classe responsive au body pour un meilleur styling CSS
  useEffect(() => {
    if (windowWidth < 768) {
      document.body.classList.add('mobile-view');
    } else {
      document.body.classList.remove('mobile-view');
    }
  }, [windowWidth]);

  return (
    <div className="dashboard">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        onToggle={handleSidebarToggle}
      />
      
      <div className={`main-content ${sidebarCollapsed ? 'main-content-expanded' : ''}`} id="main-content">
        <div className="topbar">
          <h1 className="page-title">Tableau de bord administrateur</h1>
          <div className="topbar-actions">
            <div className="search-bar">
              <i className="fas fa-search search-icon"></i>
              <input type="text" className="search-input" placeholder="Rechercher..." />
            </div>
            <div className="notification-icon">
              <i className="fas fa-bell fa-lg"></i>
              <span className="notification-badge">3</span>
            </div>
          </div>
        </div>
        
        {/* Stats Cards Row */}
        <div id="dashboard">
          <StatsCards />
        </div>
        
        {/* User Management Table - Full Width */}
        <div id="users" className="card card-span-12">
          <div className="card-header">
            <h2 className="card-title">Gestion des utilisateurs</h2>
            <div className="card-actions">
              <button className="btn btn-outline">Filtrer</button>
            </div>
          </div>
          <div className="card-body">
            <UserManagement />
          </div>
        </div>
        
        {/* Incubator Management Table - Full Width */}
        <div id="incubators" className="card card-span-12">
          <div className="card-header">
            <h2 className="card-title">Gestion des incubateurs</h2>
            <div className="card-actions">
              <button className="btn btn-outline">Filtrer</button>
            </div>
          </div>
          <div className="card-body">
            <IncubatorManagement />
          </div>
        </div> 
         
        {/* Patient Management Table - Full Width */}
        <div id="patients" className="card card-span-12">
          <div className="card-header">
            <h2 className="card-title">Gestion des patients</h2>
            <div className="card-actions">
              <button className="btn btn-outline">Filtrer</button>
            </div>
          </div>
          <div className="card-body">
            <Patient/>
          </div>
        </div> 

        {/* System Logs - Full Width */}
        <div id="alerts" className="card card-span-12">
          <div className="card-header">
            <h2 className="card-title">Journaux système</h2>
            <button className="btn btn-outline btn-icon"><i className="fas fa-ellipsis-h"></i></button>
          </div>
          <div className="card-body">
            <SystemLogs />
          </div>
        </div>
        
        {/* Security Settings - Full Width */}
        <div id="settings" className="card card-span-12">
          <div className="card-header">
            <h2 className="card-title">Paramètres de sécurité</h2>
            <button className="btn btn-outline btn-icon"><i className="fas fa-ellipsis-h"></i></button>
          </div>
          <div className="card-body">
            <SecuritySettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 
