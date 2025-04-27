import "../styles/Landing.css";
import imgIncu from "../assets/téléchargement.jpeg"
// src/pages/LandingPage.js
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div>
      <header className="header">
        <nav className="navbar">
          <div className="logo">
            <i className="fas fa-baby"></i>
            <span className="logo-text">IncuNeo-I</span>
          </div>
          <ul className="nav-links">
            <li><a href="#features">Fonctionnalités</a></li>
            <li><a href="#about">À propos</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><Link to="/login" className="btn-login">Connexion</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Surveillance Médicale Intelligente</h1>
            <p>Un système avancé de monitoring pour incubateurs néonatals, conçu pour protéger et suivre les nouveau-nés.</p>
            <div className="hero-cta">
              <a href="#features" className="btn btn-primary">Découvrir</a>
              <Link to="/login" className="btn btn-secondary">Se Connecter</Link>
            </div>
          </div>
          <div className="hero-image">
            <img src={imgIncu} alt="Incubateur néonatal" />
          </div>
        </section>

        <section id="features" className="features">
          <h2>Nos Fonctionnalités Principales</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <i className="fas fa-heartbeat"></i>
              <h3>Monitoring en Temps Réel</h3>
              <p>Suivi constant des paramètres vitaux des nouveau-nés.</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-temperature-low"></i>
              <h3>Contrôle Thermique</h3>
              <p>Maintien précis de la température optimale.</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-mobile-alt"></i>
              <h3>Accès Mobile</h3>
              <p>Surveillance à distance via notre application.</p>
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <div className="about-content">
            <h2>Notre Mission</h2>
            <p>IncuNeo-I est né de la volonté de fournir aux familles et aux professionnels de santé un outil technologique de pointe pour accompagner les nouveau-nés les plus fragiles.</p>
            <p>Notre système combine précision médicale et compassion technologique.</p>
          </div>
        </section>

        <section id="contact" className="contact">
          <h2>Contactez-nous</h2>
          <form className="contact-form">
            <input type="text" placeholder="Votre nom" required />
            <input type="email" placeholder="Votre email" required />
            <textarea placeholder="Votre message" required></textarea>
            <button type="submit" className="btn btn-primary">Envoyer</button>
          </form>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <p>&copy; 2024 IncuNeo-I. Tous droits réservés.</p>
          <div className="footer-links">
            <a href="#">Mentions légales</a>
            <a href="#">Politique de confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default Landing
