import React, { useState, useEffect } from 'react';
import { alerteService } from '../../../services/api';
import { toast } from 'react-hot-toast';

function Alertes() {
  const [alertes, setAlertes] = useState([]);
  const [filteredAlertes, setFilteredAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAlertes();
  }, []);

  const fetchAlertes = async () => {
    try {
      setLoading(true);
      const response = await alerteService.getAll();
      setAlertes(response);
      setFilteredAlertes(response);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
      toast.error('Erreur lors du chargement des alertes');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter === 'all') {
      setFilteredAlertes(alertes);
    } else {
      setFilteredAlertes(alertes.filter(alerte => alerte.type === filter));
    }
  }, [filter, alertes]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleViewAlertDetails = (alert) => {
    setSelectedAlert(alert);
    setShowAlertDetails(true);
  };

  const handleCloseAlertDetails = () => {
    setShowAlertDetails(false);
    setSelectedAlert(null);
  };

  const handleTreatAlert = async (alertId) => {
    try {
      setIsLoading(true);
      // Appel à l'API pour marquer l'alerte comme traitée
      await alerteService.updateAlerte(alertId, { statut: 'Traitée' });
      
      // Mise à jour des alertes dans l'état local
      setAlertes(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, statut: 'Traitée' } 
            : alert
        )
      );
      
      toast.success('Alerte marquée comme traitée avec succès');
      
      // Fermer la modal après le traitement
      handleCloseAlertDetails();
      
      // Rafraîchir les données
      fetchAlertes();
    } catch (error) {
      console.error('Erreur lors du traitement de l\'alerte:', error);
      toast.error('Erreur lors du traitement de l\'alerte');
    } finally {
      setIsLoading(false);
    }
  };

  // Rendu des détails d'une alerte
  const renderAlertDetails = () => {
    if (!selectedAlert) return null;

    const getStatusIcon = (type) => {
      switch(type) {
        case 'critical':
          return <i className="fas fa-exclamation-circle fa-2x text-danger"></i>;
        case 'warning':
          return <i className="fas fa-exclamation-triangle fa-2x text-warning"></i>;
        default:
          return <i className="fas fa-info-circle fa-2x text-info"></i>;
      }
    };

    const getSeverityText = (type) => {
      switch(type) {
        case 'critical':
          return "Critique - Action immédiate requise";
        case 'warning':
          return "Attention - Surveillance rapprochée recommandée";
        default:
          return "Information - Pour votre connaissance";
      }
    };

    return (
      <div className="alert-details-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Détails de l'alerte</h2>
            <button className="close-btn" onClick={handleCloseAlertDetails}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="alert-header-info">
              <div className={`alert-severity alert-${selectedAlert.type}`}>
                {getStatusIcon(selectedAlert.type)}
                <span className="severity-text">{getSeverityText(selectedAlert.type)}</span>
              </div>
              <div className="alert-timestamp">
                <i className="far fa-clock"></i> {selectedAlert.time}
              </div>
            </div>

            <h3 className="alert-detail-title">{selectedAlert.title}</h3>

            <div className="alert-details-grid">
              <div className="alert-details-section">
                <h4>Informations sur l'incubateur</h4>
                <div className="detail-item">
                  <span className="detail-label">Incubateur:</span>
                  <span className="detail-value">{selectedAlert.incubator || 'Non spécifié'}</span>
                </div>
              </div>
              
              <div className="alert-details-section">
                <h4>Paramètres vitaux au moment de l'alerte</h4>
                <div className="vital-parameters">
                  {selectedAlert.temperature && (
                    <div className="vital-parameter">
                      <i className="fas fa-thermometer-half"></i>
                      <div className="parameter-details">
                        <span className="parameter-label">Température</span>
                        <span className="parameter-value">{selectedAlert.temperature}</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedAlert.pouls && (
                    <div className="vital-parameter">
                      <i className="fas fa-heartbeat"></i>
                      <div className="parameter-details">
                        <span className="parameter-label">Pouls</span>
                        <span className="parameter-value">{selectedAlert.pouls}</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedAlert.respiration && (
                    <div className="vital-parameter">
                      <i className="fas fa-lungs"></i>
                      <div className="parameter-details">
                        <span className="parameter-label">Respiration</span>
                        <span className="parameter-value">{selectedAlert.respiration}</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedAlert.poids && (
                    <div className="vital-parameter">
                      <i className="fas fa-weight"></i>
                      <div className="parameter-details">
                        <span className="parameter-label">Poids</span>
                        <span className="parameter-value">{selectedAlert.poids}</span>
                      </div>
                    </div>
                  )}
                  
                  {selectedAlert.humiditeCorp && (
                    <div className="vital-parameter">
                      <i className="fas fa-tint"></i>
                      <div className="parameter-details">
                        <span className="parameter-label">Humidité corporelle</span>
                        <span className="parameter-value">{selectedAlert.humiditeCorp}</span>
                      </div>
                    </div>
                  )}
                  
                  {!selectedAlert.temperature && !selectedAlert.pouls && !selectedAlert.respiration && 
                   !selectedAlert.poids && !selectedAlert.humiditeCorp && (
                    <p className="no-parameters">Aucun paramètre vital disponible</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="alert-actions-section">
              <h4>Actions recommandées</h4>
              <ul className="recommended-actions">
                {selectedAlert.type === 'critical' && (
                  <>
                    <li><i className="fas fa-user-md"></i> Alerter immédiatement l'équipe médicale</li>
                    <li><i className="fas fa-clipboard-check"></i> Vérifier les paramètres de l'incubateur</li>
                    <li><i className="fas fa-notes-medical"></i> Préparer une intervention si nécessaire</li>
                  </>
                )}
                {selectedAlert.type === 'warning' && (
                  <>
                    <li><i className="fas fa-eye"></i> Augmenter la fréquence des contrôles</li>
                    <li><i className="fas fa-clipboard-list"></i> Documenter l'évolution des paramètres</li>
                    <li><i className="fas fa-bell"></i> Configurer une alerte personnalisée si besoin</li>
                  </>
                )}
                {selectedAlert.type === 'info' && (
                  <>
                    <li><i className="fas fa-check-circle"></i> Prendre connaissance de l'information</li>
                    <li><i className="fas fa-clipboard"></i> Consigner l'information si nécessaire</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={handleCloseAlertDetails}>
              <i className="fas fa-times mr-2"></i> Fermer
            </button>
            <button className="btn btn-primary">
              <i className="fas fa-print mr-2"></i> Imprimer
            </button>
            <button className="btn btn-primary" onClick={() => handleTreatAlert(selectedAlert.id)}>
              <i className="fas fa-check mr-2"></i> Marquer comme traitée
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="main-content" id="main-content">
      <div className="topbar">
        <h1 className="page-title">Liste des alertes</h1>
      </div>
      <div className="dashboard-content">
        <div className="filter-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
              onClick={() => handleFilterChange('all')}
            >
              Toutes
            </button>
            <button 
              className={`filter-btn ${filter === 'critical' ? 'active' : ''}`} 
              onClick={() => handleFilterChange('critical')}
            >
              Critiques
            </button>
            <button 
              className={`filter-btn ${filter === 'warning' ? 'active' : ''}`} 
              onClick={() => handleFilterChange('warning')}
            >
              Avertissements
            </button>
            <button 
              className={`filter-btn ${filter === 'info' ? 'active' : ''}`} 
              onClick={() => handleFilterChange('info')}
            >
              Informations
            </button>
          </div>
          <button className="btn btn-outline" onClick={fetchAlertes}>
            <i className="fas fa-sync-alt"></i> Actualiser
          </button>
        </div>
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des alertes...</p>
          </div>
        ) : (
          <div className="alerts-list-container">
            {filteredAlertes.length > 0 ? (
              <div className="alerts-grid">
                {filteredAlertes.map((alerte, index) => (
                  <div 
                    key={index}
                    className={`alert-card alert-${alerte.type}`}
                    onClick={() => handleViewAlertDetails(alerte)}
                  >
                    <div className="alert-card-header">
                      <div className={`alert-icon alert-${alerte.type}`}>
                        <i className={`fas ${
                          alerte.type === 'critical' ? 'fa-exclamation-circle' : 
                          alerte.type === 'warning' ? 'fa-exclamation-triangle' : 
                          'fa-info-circle'
                        }`}></i>
                      </div>
                      <div className="alert-time">{alerte.time}</div>
                    </div>
                    <h3 className="alert-title">{alerte.title}</h3>
                    {alerte.incubator && (
                      <div className="alert-incubator">
                        <i className="fas fa-baby"></i> Incubateur {alerte.incubator}
                      </div>
                    )}
                    <div className="alert-card-footer">
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="fas fa-chevron-right"></i> Détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-alerts">
                <i className="fas fa-check-circle"></i>
                <p>Aucune alerte {filter !== 'all' ? `de type "${filter}"` : ''} pour le moment</p>
              </div>
            )}
          </div>
        )}
        {showAlertDetails && renderAlertDetails()}
      </div>
    </div>
  );
}

export default Alertes; 