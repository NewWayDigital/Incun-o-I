// Configuration des URLs d'API selon l'environnement
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000/api',
  },
  production: {
    // URL de votre backend Railway
    baseURL: process.env.REACT_APP_API_URL || 'https://incun-o-i-production.up.railway.app/api',
  },
  test: {
    baseURL: 'http://localhost:3000/api',
  }
};

// Fonction pour obtenir la configuration selon l'environnement
export const getApiConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return API_CONFIG[env] || API_CONFIG.development;
};

// URL de base de l'API
export const getBaseURL = () => {
  return getApiConfig().baseURL;
};

export default API_CONFIG;
