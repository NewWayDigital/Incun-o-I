/**
 * Service de transformation de données
 * Convertit les données du backend au format attendu par les composants frontend
 */

import { calculerAge, formaterDate } from '../utils/dateUtils';

// Fonction pour transformer les données d'incubateur
export const transformIncubatorData = (backendData) => {
  if (!backendData || !Array.isArray(backendData)) return [];
  
  return backendData.map(incubateur => {
    // Déterminer le statut pour l'interface utilisateur en fonction de l'incubateur
    let status = incubateur.status || 'stable';

    // Vérifier si les données du patient sont incluses et si son statut doit remplacer celui de l'incubateur
    if (incubateur.patientData && incubateur.patientData.status) {
      const patientStatus = incubateur.patientData.status;
      if (patientStatus === 'warning') status = 'warning';
      if (patientStatus === 'critical') status = 'critical';
      if (patientStatus === 'alert') status = 'critical';
    }

    // Préserver les données patient
    const patientData = incubateur.patientData ? {
      ...incubateur.patientData,
      incubateur: incubateur.id.toString()
    } : null;

    console.log('Transformation des données incubateur:', {
      incubateurId: incubateur.id,
      patientName: incubateur.patient,
      hasPatientData: !!patientData,
      patientData
    });

    return {
      id: incubateur.id.toString(),
      model: incubateur.model || 'Incuneo-I Standard',
      location: incubateur.location || 'Non spécifié',
      status: status,
      patient: incubateur.patient || 'Non assigné',
      patientData: patientData, // Ajouter les données patient complètes
      saturationOxy: incubateur.saturationOxy || '95%',
      humidite: incubateur.humidite || '60%',
      temperature: incubateur.temperature || '37.0°C',
      lastMaintenance: incubateur.lastMaintenance || new Date().toLocaleDateString('fr-FR'),
      vitalSigns: {
        temperature: incubateur.temperature || '37.0°C',
        heartRate: `${incubateur.heartRate || 130} bpm`,
        oxygen: incubateur.saturationOxy || '95%'
      },
      details: {
        age: patientData?.dateNaissance ? calculerAge(patientData.dateNaissance) : 'N/A',
        weight: patientData?.poids || 'N/A',
        birthDate: patientData?.dateNaissance ? formaterDate(patientData.dateNaissance) : 'N/A',
        condition: patientData?.status || 'Stable',
        incubatorSettings: {
          temperature: incubateur.temperature || '37.0°C',
          humidity: incubateur.humidite || '60%',
          oxygenLevel: incubateur.saturationOxy?.replace('%', '') || '21%'
        },
        trends: incubateur.trends || []
      }
    };
  });
};

// Transformer les données de statistiques
export const transformStatsData = (incubateurs = [], patients = [], alertes = []) => {
  const nourrissonsCount = patients.length;
  const stablesCount = patients.filter(p => p.status === 'stable').length;
  const attentionCount = patients.filter(p => p.status === 'warning').length;
  const critiquesCount = alertes.filter(a => a.type === 'critical').length;

  return [
    { 
      icon: 'fas fa-baby', 
      value: nourrissonsCount.toString(), 
      label: 'Nourrissons en surveillance', 
      color: 'rgba(52, 152, 219, 0.1)', 
      textColor: 'var(--primary-color)' 
    },
    { 
      icon: 'fas fa-check-circle', 
      value: stablesCount.toString(), 
      label: 'Paramètres stables', 
      color: 'rgba(46, 204, 113, 0.1)', 
      textColor: 'var(--secondary-color)' 
    },
    { 
      icon: 'fas fa-exclamation-triangle', 
      value: attentionCount.toString(), 
      label: 'Nécessitent attention', 
      color: 'rgba(243, 156, 18, 0.1)', 
      textColor: 'var(--warning-color)' 
    },
    { 
      icon: 'fas fa-bell', 
      value: critiquesCount.toString(), 
      label: 'Alertes critiques', 
      color: 'rgba(231, 76, 60, 0.1)', 
      textColor: 'var(--danger-color)' 
    }
  ];
};

// Transformer les données de patients
export const transformPatientData = (backendData) => {
  if (!backendData || !Array.isArray(backendData)) return [];
  
  return backendData.map(patient => {
    return {
      id: patient.id.toString(),
      nom: patient.nom,
      dateNaissance: patient.dateNaissance,
      sexe: patient.sexe,
      poids: patient.poids,
      taille: patient.taille,
      incubateur: patient.incubateur,
      status: patient.status || 'stable',
      parent: patient.parent,
      telephone: patient.telephone,
      email: patient.email,
      adresse: patient.adresse,
      groupeSanguin: patient.groupeSanguin,
      allergies: patient.allergies,
      noteMedicale: patient.noteMedicale,
      antecedents: patient.antecedents,
      // Données pour les constantes vitales (si disponibles)
      constantesVitales: patient.ConstanteVitales || []
    };
  });
};

// Transformer les données des constantes vitales en alertes
export const transformConstantesToAlerts = (constantes) => {
  if (!constantes || !Array.isArray(constantes)) return [];
  
  // Trier par date (plus récent en premier)
  const sortedConstantes = [...constantes].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  return sortedConstantes.map(constante => {
    // Déterminer le type d'alerte
    let type = 'info';
    let title = 'Mise à jour des paramètres';
    
    // Vérifier si la température est anormale
    const temp = parseFloat(constante.temperature);
    if (temp > 37.5) {
      type = 'warning';
      title = `Température élevée - ${constante.PatientId}`;
      if (temp > 38.0) {
        type = 'critical';
      }
    }
    
    // Calculer le temps écoulé
    const elapsedTime = getElapsedTimeText(new Date(constante.date));
    
    return {
      type,
      title,
      time: elapsedTime,
      incubator: constante.IncubateurId || 'N/A',
      date: constante.date,
      temperature: constante.temperature,
      pouls: constante.pouls,
      respiration: constante.respiration,
      poids: constante.poids,
      humiditeCorp: constante.humiditeCorp
    };
  });
};

// Fonction utilitaire pour calculer le temps écoulé
const getElapsedTimeText = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) {
    return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
  }
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  }
  
  const diffDays = Math.floor(diffHours / 24);
  return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
}; 