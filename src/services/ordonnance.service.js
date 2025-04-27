import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Service pour les ordonnances (traitements côté backend)
const ordonnanceService = {
  // Récupérer toutes les ordonnances d'un patient
  getByPatient: async (patientId) => {
    try {
      // Utilisation de la route patient existante qui inclut déjà les traitements
      const response = await axios.get(`${API_URL}/patient/${patientId}`);
      // Extraction des traitements du patient
      return response.data.Traitements || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des ordonnances du patient ${patientId}:`, error);
      throw error;
    }
  },

  // Ajouter une nouvelle ordonnance
  add: async (patientId, data) => {
    try {
      const response = await axios.post(`${API_URL}/traitement/${patientId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'ajout d'une ordonnance pour le patient ${patientId}:`, error);
      throw error;
    }
  },

  // Ajouter plusieurs médicaments/traitements en même temps
  addMultiple: async (patientId, ordonnances) => {
    try {
      console.log("Service addMultiple - patientId:", patientId);
      console.log("Service addMultiple - ordonnances à envoyer:", ordonnances);
      
      // Vérifier si ordonnances est un tableau, sinon le convertir
      const dataToSend = Array.isArray(ordonnances) ? ordonnances : [ordonnances];
      
      const response = await axios.post(`${API_URL}/traitement/multiple/${patientId}`, dataToSend);
      console.log("Service addMultiple - Réponse du backend:", response.data);
      return response.data;
    } catch (error) {
      console.error("Service addMultiple - Erreur détaillée:", error);
      if (error.response) {
        console.error("Détails de l'erreur:", error.response.data);
      }
      throw error;
    }
  },

  // Mettre à jour une ordonnance existante
  update: async (traitementId, data) => {
    try {
      const response = await axios.put(`${API_URL}/traitement/${traitementId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'ordonnance ${traitementId}:`, error);
      throw error;
    }
  },

  // Supprimer une ordonnance
  delete: async (traitementId) => {
    try {
      const response = await axios.delete(`${API_URL}/traitement/${traitementId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'ordonnance ${traitementId}:`, error);
      throw error;
    }
  }
};

export default ordonnanceService; 