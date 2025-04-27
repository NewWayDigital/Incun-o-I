import React, { useState, useEffect } from 'react';
import '../../../styles/dashboard/Components.css';
import '../../../styles/dashboard/MedicalDashboard.css';
import { useNavigate } from 'react-router-dom';
import MedicalSidebar from './Sidebar';
import IncubatorsList from './IncubatorsList';
import Patient from './Patient';
import Messagerie from './Messagerie';
import OrdonnancesTab from './OrdonnancesTab';
import Parametres from './Parametres';
import Alertes from './Alertes';

// Import des services
import { incubateurService, patientService, alerteService, incubateurTrendService, constanceVitaleService } from '../../../services/api';
import { transformIncubatorData, transformStatsData } from '../../../services/dataTransformer';
// Import des utilitaires de date
import { calculerAge, formaterDate } from '../../../utils/dateUtils';
import { toast } from 'react-hot-toast';

function MedicalDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedIncubator, setSelectedIncubator] = useState(null);
  const [showIncubatorDetails, setShowIncubatorDetails] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // États pour les données dynamiques
  const [incubatorData, setIncubatorData] = useState([]);
  const [patientsData, setPatientsData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showAlertDetails, setShowAlertDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Ajout d'un état pour contrôler l'affichage du dropdown de notifications
  const [showNotifications, setShowNotifications] = useState(false);

  // Charger les données au chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les incubateurs
        const incubateursResponse = await incubateurService.getAll();
        const transformedIncubators = transformIncubatorData(incubateursResponse);
        setIncubatorData(transformedIncubators);
        
        // Récupérer les patients
        const patientsResponse = await patientService.getAll();
        setPatientsData(patientsResponse);
        
        // Récupérer les alertes depuis l'API au lieu des données statiques
        try {
          const alertesResponse = await alerteService.getAll();
          setAlertsData(alertesResponse);
          console.log("Alertes chargées avec succès:", alertesResponse.length);
        } catch (alertError) {
          console.error("Erreur lors du chargement des alertes:", alertError);
          // En cas d'erreur, utiliser des alertes statiques comme fallback
          const dummyAlerts = [
            {
              type: 'critical',
              title: 'Température élevée - Sophie Lambert',
              time: 'Il y a 10 minutes',
              incubator: 'C3',
              date: new Date(Date.now() - 10*60000).toISOString(),
              temperature: '38.2°C',
              pouls: '155 bpm',
              respiration: 'Élevée',
              poids: '1.9 kg',
              humiditeCorp: '70%'
            },
            {
              type: 'warning',
              title: 'Humidité basse - Lucas Dupont',
              time: 'Il y a 25 minutes',
              incubator: 'B2',
              date: new Date(Date.now() - 25*60000).toISOString(),
              temperature: '37.8°C',
              pouls: '145 bpm',
              respiration: 'Normale',
              poids: '2.3 kg',
              humiditeCorp: '58%'
            },
            {
              type: 'warning',
              title: 'Fréquence cardiaque élevée - Lucas Dupont',
              time: 'Il y a 1 heure',
              incubator: 'B2',
              date: new Date(Date.now() - 60*60000).toISOString(),
              temperature: '37.6°C',
              pouls: '142 bpm',
              respiration: 'Normale',
              poids: '2.3 kg',
              humiditeCorp: '65%'
            },
            {
              type: 'info',
              title: 'Maintenance planifiée - Incubateur D4',
              time: 'Il y a 3 heures',
              incubator: 'D4',
              date: new Date(Date.now() - 3*60*60000).toISOString(),
              temperature: 'N/A',
              pouls: 'N/A',
              respiration: 'N/A',
              poids: 'N/A',
              humiditeCorp: 'N/A'
            }
          ];
          setAlertsData(dummyAlerts);
        }
        
        // Générer les statistiques à partir des données récupérées
        const transformedStats = transformStatsData(transformedIncubators, patientsResponse, alertsData);
        setStatsData(transformedStats);
        
        // Définir les tâches (données statiques pour le moment)
        setTasksData([
          {
            title: 'Visite de routine',
            time: 'Aujourd\'hui, 14:30',
            patient: 'Emma Martin',
            date: new Date().toISOString().split('T')[0] + ' 14:30'
          },
          {
            title: 'Ajustement de traitement',
            time: 'Aujourd\'hui, 16:00',
            patient: 'Lucas Dupont',
            date: new Date().toISOString().split('T')[0] + ' 16:00'
          },
          {
            title: 'Entretien avec les parents',
            time: 'Demain, 09:15',
            patient: 'Sophie Lambert',
            date: new Date(Date.now() + 24*60*60000).toISOString().split('T')[0] + ' 09:15'
          },
          {
            title: 'Tests sanguins',
            time: 'Demain, 11:00',
            patient: 'Noah Bernard',
            date: new Date(Date.now() + 24*60*60000).toISOString().split('T')[0] + ' 11:00'
          }
        ]);
        
        setLoading(false);
        setLastRefreshTime(new Date());
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Une erreur est survenue lors du chargement des données.");
        setLoading(false);
        
        // En cas d'erreur, utiliser des données statiques pour la démo
        setIncubatorData([
          {
            id: 'A1',
            model: 'Incuneo-I Pro X3',
            location: 'Chambre 101',
            status: 'normal',
            patient: 'Emma Martin',
            saturationOxy: '98%',
            humidite: '60%',
            temperature: '37.2°C',
            lastMaintenance: '10/04/2024',
            vitalSigns: { temperature: '37.2°C', heartRate: '132 bpm', oxygen: '98% SpO2' },
            details: {
              age: '8 jours',
              weight: '2.8 kg',
              birthDate: '14/04/2024',
              condition: 'Prématurité légère',
              incubatorSettings: {
                temperature: '36.5°C',
                humidity: '60%',
                oxygenLevel: '25%'
              },
              trends: [
                { time: '08:00', temp: '37.1', hr: '130', oxy: '97' },
                { time: '10:00', temp: '37.2', hr: '132', oxy: '98' },
                { time: '12:00', temp: '37.2', hr: '135', oxy: '98' }
              ]
            }
          }
        ]);
      }
    };

    fetchData();
  }, []);

  // Actualisation périodique des alertes et des statistiques
  useEffect(() => {
    // Ne pas actualiser si on n'est pas dans la vue d'ensemble
    if (activeSection !== 'overview') return;

    const refreshAlertsAndStats = async () => {
      try {
        console.log("Actualisation automatique des alertes et statistiques...");
        
        // Récupérer les alertes à jour
        const alertesResponse = await alerteService.getAll();
        setAlertsData(alertesResponse);
        
        // Recalculer les statistiques avec les alertes mises à jour
        const transformedStats = transformStatsData(incubatorData, patientsData, alertesResponse);
        setStatsData(transformedStats);
        
        setLastRefreshTime(new Date());
        console.log("Alertes et statistiques mises à jour avec succès");
      } catch (error) {
        console.error("Erreur lors de l'actualisation des alertes et statistiques:", error);
      }
    };

    // Actualiser immédiatement au changement de vue
    if (activeSection === 'overview') {
      refreshAlertsAndStats();
    }

    // Configurer l'intervalle d'actualisation (toutes les 30 secondes)
    const intervalId = setInterval(refreshAlertsAndStats, 30000);
    
    // Nettoyer l'intervalle lors du démontage du composant
    return () => {
      clearInterval(intervalId);
    };
  }, [activeSection, incubatorData, patientsData]);

  // Fonction manuelle pour rafraîchir les alertes et statistiques
  const refreshAlertsAndStats = async () => {
    try {
      console.log("Actualisation manuelle des alertes et statistiques...");
      
      // Récupérer les alertes à jour
      const alertesResponse = await alerteService.getAll();
      setAlertsData(alertesResponse);
      
      // Recalculer les statistiques avec les alertes mises à jour
      const transformedStats = transformStatsData(incubatorData, patientsData, alertesResponse);
      setStatsData(transformedStats);
      
      setLastRefreshTime(new Date());
      console.log("Alertes et statistiques mises à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de l'actualisation des alertes et statistiques:", error);
    }
  };

  // Surveiller les changements de taille d'écran
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      
      // Auto-collapse sidebar on smaller screens
      if (window.innerWidth < 768 && !sidebarCollapsed) {
        setSidebarCollapsed(true);
        document.body.classList.add('sidebar-collapsed-mode');
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

  // Gérer l'état du sidebar
  const handleSidebarToggle = (isCollapsed) => {
    setSidebarCollapsed(isCollapsed);
  };

  const handleMonitorIncubator = async (incubator) => {
    try {
      setLoading(true);
      
      // Récupérer les données détaillées de l'incubateur
      const incubateurDetails = await incubateurService.getById(incubator.id);
      
      // Récupérer les tendances de l'incubateur
      const trends = await incubateurTrendService.getByIncubateurId(incubator.id);
      
      // Formater les données des tendances pour l'affichage
      const formattedTrends = trends.map(trend => ({
        time: trend.time,
        temp: trend.temperature,
        hr: trend.heartRate,
        oxy: trend.oxygenLevel
      }));
      
      // Récupérer les données du patient associé à l'incubateur
      let patientData = null;
      
      // Chercher si un patient est associé à cet incubateur
      const patientsWithIncubateur = patientsData.filter(
        patient => patient.incubateur && patient.incubateur.toString() === incubator.id.toString()
      );
      
      if (patientsWithIncubateur.length > 0) {
        // Utiliser le premier patient trouvé
        patientData = patientsWithIncubateur[0];
        
        console.log("Patient associé trouvé:", patientData.nom);
        
        // Récupérer les constantes vitales du patient
        let constantes = [];
        try {
          console.log("Tentative de récupération des constantes vitales pour le patient ID:", patientData.id);
          
          // Utiliser directement fetch pour plus de fiabilité
          const response = await fetch(`http://localhost:8000/api/constance/patient/${patientData.id}/constantes`);
          constantes = await response.json();
          console.log("Constantes vitales récupérées directement:", constantes);
          
          if (constantes.length === 0) {
            console.log("Aucune constante vitale trouvée, tentative avec le service API");
            const constantesResponse = await constanceVitaleService.getByPatient(patientData.id);
            constantes = constantesResponse;
            console.log("Constantes vitales récupérées via service:", constantes);
          }
        } catch (err) {
          console.error("Erreur lors de la récupération des constantes vitales:", err);
        }
        
        // Calculer l'âge du patient
        let age = calculerAge(patientData.dateNaissance);
        
        // Mettre à jour l'incubateur sélectionné avec les données du patient et les tendances dynamiques
        const incubatorWithPatientData = {
          ...incubator,
          patient: patientData.nom,
          vitalSigns: {
            temperature: constantes.length > 0 ? constantes[0].temperature : incubator.vitalSigns.temperature,
            heartRate: constantes.length > 0 ? constantes[0].pouls : incubator.vitalSigns.heartRate,
            oxygen: constantes.length > 0 ? constantes[0].respiration : incubator.vitalSigns.oxygen
          },
          details: {
            ...incubator.details,
            age: age,
            weight: patientData.poids || incubator.details.weight,
            birthDate: patientData.dateNaissance ? formaterDate(patientData.dateNaissance) : incubator.details.birthDate,
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
            },
            constantesVitales: constantes
          }
        };
        
        console.log("Données de l'incubateur mises à jour avec les constantes vitales:", incubatorWithPatientData.vitalSigns);
        setSelectedIncubator(incubatorWithPatientData);
      } else {
        console.log("Aucun patient associé à cet incubateur");
        // Pas de patient associé, utiliser les données existantes avec les nouvelles tendances
        const incubatorWithTrends = {
          ...incubator,
          details: {
            ...incubator.details,
            trends: formattedTrends
          }
        };
        
        setSelectedIncubator(incubatorWithTrends);
      }
      
      setShowIncubatorDetails(true);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des détails de l'incubateur:", error);
      // Utiliser les données existantes en cas d'erreur
      setSelectedIncubator(incubator);
      setShowIncubatorDetails(true);
      setLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setShowIncubatorDetails(false);
  };

  const handleViewAllIncubators = () => {
    setActiveSection('incubateurs');
  };

  // Fonction pour voir les détails d'une alerte
  const handleViewAlertDetails = (alert) => {
    setSelectedAlert(alert);
    setShowAlertDetails(true);
  };

  // Fonction pour fermer les détails d'une alerte
  const handleCloseAlertDetails = () => {
    setShowAlertDetails(false);
    setSelectedAlert(null);
  };

  // Nouvelle fonction pour rafraîchir les signes vitaux
  const refreshVitalSigns = async () => {
    if (!selectedIncubator || !selectedIncubator.details?.patientInfo?.id) {
      console.log("Impossible de rafraîchir les signes vitaux: aucun patient sélectionné");
      return;
    }
    
    try {
      console.log("Rafraîchissement des signes vitaux pour le patient:", selectedIncubator.details.patientInfo.id);
      
      // Récupérer les données détaillées du patient
      const patientData = await patientService.getById(selectedIncubator.details.patientInfo.id);
      console.log("Données du patient récupérées:", patientData);
      
      // Utiliser directement fetch pour les constantes vitales
      const response = await fetch(`http://localhost:8000/api/constance/patient/${selectedIncubator.details.patientInfo.id}/constantes`);
      const constantes = await response.json();
      
      console.log("Constantes vitales fraîchement récupérées:", constantes);
      
      // Calculer l'âge mis à jour
      const age = calculerAge(patientData.dateNaissance);
      
      if (constantes && constantes.length > 0) {
        // Mise à jour de l'état avec les nouvelles constantes et l'âge
        setSelectedIncubator(prevState => ({
          ...prevState,
          vitalSigns: {
            temperature: constantes[0].temperature,
            heartRate: constantes[0].pouls,
            oxygen: constantes[0].respiration
          },
          details: {
            ...prevState.details,
            age: age,
            constantesVitales: constantes,
            birthDate: formaterDate(patientData.dateNaissance)
          }
        }));
        
        console.log("Signes vitaux et âge mis à jour avec succès");
      } else {
        console.log("Aucune constante vitale n'a été trouvée pour ce patient");
        // Mettre à jour uniquement l'âge
        setSelectedIncubator(prevState => ({
          ...prevState,
          details: {
            ...prevState.details,
            age: age,
            birthDate: formaterDate(patientData.dateNaissance)
          }
        }));
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des signes vitaux:", error);
    }
  };

  // Fonction pour naviguer vers le dossier complet du patient
  const handleViewPatientDetails = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  const handleTreatAlert = async (alertId) => {
    try {
      console.log("Traitement de l'alerte:", alertId);
      setIsLoading(true);
      
      // Requête API pour traiter l'alerte (marquer comme traitée)
      await alerteService.delete(alertId);
      
      // Mettre à jour l'affichage immédiatement
      const updatedAlerts = alertsData.filter(alert => alert.id !== alertId);
      setAlertsData(updatedAlerts);
      toast.success("Alerte traitée avec succès");
      
      // Fermer la modal après le traitement
      handleCloseAlertDetails();
      
      // Rafraîchir les données
      fetchAlerts();
      fetchStatsCards();
    } catch (error) {
      console.error('Erreur lors du traitement de l\'alerte:', error);
      toast.error('Erreur lors du traitement de l\'alerte');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fonction pour récupérer les alertes depuis le serveur
  const fetchAlerts = async () => {
    try {
      const alertesResponse = await alerteService.getAll();
      setAlertsData(alertesResponse);
      console.log("Alertes mises à jour:", alertesResponse.length);
    } catch (error) {
      console.error("Erreur lors de la récupération des alertes:", error);
      toast.error("Erreur lors de l'actualisation des alertes");
    }
  };
  
  // Fonction pour récupérer et calculer les statistiques
  const fetchStatsCards = async () => {
    try {
      // Récupérer les données nécessaires pour calculer les stats
      const transformedStats = transformStatsData(incubatorData, patientsData, alertsData);
      setStatsData(transformedStats);
      console.log("Statistiques mises à jour");
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      toast.error("Erreur lors de l'actualisation des statistiques");
    }
  };

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
            {loading ? (
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
                  <div className={`vital-sign ${selectedIncubator.status === 'critical' ? 'critical' : selectedIncubator.status === 'warning' ? 'warning' : 'normal'}`}>
                    <i className="fas fa-thermometer-half"></i>
                    <div className="vital-info">
                      <div className="vital-value">{selectedIncubator.vitalSigns.temperature}</div>
                      <div className="vital-label">Température</div>
                    </div>
                  </div>
                  <div className={`vital-sign ${selectedIncubator.status === 'critical' ? 'critical' : selectedIncubator.status === 'warning' ? 'warning' : 'normal'}`}>
                    <i className="fas fa-heartbeat"></i>
                    <div className="vital-info">
                      <div className="vital-value">{selectedIncubator.vitalSigns.heartRate}</div>
                      <div className="vital-label">Fréquence cardiaque</div>
                    </div>
                  </div>
                  <div className={`vital-sign ${selectedIncubator.status === 'critical' ? 'critical' : selectedIncubator.status === 'warning' ? 'warning' : 'normal'}`}>
                    <i className="fas fa-wind"></i>
                    <div className="vital-info">
                      <div className="vital-value">{selectedIncubator.vitalSigns.oxygen}</div>
                      <div className="vital-label">Oxygénation</div>
                    </div>
                  </div>
                  {selectedIncubator.details.constantesVitales && selectedIncubator.details.constantesVitales.length > 0 && (
                    <div className={`vital-sign normal`}>
                      <i className="fas fa-weight"></i>
                      <div className="vital-info">
                        <div className="vital-value">{selectedIncubator.details.constantesVitales[0].poids}</div>
                        <div className="vital-label">Poids</div>
                      </div>
                    </div>
                  )}
                  {selectedIncubator.details.constantesVitales && selectedIncubator.details.constantesVitales.length > 0 && (
                    <div className={`vital-sign normal`}>
                      <i className="fas fa-tint"></i>
                      <div className="vital-info">
                        <div className="vital-value">{selectedIncubator.details.constantesVitales[0].humiditeCorp || 'N/A'}</div>
                        <div className="vital-label">Humidité corporelle</div>
                      </div>
                    </div>
                  )}
                  <div className="vital-sign-update-time">
                    {selectedIncubator.details.constantesVitales && selectedIncubator.details.constantesVitales.length > 0 ? (
                      <span>Dernière mise à jour: {selectedIncubator.details.constantesVitales[0].date}</span>
                    ) : (
                      <span>Données non disponibles</span>
                    )}
                  </div>
                </div>
                
                <div className="incubator-settings-section">
                  <h3>Paramètres incubateur</h3>
                  <div className="detail-item">
                    <span className="detail-label">Température:</span>
                    <span className="detail-value">{selectedIncubator.details.incubatorSettings.temperature}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Humidité:</span>
                    <span className="detail-value">{selectedIncubator.details.incubatorSettings.humidity}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Niveau d'oxygène:</span>
                    <span className="detail-value">{selectedIncubator.details.incubatorSettings.oxygenLevel}</span>
                  </div>
                </div>
                
                <div className="trends-section">
                  <h3>Évolution des paramètres (dernières heures)</h3>
                  <table className="trends-table">
                    <thead>
                      <tr>
                        <th>Heure</th>
                        <th>Temp.</th>
                        <th>FC</th>
                        <th>SpO2</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedIncubator.details.trends.map((trend, index) => (
                        <tr key={index}>
                          <td>{trend.time}</td>
                          <td>{trend.temp}°C</td>
                          <td>{trend.hr} bpm</td>
                          <td>{trend.oxy}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-outline" onClick={handleCloseDetails}>
              <i className="fas fa-times mr-2"></i> Fermer
            </button>
            {hasDetailedPatientInfo && (
              <button className="btn btn-primary">
                <i className="fas fa-print mr-2"></i> Imprimer rapport
              </button>
            )}
            <button className="btn btn-primary" onClick={refreshVitalSigns}>
              <i className="fas fa-sync-alt mr-2"></i> Actualiser signes vitaux
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des données...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="error-container">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      );
    }
    
    return (
      <div className="dashboard-content">
        <h2 className="section-title">Tableau de bord médical - Vue d'ensemble</h2>
        
        {/* Stats Cards Row */}
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
          <div className="refresh-indicator">
            <button 
              className="btn btn-outline btn-sm refresh-btn" 
              onClick={refreshAlertsAndStats}
              title="Rafraîchir toutes les données"
            >
              <i className="fas fa-sync-alt"></i> Actualiser
            </button>
            <div className="refresh-time">Mis à jour: {lastRefreshTime.toLocaleTimeString()}</div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-main-column">
            {/* Incubator List */}
            <div className="card full-width-card">
              <div className="card-header">
                <h2 className="card-title">Incubateurs actifs</h2>
                <div className="card-actions">
                  <button className="btn btn-outline">Filtrer</button>
                  <button className="btn btn-primary" onClick={handleViewAllIncubators}>Voir tous</button>
                </div>
              </div>
              <div className="card-body incubator-list-container">
                <ul className="incubator-list">
                  {incubatorData.map((incubator, index) => (
                    <li className="incubator-item" key={index}>
                      <div className={`incubator-status status-${incubator.status}`}></div>
                      <div className="incubator-info">
                        <div className="incubator-name">Incubateur {incubator.id} - {incubator.patient}</div>
                        <div className="incubator-details">
                          <div className="incubator-detail"><i className="fas fa-thermometer-half"></i> {incubator.vitalSigns.temperature}</div>
                          <div className="incubator-detail"><i className="fas fa-heartbeat"></i> {incubator.vitalSigns.heartRate}</div>
                          <div className="incubator-detail"><i className="fas fa-wind"></i> {incubator.vitalSigns.oxygen}</div>
                        </div>
                      </div>
                      <div className="incubator-actions">
                        <button className="btn btn-icon btn-outline"><i className="fas fa-file-medical"></i></button>
                        <button className="btn btn-primary" onClick={() => handleMonitorIncubator(incubator)}>Monitorer</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="dashboard-side-column">
            {/* Recent Alerts */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Alertes récentes</h2>
                <div className="card-actions">
                  <button 
                    className="btn btn-outline btn-sm" 
                    onClick={refreshAlertsAndStats}
                    title="Rafraîchir les alertes"
                  >
                    <i className="fas fa-sync-alt"></i> Actualiser
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="last-update-info">
                  Dernière mise à jour: {lastRefreshTime.toLocaleTimeString()}
                </div>
                <ul className="alert-list">
                  {alertsData.map((alert, index) => (
                    <li className={`alert-item`} key={index}>
                      <div className={`alert-icon alert-${alert.type}`}>
                        <i className={`fas ${alert.type === 'critical' ? 'fa-exclamation-circle' : 
                                         alert.type === 'warning' ? 'fa-exclamation-triangle' : 
                                         'fa-info-circle'}`}></i>
                      </div>
                      <div className="alert-content">
                        <div className="alert-title">{alert.title}</div>
                        <div className="alert-time">{alert.time}</div>
                      </div>
                      <div className="alert-actions">
                        <button className="btn btn-icon btn-outline" onClick={() => handleViewAlertDetails(alert)}><i className="fas fa-chevron-right"></i></button>
                      </div>
                    </li>
                  ))}
                  {alertsData.length === 0 && (
                    <li className="no-alerts">
                      <i className="fas fa-check-circle"></i>
                      <p>Aucune alerte pour le moment</p>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section horizontale pour Tâches et Résumé clinique */}
        <div className="horizontal-cards-container">
          {/* Upcoming Tasks */}
          <div className="card horizontal-card">
            <div className="card-header">
              <h2 className="card-title">Tâches à venir</h2>
              <button className="btn btn-outline btn-icon"><i className="fas fa-plus"></i></button>
            </div>
            <div className="card-body">
              <ul className="task-list">
                {tasksData.map((task, index) => (
                  <li className="task-item" key={index}>
                    <label className="task-checkbox">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                    </label>
                    <div className="task-content">
                      <div className="task-title">{task.title}</div>
                      <div className="task-time">{task.time} <span className="task-patient">{task.patient}</span></div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Résumé clinique */}
          <div className="card horizontal-card">
            <div className="card-header">
              <h2 className="card-title">Résumé clinique</h2>
              <button className="btn btn-outline btn-icon"><i className="fas fa-sync-alt"></i></button>
            </div>
            <div className="card-body">
              <div className="clinical-summary">
                <div className="summary-item">
                  <div className="summary-label">Admissions aujourd'hui</div>
                  <div className="summary-value">2</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Sorties programmées</div>
                  <div className="summary-value">1</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Consultations planifiées</div>
                  <div className="summary-value">8</div>
                </div>
                <div className="summary-item">
                  <div className="summary-label">Transferts</div>
                  <div className="summary-value">0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {showIncubatorDetails && renderIncubatorDetails()}
      </div>
    );
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderDashboardContent();
      case 'incubateurs':
        return <IncubatorsList />;
      case 'patients':
        return <Patient />;
      case 'ordonnances':
        return <OrdonnancesTab />;
      case 'messagerie':
        return <Messagerie />;
      case 'parametres':
        return <Parametres />;
      case 'alertes':
        return <Alertes />;
      default:
        return <div className="dashboard-content">
          <h2>Section {activeSection} en cours de développement</h2>
        </div>;
    }
  };

  // Actualiser les données de l'incubateur sélectionné
  useEffect(() => {
    let intervalId;
    
    if (selectedIncubator && showIncubatorDetails) {
      // Actualiser les données toutes les 30 secondes
      intervalId = setInterval(async () => {
        try {
          // Récupérer les tendances actualisées
          const trends = await incubateurTrendService.getByIncubateurId(selectedIncubator.id);
          
          // Formater les données des tendances
          const formattedTrends = trends.map(trend => ({
            time: trend.time,
            temp: trend.temperature,
            hr: trend.heartRate,
            oxy: trend.oxygenLevel
          }));
          
          // Si des informations patient détaillées sont disponibles, actualiser les constantes vitales
          if (selectedIncubator.details?.patientInfo) {
            try {
              const constantes = await constanceVitaleService.getByPatient(selectedIncubator.details.patientInfo.id);
              
              if (constantes.length > 0) {
                // Mettre à jour l'incubateur avec les nouvelles constantes et tendances
                setSelectedIncubator(prevState => ({
                  ...prevState,
                  vitalSigns: {
                    temperature: constantes[0].temperature || prevState.vitalSigns.temperature,
                    heartRate: constantes[0].pouls || prevState.vitalSigns.heartRate,
                    oxygen: constantes[0].respiration || prevState.vitalSigns.oxygen
                  },
                  details: {
                    ...prevState.details,
                    trends: formattedTrends
                  }
                }));
              } else {
                // Mettre à jour seulement les tendances
                setSelectedIncubator(prevState => ({
                  ...prevState,
                  details: {
                    ...prevState.details,
                    trends: formattedTrends
                  }
                }));
              }
            } catch (error) {
              console.error("Erreur lors de l'actualisation des constantes vitales:", error);
              // Mettre à jour seulement les tendances en cas d'erreur
              setSelectedIncubator(prevState => ({
                ...prevState,
                details: {
                  ...prevState.details,
                  trends: formattedTrends
                }
              }));
            }
          } else {
            // Pas d'informations patient, mettre à jour seulement les tendances
            setSelectedIncubator(prevState => ({
              ...prevState,
              details: {
                ...prevState.details,
                trends: formattedTrends
              }
            }));
          }
          
          console.log("Données de l'incubateur actualisées");
        } catch (error) {
          console.error("Erreur lors de l'actualisation des données de l'incubateur:", error);
        }
      }, 30000); // 30 secondes
    }
    
    // Nettoyer l'intervalle lorsque le composant est démonté ou l'incubateur change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedIncubator, showIncubatorDetails]);

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

  // Fonction pour basculer l'affichage du dropdown de notifications
  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
  };

  // Fonction pour fermer le dropdown de notifications quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showNotifications && !e.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <div className="dashboard">
      <MedicalSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        onToggle={handleSidebarToggle}
      />
      
      <div className={`main-content ${sidebarCollapsed ? 'main-content-expanded' : ''}`} id="main-content">
        <div className="topbar">
          <h1 className="page-title">Tableau de bord médical</h1>
          <div className="topbar-actions">
            <div className="search-bar">
              <i className="fas fa-search search-icon"></i>
              <input type="text" className="search-input" placeholder="Rechercher..." />
            </div>
            <div className="notification-container">
              <div className="notification-icon" onClick={toggleNotifications}>
                <i className="fas fa-bell fa-lg"></i>
                <span className="notification-badge">{alertsData.length}</span>
              </div>
              
              {/* Dropdown de notifications */}
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                    <button className="mark-read-btn">Tout marquer comme lu</button>
                  </div>
                  <div className="notification-list">
                    {alertsData.length > 0 ? (
                      alertsData.map((alert, index) => (
                        <div 
                          key={index} 
                          className={`notification-item ${alert.type}`}
                          onClick={() => {
                            handleViewAlertDetails(alert);
                            setShowNotifications(false);
                          }}
                        >
                          <div className="notification-icon">
                            <i className={`fas ${
                              alert.type === 'critical' ? 'fa-exclamation-circle' : 
                              alert.type === 'warning' ? 'fa-exclamation-triangle' : 
                              'fa-info-circle'
                            }`}></i>
                          </div>
                          <div className="notification-content">
                            <p>{alert.title}</p>
                            <div className="notification-time">{alert.time}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="notification-item">
                        <div className="notification-content">
                          <p>Aucune notification</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="notification-footer">
                    <button onClick={() => setActiveSection('alertes')}>Voir toutes les alertes</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {renderMainContent()}
      </div>
      {showIncubatorDetails && renderIncubatorDetails()}
      {showAlertDetails && renderAlertDetails()}
    </div>
  );
}

export default MedicalDashboard; 