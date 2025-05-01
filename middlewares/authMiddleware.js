const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ENV = require('../config');

// Middleware pour vérifier le token JWT
exports.verifyToken = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token d\'authentification manquant' });
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier le token avec la même clé secrète que auth.js
    const decoded = jwt.verify(token, ENV.TOKEN);
    
    // Récupérer l'utilisateur associé au token
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    
    // Ajouter l'utilisateur à la requête pour l'utiliser dans les routes
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
  }
};

// Middleware pour vérifier si l'utilisateur est un parent
exports.isParent = (req, res, next) => {
  if (req.user && req.user.userType === 'parent') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Accès non autorisé. Réservé aux parents.' });
  }
};

// Middleware pour vérifier si l'utilisateur est un personnel médical
exports.isMedical = (req, res, next) => {
  if (req.user && req.user.userType === 'doctor') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Accès non autorisé. Réservé au personnel médical.' });
  }
};

// Middleware pour vérifier si l'utilisateur est un administrateur
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.userType === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Accès non autorisé. Réservé aux administrateurs.' });
  }
}; 