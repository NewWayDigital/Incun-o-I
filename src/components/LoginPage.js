// src/pages/LoginPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import "../styles/Login.css"; 

function LoginPage() {
  const [userType, setUserType] = useState('parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs obligatoires');
      setIsLoading(false);
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      setIsLoading(false);
      return;
    }

    try {
      const response = await login(email, password, userType);

      if (response.success) {
        // Rediriger vers le dashboard approprié
        switch (userType) {
          case 'doctor':
            navigate('/medical/dashboard');
            break;
          case 'parent':
            navigate('/dashboard-parent');
            break;
          case 'admin':
            navigate('/dashboard-admin');
            break;
          default:
            setError('Type d\'utilisateur invalide');
        }
      }
    } catch (error) {
      setError(error.message || 'Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="landing-image">
        <div className="image-overlay"></div>
        <div className="brand-container">
          <div className="brand-logo">
            <i className="fas fa-baby"></i>
          </div>
          <h1 className="brand-name">IncuNeo-I</h1>
          <p className="brand-tagline">Système de surveillance avancé pour incubateurs néonatals</p>
        </div>
      </div>

      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h2 className="login-title">Connexion</h2>
            <p className="login-subtitle">Accédez à votre espace sécurisé</p>
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <div className="user-type-selector">
            {['doctor', 'parent', 'admin'].map((type) => (
              <button
                key={type}
                className={`user-type-btn ${userType === type ? 'active' : ''}`}
                onClick={() => handleUserTypeChange(type)}
              >
                <i className={`fas ${
                  type === 'doctor' ? 'fa-user-md' :
                  type === 'parent' ? 'fa-users' : 'fa-cog'
                }`}></i>
                {type === 'doctor' && ' Personnel médical'}
                {type === 'parent' && ' Parents'}
                {type === 'admin' && ' Admin'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre adresse email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>

            {userType === 'doctor' && (
              <div className="form-group">
                <label htmlFor="twoFactorCode">Code à deux facteurs</label>
                <input
                  type="text"
                  id="twoFactorCode"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="Entrez le code 2FA (optionnel)"
                />
              </div>
            )}

            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
