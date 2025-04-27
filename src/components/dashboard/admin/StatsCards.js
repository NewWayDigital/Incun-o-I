import React from 'react';
import '../../../styles/dashboard/Components.css';

const StatsCards = () => {
  // Format adapté pour le backend
  const statsData = [
    {
      icon: 'fas fa-users',
      value: '24',
      label: 'Utilisateurs actifs',
      color: 'rgba(52, 152, 219, 0.1)',
      textColor: 'var(--primary-color)',
      type: 'users_active'
    },
    {
      icon: 'fas fa-baby-carriage',
      value: '12',
      label: 'Incubateurs en service',
      color: 'rgba(46, 204, 113, 0.1)',
      textColor: 'var(--secondary-color)',
      type: 'incubators_active'
    },
    {
      icon: 'fas fa-exclamation-triangle',
      value: '3',
      label: 'Alertes système',
      color: 'rgba(243, 156, 18, 0.1)',
      textColor: 'var(--warning-color)',
      type: 'system_alerts'
    },
    {
      icon: 'fas fa-server',
      value: '92%',
      label: 'Disponibilité du système',
      color: 'rgba(231, 76, 60, 0.1)',
      textColor: 'var(--danger-color)',
      type: 'system_availability'
    }
  ];

  return (
    <div className="dashboard-stats">
      {statsData.map((stat, index) => (
        <div className="stat-card" key={index}>
          <div className="stat-icon" style={{ backgroundColor: stat.color, color: stat.textColor }}>
            <i className={stat.icon}></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards; 
