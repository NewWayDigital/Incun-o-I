import React, { useState } from 'react';
import '../../../styles/AdminDashboard.css';

const SecuritySettings = () => {
  // Mock security settings data with default values
  const [securitySettings, setSecuritySettings] = useState([
    {
      id: 1,
      label: 'Authentification à deux facteurs',
      description: 'Exiger pour tous les comptes médicaux',
      enabled: true
    },
    {
      id: 2,
      label: 'Détection d\'intrusion',
      description: 'Bloquer les IP suspectes',
      enabled: true
    },
    {
      id: 3,
      label: 'Expiration de session',
      description: 'Déconnexion après 20 minutes d\'inactivité',
      enabled: true
    },
    {
      id: 4,
      label: 'Journalisation avancée',
      description: 'Enregistrer toutes les actions utilisateur',
      enabled: false
    },
    {
      id: 5,
      label: 'Chiffrement renforcé',
      description: 'Utiliser un cryptage 256-bit pour toutes les données',
      enabled: true
    }
  ]);

  // Handle toggle change
  const handleToggleChange = (id) => {
    setSecuritySettings(prevSettings => 
      prevSettings.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <div className="card card-span-3">
      <div className="card-header">
        <h2 className="card-title">
          <i className="fas fa-shield-alt card-title-icon"></i>
          Paramètres de sécurité
        </h2>
      </div>
      <div className="card-body">
        <ul className="settings-list">
          {securitySettings.map(setting => (
            <li key={setting.id} className="settings-item">
              <div>
                <div className="settings-label">{setting.label}</div>
                <div className="settings-description">{setting.description}</div>
              </div>
              <label className="settings-toggle">
                <input 
                  type="checkbox" 
                  checked={setting.enabled}
                  onChange={() => handleToggleChange(setting.id)}
                />
                <span className="settings-slider"></span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-footer">
        <button className="btn btn-primary">Paramètres avancés</button>
      </div>
    </div>
  );
};

export default SecuritySettings; 
