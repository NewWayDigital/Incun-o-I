import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ParentDashboard.css'; // Nous allons créer ce fichier CSS séparément
import './ParentResponsive.css'; // Import du fichier CSS responsif
import '../../../styles/Mobile.css'; // Import du CSS global pour mobile
import ParentSidebar from './Sidebar';
import { photoService, videoService, constanceVitaleService } from '../../../services/api';

const ParentDashboard = () => {
    const [activeMenu, setActiveMenu] = useState('home');
    const [lastUpdate, setLastUpdate] = useState('5 min');
    const [showSidebar, setShowSidebar] = useState(true); // État pour afficher/masquer le sidebar sur mobile
    const [dailyUpdates, setDailyUpdates] = useState([
        {
            time: '09:15',
            title: 'Visite médicale',
            text: 'Dr. Dupont a effectué un examen de routine. Tout est normal.'
        },
        {
            time: '11:30',
            title: 'Alimentation',
            text: '45ml de lait maternel administrés sans difficulté.'
        },
        {
            time: '13:45',
            title: 'Changement de position',
            text: 'Changement de position effectué pour prévenir les points de pression.'
        },
        {
            time: '15:20',
            title: 'Soins de routine',
            text: 'Changement de couche et nettoyage effectués.'
        }
    ]);
    const [message, setMessage] = useState('');
    const [vitalSigns, setVitalSigns] = useState({
        temperature: { value: 0, unit: '°C', trend: 'stable', change: 0 },
        heartRate: { value: 0, unit: 'bpm', trend: 'stable', change: 0 },
        saturationO2: { value: 0, unit: '%', trend: 'stable', change: 0 },
        respiration: { value: 0, unit: 'r/min', trend: 'stable', change: 0 }
    });
    const [photos, setPhotos] = useState([]);
    const [videos, setVideos] = useState([]);
    const [resources, setResources] = useState([
        { 
            id: 1, 
            title: 'Guide des soins néonatals pour les parents',
            icon: 'file-pdf',
            url: '#'
        },
        { 
            id: 2, 
            title: 'Vidéo : Comprendre les paramètres vitaux de votre bébé',
            icon: 'video',
            url: '#'
        },
        { 
            id: 3, 
            title: 'Les étapes du développement prématuré',
            icon: 'file-alt',
            url: '#'
        },
        { 
            id: 4, 
            title: 'Alimentation et nutrition pour les nouveau-nés prématurés',
            icon: 'file-medical',
            url: '#'
        },
        { 
            id: 5, 
            title: 'FAQ : Questions fréquemment posées par les parents',
            icon: 'question-circle',
            url: '#'
        }
    ]);

    const navigate = useNavigate();

    // Gestion du menu actif
    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
    };

    // Fonction pour basculer l'affichage du sidebar sur mobile
    const toggleMobileSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    // Envoi de message
    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            // Ici vous pouvez implémenter la logique d'envoi de message
            alert(`Message envoyé: ${message}`);
            setMessage('');
        }
    };

    // Récupérer les photos et les vidéos du patient
    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const patientId = localStorage.getItem('patientId');
                console.log('PatientId récupéré:', patientId);
                
                if (patientId) {
                    const photosData = await photoService.getByPatientId(patientId);
                    console.log('Photos récupérées:', photosData);
                    
                    const videosData = await videoService.getByPatientId(patientId);
                    console.log('Vidéos récupérées:', videosData);
                    
                    setPhotos(photosData.data);
                    console.log('État photos mis à jour avec:', photosData.data);
                    
                    setVideos(videosData.data);
                    console.log('État vidéos mis à jour avec:', videosData.data);
                } else {
                    console.log('Aucun patientId trouvé dans le localStorage');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des médias:', error);
            }
        };

        fetchMedia();
    }, []);

    // Récupérer les paramètres vitaux en temps réel
    useEffect(() => {
        const fetchVitalSigns = async () => {
            try {
                const patientId = localStorage.getItem('patientId');
                console.log('Patient ID:', patientId);
                
                if (patientId) {
                    const response = await constanceVitaleService.getByPatient(patientId);
                    console.log('Réponse API constantes vitales:', response);
                    
                    if (response && response.length > 0) {
                        // Prendre la dernière constante vitale
                        const latestVitalSigns = response[response.length - 1];
                        console.log('Dernières constantes vitales:', latestVitalSigns);
                        
                        // Mettre à jour les paramètres vitaux
                        const newVitalSigns = {
                            temperature: {
                                value: parseFloat(latestVitalSigns.temperature || 0),
                                unit: '°C',
                                trend: 'stable',
                                change: 0
                            },
                            heartRate: {
                                value: parseInt(latestVitalSigns.pouls || 0),
                                unit: 'bpm',
                                trend: 'stable',
                                change: 0
                            },
                            saturationO2: {
                                value: parseInt(latestVitalSigns.saturationO2 || 0),
                                unit: '%',
                                trend: 'stable',
                                change: 0
                            },
                            respiration: {
                                value: parseInt(latestVitalSigns.respiration || 0),
                                unit: 'r/min',
                                trend: 'stable',
                                change: 0
                            }
                        };
                        console.log('Nouveaux paramètres vitaux:', newVitalSigns);
            setVitalSigns(newVitalSigns);
            setLastUpdate('Maintenant');
                    } else {
                        console.log('Aucune constante vitale trouvée pour ce patient');
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des paramètres vitaux:', error);
            }
        };

        // Récupérer les paramètres vitaux immédiatement
        fetchVitalSigns();

        // Mettre à jour les paramètres vitaux toutes les 30 secondes
        const interval = setInterval(fetchVitalSigns, 30000);

        return () => clearInterval(interval);
    }, []);

    // Gérer l'affichage du sidebar en fonction de la taille de l'écran
    useEffect(() => {
        const handleResize = () => {
            // Masquer automatiquement le sidebar sur mobile (moins de 768px)
            if (window.innerWidth < 768) {
                setShowSidebar(false);
            } else {
                setShowSidebar(true);
            }
        };

        // Vérifier la taille initiale à l'ouverture
        handleResize();

        // Mettre en place l'écouteur d'événement
        window.addEventListener('resize', handleResize);

        // Nettoyage lors du démontage du composant
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Forcer l'application des styles responsifs
    useEffect(() => {
        document.body.classList.add('mobile-responsive');
        
        // Nettoyage lors du démontage du composant
        return () => {
            document.body.classList.remove('mobile-responsive');
        };
    }, []);

    // Rendu du composant
    return (
        <div className="dashboard">
            <ParentSidebar activeSection={activeMenu} setActiveSection={setActiveMenu} />
            
            {/* Bouton pour afficher/masquer le menu sur mobile */}
            <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
                <i className={`fas ${showSidebar ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
            
            {/* Si le sidebar est masqué, afficher l'info utilisateur flottante */}
            {!showSidebar && (
                <div className="floating-user">
                    <i className="fas fa-user"></i>
                    <span className="user-name">{localStorage.getItem('userName')}</span>
                </div>
            )}
            
            {/* Main Content */}
            <div className="main-content">
                <div className="dashboard-header">
                    <h1 className="page-title">Tableau de bord</h1>
                    <div className="action-buttons">
                        <button className="btn btn-primary">
                            <i className="fas fa-bell btn-icon"></i>
                            Notifications
                        </button>
                    </div>
                </div>
                
                {/* First Row */}
                <div className="dashboard-row">
                    {/* Video Feed */}
                    <div id="video" className="card card-span-8">
                        <div className="card-header">
                            <h2 className="card-title">
                                <i className="fas fa-video card-title-icon"></i>
                                Flux vidéo en direct
                            </h2>
                            <span className="card-status">En direct</span>
                        </div>
                        <div className="card-body">
                            <div className="video-container">
                                {videos.length > 0 ? (
                                    <video 
                                        src={videos[0].url} 
                                        controls 
                                        className="gallery-img"
                                        poster={videos[0].thumbnail}
                                    />
                                ) : (
                                <img src="/api/placeholder/800/360" alt="Flux vidéo de l'incubateur" className="gallery-img" />
                                )}
                            </div>
                            <div className="video-controls">
                                <button className="video-control-btn">
                                    <i className="fas fa-expand"></i>
                                </button>
                                <button className="video-control-btn">
                                    <i className="fas fa-camera"></i>
                                </button>
                                <button className="video-control-btn">
                                    <i className="fas fa-volume-mute"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Vital Signs */}
                    <div id="vitals" className="card card-span-4">
                        <div className="card-header">
                            <h2 className="card-title">
                                <i className="fas fa-heartbeat card-title-icon"></i>
                                Paramètres vitaux
                            </h2>
                            <span className="card-status">Mis à jour il y a {lastUpdate}</span>
                        </div>
                        <div className="card-body">
                            <div className="vital-signs">
                                <div className="vital-sign">
                                    <div className="vital-sign-label">
                                        <i className="fas fa-temperature-high vital-sign-icon"></i>
                                        Température
                                    </div>
                                    <div className="vital-sign-value">
                                        {vitalSigns.temperature.value} <span className="vital-sign-unit">{vitalSigns.temperature.unit}</span>
                                    </div>
                                    <div className={`vital-sign-trend trend-${vitalSigns.temperature.trend}`}>
                                        <i className={`fas fa-${vitalSigns.temperature.trend === 'up' ? 'arrow-up' : vitalSigns.temperature.trend === 'down' ? 'arrow-down' : 'equals'} trend-icon`}></i>
                                        {vitalSigns.temperature.trend === 'stable' ? 'Stable' : vitalSigns.temperature.change > 0 ? `+${vitalSigns.temperature.change}` : vitalSigns.temperature.change}
                                    </div>
                                </div>
                                <div className="vital-sign">
                                    <div className="vital-sign-label">
                                        <i className="fas fa-heartbeat vital-sign-icon"></i>
                                        Fréquence cardiaque
                                    </div>
                                    <div className="vital-sign-value">
                                        {vitalSigns.heartRate.value} <span className="vital-sign-unit">{vitalSigns.heartRate.unit}</span>
                                    </div>
                                    <div className={`vital-sign-trend trend-${vitalSigns.heartRate.trend}`}>
                                        <i className={`fas fa-${vitalSigns.heartRate.trend === 'up' ? 'arrow-up' : vitalSigns.heartRate.trend === 'down' ? 'arrow-down' : 'equals'} trend-icon`}></i>
                                        {vitalSigns.heartRate.trend === 'stable' ? 'Stable' : vitalSigns.heartRate.change > 0 ? `+${vitalSigns.heartRate.change}` : vitalSigns.heartRate.change}
                                    </div>
                                </div>
                                <div className="vital-sign">
                                    <div className="vital-sign-label">
                                        <i className="fas fa-lungs vital-sign-icon"></i>
                                        Saturation O2
                                    </div>
                                    <div className="vital-sign-value">
                                        {vitalSigns.saturationO2.value} <span className="vital-sign-unit">{vitalSigns.saturationO2.unit}</span>
                                    </div>
                                    <div className={`vital-sign-trend trend-${vitalSigns.saturationO2.trend}`}>
                                        <i className={`fas fa-${vitalSigns.saturationO2.trend === 'up' ? 'arrow-up' : vitalSigns.saturationO2.trend === 'down' ? 'arrow-down' : 'equals'} trend-icon`}></i>
                                        {vitalSigns.saturationO2.trend === 'stable' ? 'Stable' : vitalSigns.saturationO2.change > 0 ? `+${vitalSigns.saturationO2.change}` : vitalSigns.saturationO2.change}
                                    </div>
                                </div>
                                <div className="vital-sign">
                                    <div className="vital-sign-label">
                                        <i className="fas fa-wind vital-sign-icon"></i>
                                        Respiration
                                    </div>
                                    <div className="vital-sign-value">
                                        {vitalSigns.respiration.value} <span className="vital-sign-unit">{vitalSigns.respiration.unit}</span>
                                    </div>
                                    <div className={`vital-sign-trend trend-${vitalSigns.respiration.trend}`}>
                                        <i className={`fas fa-${vitalSigns.respiration.trend === 'up' ? 'arrow-up' : vitalSigns.respiration.trend === 'down' ? 'arrow-down' : 'equals'} trend-icon`}></i>
                                        {vitalSigns.respiration.trend === 'stable' ? 'Stable' : vitalSigns.respiration.change > 0 ? `+${vitalSigns.respiration.change}` : vitalSigns.respiration.change}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <a href="#" className="resource-link">
                                <i className="fas fa-info-circle resource-icon"></i>
                                Comprendre ces paramètres
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* Second Row */}
                <div className="dashboard-row">
                    {/* Daily Updates */}
                    <div id="overview" className="card card-span-6">
                        <div className="card-header">
                            <h2 className="card-title">
                                <i className="fas fa-clipboard-list card-title-icon"></i>
                                Mises à jour du jour
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="daily-updates">
                                {dailyUpdates.map((update, index) => (
                                    <div className="update-item" key={index}>
                                        <div className="update-time">{update.time}</div>
                                        <div className="update-content">
                                            <div className="update-title">{update.title}</div>
                                            <div className="update-text">{update.text}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="card-footer">
                            <a href="#" className="resource-link">
                                <i className="fas fa-calendar-alt resource-icon"></i>
                                Voir l'historique complet
                            </a>
                        </div>
                    </div>
                    
                    {/* Message Center */}
                    <div id="messages" className="card card-span-6">
                        <div className="card-header">
                            <h2 className="card-title">
                                <i className="fas fa-comment-medical card-title-icon"></i>
                                Messagerie
                            </h2>
                        </div>
                        <div className="card-body">
                            <p>Envoyez un message à l'équipe médicale :</p>
                            <form className="message-form" onSubmit={handleMessageSubmit}>
                                <div className="form-group">
                                    <textarea 
                                        className="form-input" 
                                        placeholder="Tapez votre message ici..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    <i className="fas fa-paper-plane btn-icon"></i>
                                    Envoyer
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                
                {/* Third Row */}
                <div className="dashboard-row">
                    {/* Photos Gallery */}
                    <div id="photos" className="card card-span-6">
                        <div className="card-header">
                            <h2 className="card-title">
                                <i className="fas fa-images card-title-icon"></i>
                                Galerie de photos
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="photo-gallery">
                                {photos.length > 0 ? (
                                    photos.map((photo) => (
                                        <div key={photo.id} className="photo-item">
                                            <img src={photo.url} alt={photo.description || 'Photo du patient'} />
                                            <div className="photo-info">
                                                <span className="photo-date">{new Date(photo.date).toLocaleDateString()}</span>
                                                {photo.description && <p className="photo-description">{photo.description}</p>}
                                            </div>
                                    </div>
                                    ))
                                ) : (
                                    <p className="no-photos">Aucune photo disponible</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Videos Gallery */}
                    <div id="videos" className="card card-span-6">
                        <div className="card-header">
                            <h2 className="card-title">
                                <i className="fas fa-video card-title-icon"></i>
                                Galerie de vidéos
                            </h2>
                        </div>
                        <div className="card-body">
                            <div className="video-gallery">
                                {videos.length > 0 ? (
                                    videos.map((video) => (
                                        <div key={video.id} className="video-item">
                                            <video 
                                                src={video.url} 
                                                controls 
                                                poster={video.thumbnail}
                                            />
                                            <div className="video-info">
                                                <span className="video-date">{new Date(video.date).toLocaleDateString()}</span>
                                                {video.description && <p className="video-description">{video.description}</p>}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-videos">Aucune vidéo disponible</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;