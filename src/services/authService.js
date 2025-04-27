import api from './api';

export const login = async (email, password, userType) => {
  try {
    const response = await api.post('/user/sign', {
      email,
      password,
      userType
    });

    console.log('Réponse de connexion:', response.data);

    if (response.data.success) {
      console.log('Token reçu:', response.data.token);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userName', (response.data.user.lastName + ' ' + response.data.user.firstName));
      
      // Si l'utilisateur est un parent, stocker le patientId
      if (userType === 'parent' && response.data.user.patientId) {
        console.log('PatientId stocké:', response.data.user.patientId);
        localStorage.setItem('patientId', response.data.user.patientId);
      }
      
      // Vérifier que tout est bien stocké
      console.log('Vérification du stockage:',{
        token: localStorage.getItem('token'),
        userType: localStorage.getItem('userType'),
        userName: localStorage.getItem('userName'),
        patientId: localStorage.getItem('patientId')
      });
      
      return response.data;
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};

export const logout = () => {
  // Supprimer les informations d'authentification du localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  localStorage.removeItem('userName');
  localStorage.removeItem('patientId');
};

// Gestionnaire pour la fermeture du navigateur
export const setupBeforeUnloadHandler = () => {
  window.addEventListener('beforeunload', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('patientId');
  });
}; 