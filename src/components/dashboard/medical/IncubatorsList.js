import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/dashboard/Components.css';
import { incubateurService, patientService, constanceVitaleService } from '../../../services/api';
import { transformIncubatorData } from '../../../services/dataTransformer';
import { toast } from 'react-hot-toast';
import { calculerAge, formaterDate } from '../../../utils/dateUtils';

function IncubatorsList() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [incubators, setIncubators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncubator, setSelectedIncubator] = useState(null);
  const [showIncubatorDetails, setShowIncubatorDetails] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Charger les données des incubateurs à l'initialisation
  useEffect(() => {
    fetchIncubators();
  }, []);

  // Fonction pour récupérer les incubateurs
  const fetchIncubators = async () => {
    try {
      setLoading(true);
      
      // Récupérer les incubateurs
      const incubateursResponse = await incubateurService.getAll();
      
      // Récupérer tous les patients
      const patientsResponse = await patientService.getAll();
      
      // Débogage: afficher les statuts des patients
      console.log("Statuts des patients:", patientsResponse.map(p => ({ 
        nom: p.nom, 
        status: p.status, 
        incubateur: p.incubateur 
      })));
      
      // Associer les patients aux incubateurs
      const incubateursWithPatients = incubateursResponse.map(incubateur => {
        // Chercher le patient associé à cet incubateur
        const patientMatch = patientsResponse.find(p => 
          p.incubateur === incubateur.id || 
          (incubateur.patient && p.nom === incubateur.patient)
        );
        
        if (patientMatch) {
          // Si un patient est trouvé, ajouter ses données à l'incubateur
          return {
            ...incubateur,
            patient: patientMatch.nom,
            patientData: patientMatch
          };
        }
        return incubateur;
      });
      
      // Transformer les données
      const transformedData = transformIncubatorData(incubateursWithPatients);
      
      // Débogage: afficher les statuts des incubateurs après transformation
      console.log("Statuts des incubateurs après transformation:", transformedData.map(inc => ({
        id: inc.id,
        patient: inc.patient,
        status: inc.status
      })));
      
      setIncubators(transformedData);
      
    } catch (error) {
      console.error('Erreur lors du chargement des incubateurs:', error);
      toast.error('Erreur lors du chargement des incubateurs');
      // Données factices en cas d'erreur
      setIncubators([
    {
      id: 'A1',
      patient: 'Emma Martin',
      status: 'stable',
      age: '8 jours',
      poids: '2.4 kg',
      model: 'Incuneo-I Pro X3',
      location: 'Chambre 101',
      lastMaintenance: '10/04/2024',
      saturationOxy: '98%',
      humidite: '65%',
      temperature: '37.2°C',
      vitalSigns: [
            { name: 'Température', value: '37.2°C', status: 'stable', icon: 'fa-thermometer-half' },
            { name: 'Fréquence cardiaque', value: '132 bpm', status: 'stable', icon: 'fa-heartbeat' },
            { name: 'SpO2', value: '98%', status: 'stable', icon: 'fa-wind' },
            { name: 'Humidité', value: '65%', status: 'stable', icon: 'fa-tint' }
      ],
      alerts: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour monitorer un incubateur
  const handleMonitorIncubator = async (incubator) => {
    try {
      setDetailsLoading(true);
      setSelectedIncubator(incubator);
      setShowIncubatorDetails(true);
      
      // Rechercher des informations supplémentaires sur le patient associé
      const patients = await patientService.getAll();
      const patientMatch = patients.find(p => p.incubateur === incubator.id || p.nom === incubator.patient);
      
      if (patientMatch) {
        // Récupérer les données détaillées du patient
        const patientData = await patientService.getById(patientMatch.id);
        console.log("Données du patient récupérées:", patientData);
        
        // Récupérer les constantes vitales pour ce patient
        const constantes = await constanceVitaleService.getByPatient(patientMatch.id);
        console.log("Constantes vitales:", constantes);
        
        // Récupérer les tendances pour cet incubateur
        const trends = await incubateurService.getById(incubator.id);
        
        // Formater les données des tendances
        const formattedTrends = trends ? [
          { time: '08:00', temp: '37.0', hr: '130', oxy: '97' },
          { time: '10:00', temp: '37.1', hr: '132', oxy: '98' },
          { time: '12:00', temp: '37.2', hr: '133', oxy: '98' }
        ] : [];
        
        // Calculer l'âge
        const age = calculerAge(patientData.dateNaissance);
        
        // Déterminer le statut en fonction du statut du patient
        const patientStatus = patientData.status || incubator.status;
        
        // Mettre à jour l'incubateur sélectionné avec les données du patient et les tendances
        const incubatorWithPatientData = {
          ...incubator,
          patient: patientData.nom,
          // Mettre à jour le statut de l'incubateur avec celui du patient
          status: patientStatus,
      vitalSigns: [
            { 
              name: 'Température', 
              value: constantes.length > 0 ? constantes[0].temperature : incubator.vitalSigns[0].value, 
              status: patientStatus, 
              icon: 'fa-thermometer-half' 
            },
            { 
              name: 'Fréquence cardiaque', 
              value: constantes.length > 0 ? `${constantes[0].pouls} bpm` : incubator.vitalSigns[1].value, 
              status: patientStatus, 
              icon: 'fa-heartbeat' 
            },
            { 
              name: 'SpO2', 
              value: constantes.length > 0 ? `${constantes[0].respiration}%` : incubator.vitalSigns[2].value, 
              status: patientStatus, 
              icon: 'fa-wind' 
            },
            { 
              name: 'Humidité', 
              value: incubator.humidite, 
              status: patientStatus, 
              icon: 'fa-tint' 
            }
      ],
          details: {
            age: age,
            weight: patientData.poids || incubator.poids,
            birthDate: patientData.dateNaissance ? formaterDate(patientData.dateNaissance) : new Date().toLocaleDateString('fr-FR'),
            condition: patientData.status === 'stable' ? 'Stable' : (patientData.status === 'warning' ? 'Attention requise' : 'Critique'),
            trends: formattedTrends,
            patientInfo: {
              id: patientData.id,
              nom: patientData.nom,
              sexe: patientData.sexe,
              groupeSanguin: patientData.groupeSanguin,
              allergies: patientData.allergies,
              parent: patientData.parent,
              telephone: patientData.telephone
            }
          }
        };
        
        setSelectedIncubator(incubatorWithPatientData);
      }
      
    } catch (error) {
      console.error("Erreur lors du chargement des détails de l'incubateur:", error);
      toast.error("Erreur lors du chargement des détails");
    } finally {
      setDetailsLoading(false);
    }
  };

  // Fonction pour fermer la modal de détails
  const handleCloseDetails = () => {
    setShowIncubatorDetails(false);
    setSelectedIncubator(null);
  };

  // Fonction pour afficher les détails d'un patient
  const handleViewPatientDetails = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  // Filtrer les incubateurs selon le statut
  const filteredIncubators = incubators
    .filter(incubator => {
      if (filterStatus === 'all') return true;
      return incubator.status === filterStatus;
    })
    .filter(incubator => {
      if (!searchTerm) return true;
      return (
        incubator.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incubator.patient.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  // Rendu des détails d'un incubateur
  const renderIncubatorDetails = () => {
    if (!selectedIncubator) return null;
    
    // Vérifier si des informations patient détaillées sont disponibles
    const hasDetailedPatientInfo = selectedIncubator.details?.patientInfo !== undefined;
    
    return (
      <div className="incubator-details-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Incubateur {selectedIncubator.id} - {selectedIncubator.patient}</h2>
            <button className="close-btn" onClick={handleCloseDetails}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            {detailsLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Chargement des données détaillées...</p>
              </div>
            ) : (
              <div className="incubator-details-grid">
                <div className="incubator-info-section">
                  <h3>Informations patient</h3>
                  <div className="detail-item">
                    <span className="detail-label">Nom:</span>
                    <span className="detail-value">{selectedIncubator.patient}</span>
                  </div>
                  {selectedIncubator.details && (
                    <>
                      <div className="detail-item">
                        <span className="detail-label">Âge:</span>
                        <span className="detail-value">{selectedIncubator.details.age}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Poids:</span>
                        <span className="detail-value">{selectedIncubator.details.weight}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Date de naissance:</span>
                        <span className="detail-value">{selectedIncubator.details.birthDate}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">État:</span>
                        <span className="detail-value">{selectedIncubator.details.condition}</span>
                      </div>
                    </>
                  )}
                  {hasDetailedPatientInfo && (
                    <>
                      <div className="detail-item">
                        <span className="detail-label">Sexe:</span>
                        <span className="detail-value">{selectedIncubator.details.patientInfo.sexe}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Groupe sanguin:</span>
                        <span className="detail-value">{selectedIncubator.details.patientInfo.groupeSanguin || "Non spécifié"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Allergies:</span>
                        <span className="detail-value">{selectedIncubator.details.patientInfo.allergies || "Aucune"}</span>
                      </div>
                    </>
                  )}
                </div>
                
                {hasDetailedPatientInfo && (
                  <div className="patient-contact-section">
                    <h3>Informations contact</h3>
                    <div className="detail-item">
                      <span className="detail-label">Parent:</span>
                      <span className="detail-value">{selectedIncubator.details.patientInfo.parent}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Téléphone:</span>
                      <span className="detail-value">{selectedIncubator.details.patientInfo.telephone}</span>
                    </div>
                    <button 
                      onClick={() => handleViewPatientDetails(selectedIncubator.details.patientInfo.id)} 
                      className="btn btn-outline mt-2"
                    >
                      <i className="fas fa-file-medical mr-2"></i> Voir dossier complet
                    </button>
                  </div>
                )}
                
                <div className="incubator-status-section">
                  <h3>Signes vitaux</h3>
                  {selectedIncubator.vitalSigns.map((sign, index) => (
                    <div key={index} className={`vital-sign ${sign.status}`}>
                      <i className={`fas ${sign.icon}`}></i>
                      <div className="vital-info">
                        <span className="vital-value">{sign.value}</span>
                        <span className="vital-label">{sign.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={handleCloseDetails}>
              <i className="fas fa-times mr-2"></i> Fermer
            </button>
            <button className="btn btn-primary">
              <i className="fas fa-chart-line mr-2"></i> Voir historique
            </button>
            <button className="btn btn-primary">
              <i className="fas fa-cog mr-2"></i> Paramètres
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="main-content" id="main-content">
      <div className="topbar">
        <h1 className="page-title">Gestion des incubateurs</h1>
      </div>
      <div className="dashboard-content">
        <div className="card">
          <div className="card-header">
            <div className="filter-controls">
              <div className="filter-group">
                <label htmlFor="status-filter">Statut:</label>
                <select 
                  id="status-filter" 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tous</option>
                  <option value="stable">Stable</option>
                  <option value="warning">Attention</option>
                  <option value="critical">Critique</option>
                </select>
              </div>
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <button className="btn btn-outline" onClick={fetchIncubators}>
                <i className="fas fa-sync-alt"></i> Actualiser
              </button>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Chargement des incubateurs...</p>
              </div>
            ) : (
            <div className="incubators-grid">
              {filteredIncubators.length > 0 ? (
                filteredIncubators.map((incubator, index) => (
                  <div key={index} className={`incubator-card status-${incubator.status}`}>
                    <div className="card-header">
                      <div className="incubator-id">
                        <i className="fas fa-baby-carriage"></i>
                        <h3>Incubateur {incubator.id}</h3>
                      </div>
                      <div className={`status-badge status-${incubator.status}`}>
                        <i className={`fas ${
                            incubator.status === 'stable' || incubator.status === 'normal' ? 'fa-check-circle' : 
                          incubator.status === 'warning' ? 'fa-exclamation-triangle' : 
                          'fa-exclamation-circle'
                        }`}></i>
                          {incubator.status === 'stable' || incubator.status === 'normal' ? 'Stable' : 
                          incubator.status === 'warning' ? 'Attention' : 'Critique'}
                      </div>
                    </div>
                    
                    <div className="patient-info">
                      <h4>{incubator.patient}</h4>
                      <div className="patient-details">
                          <span><i className="fas fa-baby"></i> {incubator.details?.age || 'N/A'}</span>
                          <span><i className="fas fa-weight"></i> {incubator.details?.weight || incubator.poids || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="vital-signs">
                        {incubator.vitalSigns && Array.isArray(incubator.vitalSigns) ? (
                          incubator.vitalSigns.map((sign, i) => (
                        <div key={i} className={`vital-sign ${sign.status}`}>
                          <i className={`fas ${sign.icon}`}></i>
                          <div className="vital-info">
                            <span className="vital-value">{sign.value}</span>
                            <span className="vital-label">{sign.name}</span>
                          </div>
                        </div>
                          ))
                        ) : (
                          // Format de données différent (venant de l'API)
                          <>
                            <div className={`vital-sign ${incubator.status}`}>
                              <i className="fas fa-thermometer-half"></i>
                              <div className="vital-info">
                                <span className="vital-value">{incubator.temperature}</span>
                                <span className="vital-label">Température</span>
                              </div>
                            </div>
                            <div className={`vital-sign ${incubator.status}`}>
                              <i className="fas fa-heartbeat"></i>
                              <div className="vital-info">
                                <span className="vital-value">{incubator.vitalSigns.heartRate}</span>
                                <span className="vital-label">Fréquence cardiaque</span>
                              </div>
                            </div>
                            <div className={`vital-sign ${incubator.status}`}>
                              <i className="fas fa-wind"></i>
                              <div className="vital-info">
                                <span className="vital-value">{incubator.vitalSigns.oxygen}</span>
                                <span className="vital-label">SpO2</span>
                              </div>
                            </div>
                          </>
                        )}
                    </div>
                    
                    <div className="card-actions">
                      <button 
                        className="action-btn view-btn" 
                        onClick={() => handleMonitorIncubator(incubator)}
                      >
                        <i className="fas fa-eye"></i>
                        Monitorer
                      </button>
                      <div>
                        <button className="action-btn history-btn small">
                          <i className="fas fa-history"></i>
                        </button>
                        <button className="action-btn alert-btn small">
                          <i className="fas fa-bell"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <i className="fas fa-search"></i>
                  <p>Aucun incubateur ne correspond à vos critères.</p>
                </div>
              )}
            </div>
            )}
          </div>
        </div>
        {showIncubatorDetails && renderIncubatorDetails()}
      </div>
    </div>
  );
}

export default IncubatorsList; 