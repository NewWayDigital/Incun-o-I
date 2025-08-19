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
  // Vérifier si on est en production (déployé)
  const isProduction = window.location.hostname !== 'localhost' && 
                      window.location.hostname !== '127.0.0.1' &&
                      !window.location.hostname.includes('localhost');
  
  const env = isProduction ? 'production' : (process.env.NODE_ENV || 'development');
  console.log('🔧 Environnement détecté:', {
    hostname: window.location.hostname,
    isProduction: isProduction,
    nodeEnv: process.env.NODE_ENV,
    finalEnv: env
  });
  
  return API_CONFIG[env] || API_CONFIG.development;
};

// URL de base de l'API
export const getBaseURL = () => {
  const baseURL = getApiConfig().baseURL;
  console.log('🔧 URL de base de l\'API:', baseURL);
  return baseURL;
};

export default API_CONFIG;
