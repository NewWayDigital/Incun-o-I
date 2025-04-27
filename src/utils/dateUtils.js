/**
 * Utilitaires pour la gestion des dates
 */

/**
 * Calcule l'âge en jours, mois ou années d'une date de naissance
 * @param {string|Date} dateNaissance - Date de naissance au format ISO ou objet Date
 * @returns {string} - Âge formaté (ex: "5 jours", "3 mois", "2 ans")
 */
export const calculerAge = (dateNaissance) => {
  if (!dateNaissance) return 'N/A';
  
  try {
    const dateNaissanceObj = new Date(dateNaissance);
    const maintenant = new Date();
    
    // Calcul de la différence en millisecondes
    const differenceMs = maintenant - dateNaissanceObj;
    
    // Conversion en jours
    const differenceJours = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    
    // Formats selon l'âge
    if (differenceJours < 31) {
      return `${differenceJours} jour${differenceJours > 1 ? 's' : ''}`;
    } else if (differenceJours < 365) {
      const mois = Math.floor(differenceJours / 30.44); // Moyenne de jours par mois
      return `${mois} mois`;
    } else {
      const annees = Math.floor(differenceJours / 365.25); // Prise en compte des années bissextiles
      return `${annees} an${annees > 1 ? 's' : ''}`;
    }
  } catch (error) {
    console.error('Erreur lors du calcul de l\'âge:', error);
    return 'N/A';
  }
};

/**
 * Formate une date au format français (JJ/MM/AAAA)
 * @param {string|Date} date - Date au format ISO ou objet Date
 * @returns {string} - Date formatée
 */
export const formaterDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error);
    return '';
  }
};

/**
 * Formate une date avec l'heure au format français
 * @param {string|Date} date - Date au format ISO ou objet Date
 * @returns {string} - Date et heure formatées
 */
export const formaterDateHeure = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Erreur lors du formatage de la date et heure:', error);
    return '';
  }
}; 