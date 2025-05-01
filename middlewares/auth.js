const jwt = require('jsonwebtoken');
const ENV = require('../config');
const createError = require('./error');

const verifieToken = (req, res, next) => { 
  console.log('Vérification du token');
  console.log('Cookies:', req.cookies);
  console.log('Headers:', req.headers);

  // Récupérer le token depuis les cookies ou les headers
  let token = req.cookies.access_token;
  
  // Si pas de token dans les cookies, essayer de le récupérer des headers
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('Token extrait des headers:', token);
    }
  }

  console.log('Token trouvé:', token ? 'Oui' : 'Non');

  // Renvoie une erreur 401 (accès refusé)
  if(!token) {
    console.log('Erreur: Token non trouvé');
    return next(createError(401, "Acces Denied !"))
  }

  // Vérifier la validité du jeton en utilisant jwt.verify
  jwt.verify(token, ENV.TOKEN, (err, user ) => {
    if(err) {
      console.log('Erreur de vérification du token:', err.message);
      return next(createError(403, "Token non valide !!", err.message))
    }

    console.log('Token valide, utilisateur:', user);
    req.user = user
    next();
  })
}

module.exports = verifieToken;