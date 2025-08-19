import axios from 'axios';
import { getBaseURL } from '../config/api';

// Configuration de l'instance axios pour les appels API
const baseURL = getBaseURL();
console.log('🔧 Configuration API:', {
  environment: process.env.NODE_ENV,
  baseURL: baseURL,
  apiUrl: process.env.REACT_APP_API_URL
});

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log('Token trouvé dans localStorage:', token ? 'Oui' : 'Non');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token ajouté aux headers:', `Bearer ${token}`);
    } else {
      console.log('Aucun token trouvé dans localStorage');
    }
    return config;
  },
  error => {
    console.error('Erreur dans l\'intercepteur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Le serveur a répondu avec un statut d'erreur
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      return Promise.reject({ message: 'Erreur de connexion au serveur' });
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      return Promise.reject({ message: 'Erreur lors de la configuration de la requête' });
    }
  }
);

// Services API pour les incubateurs
export const incubateurService = {
  getAll: async () => {
    try {
      const response = await api.get('/incubateur');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des incubateurs:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/incubateur/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'incubateur ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/incubateur', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'incubateur:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/incubateur/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'incubateur ${id}:`, error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/incubateur/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'incubateur ${id}:`, error);
      throw error;
    }
  }
};

// Services API pour les patients
export const patientService = {
  getAll: async () => {
    try {
      const response = await api.get('/patient');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des patients:', error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/patient/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du patient ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/patient', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du patient:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/patient/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du patient ${id}:`, error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/patient/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du patient ${id}:`, error);
      throw error;
    }
  }
};

// Services API pour les constantes vitales
export const constanceVitaleService = {
  getByPatient: async (patientId) => {
    try {
      console.log("API Service: Appel à /constance/patient/" + patientId);
      const response = await api.get(`/constance/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des constantes vitales du patient ${patientId}:`, error);
      throw error;
    }
  },
  add: async (patientId, data) => {
    try {
      const response = await api.post(`/constance/${patientId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'ajout d'une constante vitale pour le patient ${patientId}:`, error);
      throw error;
    }
  },
  update: async (constanteId, data) => {
    try {
      const response = await api.put(`/constance/${constanteId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la constante vitale ${constanteId}:`, error);
      throw error;
    }
  },
  delete: async (constanteId) => {
    try {
      const response = await api.delete(`/constance/${constanteId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la constante vitale ${constanteId}:`, error);
      throw error;
    }
  }
};

// Services API pour les traitements
export const traitementService = {
  getByPatient: async (patientId) => {
    try {
      const response = await api.get(`/patient/${patientId}/traitements`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des traitements du patient ${patientId}:`, error);
      throw error;
    }
  },
  add: async (patientId, data) => {
    try {
      const response = await api.post(`/patient/${patientId}/traitements`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'ajout d'un traitement pour le patient ${patientId}:`, error);
      throw error;
    }
  },
  update: async (traitementId, data) => {
    try {
      const response = await api.put(`/traitement/${traitementId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du traitement ${traitementId}:`, error);
      throw error;
    }
  },
  delete: async (traitementId) => {
    try {
      const response = await api.delete(`/traitement/${traitementId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du traitement ${traitementId}:`, error);
      throw error;
    }
  }
};

// Services API pour les alertes
export const alerteService = {
  getAll: async () => {
    try {
      const response = await api.get('/alerte');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/alerte', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'alerte:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/alerte/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'alerte ${id}:`, error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/alerte/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'alerte ${id}:`, error);
      throw error;
    }
  }
};

// Services API pour les utilisateurs
export const userService = {
  // Récupérer les informations de l'utilisateur par son ID
  getById: async (id) => {
    try {
      // La route individuelle n'existe pas, donc nous récupérons tous les utilisateurs
      // et filtrons celui avec l'ID correspondant
      const response = await api.get('/user/all');
      const users = response.data;
      const user = users.find(u => u.id == id);
      
      if (!user) {
        throw new Error(`Utilisateur avec ID ${id} non trouvé`);
      }
      
      return user;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      throw error;
    }
  },
  // Récupérer les informations de l'utilisateur actuel (basé sur le token)
  getCurrentUser: async () => {
    try {
      // Cette fonctionnalité n'est pas implémentée dans le backend
      // On pourrait utiliser le token stocké pour obtenir l'ID et appeler getById
      // Pour l'instant, on lance une erreur
      throw new Error('Fonctionnalité getCurrentUser non disponible');
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
      throw error;
    }
  },
  // Mettre à jour les informations de l'utilisateur
  update: async (id, data) => {
    try {
      const response = await api.put(`/user/update/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
      throw error;
    }
  },
  // Mettre à jour les préférences de l'utilisateur (langue, fuseau horaire, etc.)
  updatePreferences: async (id, preferences) => {
    try {
      // Cette route n'existe pas spécifiquement, nous utilisons la route de mise à jour générale
      const response = await api.put(`/user/update/${id}`, { preferences });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour des préférences de l'utilisateur ${id}:`, error);
      throw error;
    }
  }
};

// Services API pour les tendances d'incubateurs
export const incubateurTrendService = {
  getByIncubateurId: async (incubateurId) => {
    try {
      const response = await api.get(`/incubateur/${incubateurId}/trends`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des tendances de l'incubateur ${incubateurId}:`, error);
      throw error;
    }
  },
  add: async (incubateurId, data) => {
    try {
      const response = await api.post(`/incubateur/${incubateurId}/trends`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'ajout d'une tendance pour l'incubateur ${incubateurId}:`, error);
      throw error;
    }
  }
};

// Services API pour les photos
export const photoService = {
  getAll: async () => {
    try {
      const response = await api.get('/photos');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des photos:', error);
      throw error;
    }
  },
  getByPatientId: async (patientId) => {
    try {
      const response = await api.get(`/photos/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des photos du patient ${patientId}:`, error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/photos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la photo ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/photos', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la photo:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/photos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la photo ${id}:`, error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/photos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la photo ${id}:`, error);
      throw error;
    }
  }
};

// Services API pour les vidéos
export const videoService = {
  getAll: async () => {
    try {
      const response = await api.get('/videos');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des vidéos:', error);
      throw error;
    }
  },
  getByPatientId: async (patientId) => {
    try {
      const response = await api.get(`/videos/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des vidéos du patient ${patientId}:`, error);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/videos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la vidéo ${id}:`, error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/videos', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la vidéo:', error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/videos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la vidéo ${id}:`, error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/videos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la vidéo ${id}:`, error);
      throw error;
    }
  }
};

export { api };
export default api; 