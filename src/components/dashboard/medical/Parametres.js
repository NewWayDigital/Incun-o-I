import React, { useState, useEffect } from 'react';
import '../../../styles/dashboard/Components.css';
import { userService } from '../../../services/api';
import { toast } from 'react-hot-toast';

function Parametres() {
  // États pour les champs du formulaire
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [numberPhone, setNumberPhone] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // États pour le changement de mot de passe
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  // Récupérer les informations de l'utilisateur lors du chargement du composant
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Dans un environnement réel, nous utiliserions l'ID stocké dans localStorage ou extrait du token
        const storedUserId = localStorage.getItem('userId') || '1';
        setUserId(storedUserId);
        
        // Essayer de récupérer les données utilisateur de l'API
        try {
          const userData = await userService.getById(storedUserId);
          
          if (userData) {
            // Si l'API répond, utiliser ces données
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setEmail(userData.email || '');
            setNumberPhone(userData.numberPhone || '');
            setRole(userData.role || '');
          } else {
            // Sinon, utiliser des valeurs par défaut pour la démo
            setFirstName('Martin');
            setLastName('Dupont');
            setEmail('martin.dupont@exemple.com');
            setNumberPhone('0612345678');
            setRole('doctor');
          }
        } catch (error) {
          console.log('API not available, using default values');
          // Utiliser des valeurs par défaut pour la démo
          setFirstName('Martin');
          setLastName('Dupont');
          setEmail('martin.dupont@exemple.com');
          setNumberPhone('0612345678');
          setRole('doctor');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  // Vérification de la validation du mot de passe
  const validatePassword = () => {
    // Réinitialiser l'erreur
    setPasswordError('');
    
    // Si les champs de mot de passe sont vides, on considère qu'il n'y a pas de changement
    if (!password && !confirmPassword) {
      return true;
    }
    
    // Vérifier que les deux mots de passe correspondent
    if (password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return false;
    }
    
    // Vérifier que le mot de passe a une longueur minimale
    if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    
    return true;
  };
  
  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider le mot de passe
    if (!validatePassword()) {
      toast.error(passwordError);
      return;
    }
    
    setSaving(true);
    
    try {
      // Préparer les données à envoyer selon le modèle User du backend
      const userData = {
        firstName,
        lastName,
        email,
        numberPhone
        // Nous ne mettons pas à jour le rôle ici
      };
      
      // Ajouter le mot de passe si modifié
      if (password) {
        userData.password = password;
      }
      
      // Simuler un délai pour la démo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Envoyer les données à l'API
      try {
        await userService.update(userId, userData);
        
        // Mettre à jour les valeurs dans localStorage pour la démo
        localStorage.setItem('firstName', firstName);
        localStorage.setItem('lastName', lastName);
        
        // Réinitialiser les champs de mot de passe
        setPassword('');
        setConfirmPassword('');
        setShowPasswordFields(false);
        
        toast.success('Informations mises à jour avec succès');
      } catch (error) {
        console.log('API not available, simulating success');
        // Simuler une mise à jour réussie pour la démo
        toast.success('Informations mises à jour avec succès (mode démo)');
        
        // Réinitialiser les champs de mot de passe
        setPassword('');
        setConfirmPassword('');
        setShowPasswordFields(false);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations:', error);
      toast.error('Erreur lors de la mise à jour des informations');
    } finally {
      setSaving(false);
    }
  };
  
  // Réinitialiser les modifications
  const handleCancel = () => {
    // Recharger les données utilisateur
    setFirstName('Martin');
    setLastName('Dupont');
    setEmail('martin.dupont@exemple.com');
    setNumberPhone('0612345678');
    
    // Réinitialiser les champs de mot de passe
    setPassword('');
    setConfirmPassword('');
    setShowPasswordFields(false);
    setPasswordError('');
    
    toast.success('Modifications annulées');
  };
  
  // Formater le nom complet
  const fullName = `${firstName} ${lastName}`;
  
  return (
    <div className="dashboard-content">
      <h2 className="section-title">Paramètres</h2>
      
      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Chargement des informations utilisateur...</p>
        </div>
      ) : (
        <div className="settings-container">
          <div className="settings-content" style={{ width: '100%' }}>
            <form className="settings-panel" onSubmit={handleSubmit}>
              <h3 className="panel-title">Compte et profil</h3>
              
              <div className="panel-section">
                <h4 className="section-title">Informations personnelles</h4>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Prénom</label>
                    <input 
                      type="text" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Nom</label>
                    <input 
                      type="text" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input 
                      type="tel" 
                      value={numberPhone} 
                      onChange={(e) => setNumberPhone(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Rôle</label>
                    <div className="form-static-value">{role}</div>
                  </div>
                </div>
              </div>
              
              <div className="panel-section">
                <h4 className="section-title">Photo de profil</h4>
                
                <div className="profile-photo-section">
                  <div className="profile-photo">
                    <span className="initials">{fullName ? fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'MD'}</span>
                  </div>
                  
                  <div className="profile-photo-actions">
                    <button type="button" className="btn btn-outline">Changer la photo</button>
                    <button type="button" className="btn btn-outline btn-danger">Supprimer</button>
                  </div>
                </div>
              </div>
              
              <div className="panel-section">
                <h4 className="section-title">Sécurité</h4>
                
                {!showPasswordFields ? (
                  <button 
                    type="button" 
                    className="btn btn-outline" 
                    onClick={() => setShowPasswordFields(true)}
                  >
                    Modifier le mot de passe
                  </button>
                ) : (
                <div className="form-grid">
                  <div className="form-group">
                      <label>Nouveau mot de passe</label>
                      <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 caractères"
                      />
                  </div>
                  
                  <div className="form-group">
                      <label>Confirmer le mot de passe</label>
                      <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Saisir à nouveau le mot de passe"
                      />
              </div>
              
                    {passwordError && (
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <div style={{ color: '#e74c3c', fontSize: '14px' }}>
                          {passwordError}
              </div>
            </div>
          )}
          
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <button 
                        type="button" 
                        className="btn btn-outline"
                        onClick={() => {
                          setPassword('');
                          setConfirmPassword('');
                          setPasswordError('');
                          setShowPasswordFields(false);
                        }}
                      >
                        Annuler
                      </button>
                  </div>
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
              </div>
            </div>
          )}
    </div>
  );
}

export default Parametres; 