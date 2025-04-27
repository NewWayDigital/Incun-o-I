import React from 'react';
import '../../../styles/AdminDashboard.css';

const SystemLogs = () => {
  // Mock logs data - would be fetched from an API in a real app
  const logs = [
    {
      id: 1,
      timestamp: '22/03/2025 10:12',
      level: 'error',
      message: 'Capteur de température défaillant sur INC-005 - Code erreur #E4532'
    },
    {
      id: 2,
      timestamp: '22/03/2025 09:47',
      level: 'warning',
      message: 'Tentative d\'accès non autorisé - IP: 192.168.1.45'
    },
    {
      id: 3,
      timestamp: '22/03/2025 09:35',
      level: 'info',
      message: 'Nouveau compte utilisateur créé: Marie Dubois (Parent)'
    },
    {
      id: 4,
      timestamp: '22/03/2025 09:12',
      level: 'info',
      message: 'Connexion réussie: j.martin@neosafe.fr'
    },
    {
      id: 5,
      timestamp: '22/03/2025 08:59',
      level: 'success',
      message: 'Sauvegarde système automatique complétée'
    },
    {
      id: 6,
      timestamp: '22/03/2025 08:45',
      level: 'info',
      message: 'Connexion réussie: s.dupont@neosafe.fr'
    },
    {
      id: 7,
      timestamp: '22/03/2025 08:30',
      level: 'info',
      message: 'Incubateur INC-003 mis en maintenance'
    },
    {
      id: 8,
      timestamp: '22/03/2025 08:15',
      level: 'warning',
      message: 'Niveau batterie secours faible sur INC-002 (32%)'
    },
    {
      id: 9,
      timestamp: '22/03/2025 07:55',
      level: 'info',
      message: 'Connexion réussie: n.petit@neosafe.fr (Admin)'
    },
    {
      id: 10,
      timestamp: '22/03/2025 00:00',
      level: 'success',
      message: 'Maintenance système programmée terminée'
    }
  ];

  const getLevelLabel = (level) => {
    switch(level) {
      case 'error': return 'ERREUR';
      case 'warning': return 'ALERTE';
      case 'info': return 'INFO';
      case 'success': return 'SUCCÈS';
      default: return level.toUpperCase();
    }
  };

  return (
    <div className="card card-span-9">
      <div className="card-header">
        <h2 className="card-title">
          <i className="fas fa-list-alt card-title-icon"></i>
          Journaux système récents
        </h2>
        <button className="btn btn-primary">
          <i className="fas fa-download btn-icon"></i>
          Exporter
        </button>
      </div>
      <div className="card-body">
        <div className="log-list">
          {logs.map(log => (
            <div key={log.id} className="log-item">
              <div className="log-time">{log.timestamp}</div>
              <div className={`log-level log-level-${log.level}`}>{getLevelLabel(log.level)}</div>
              <div className="log-message">{log.message}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card-footer">
        <button className="btn btn-primary">Voir tous les journaux</button>
      </div>
    </div>
  );
};

export default SystemLogs; 
