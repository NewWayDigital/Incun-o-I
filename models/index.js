const db= require('../config/db')

//Importer les modeles
const User= require('./User.model')
const Patient = require('./Patient.model');
const Traitement = require('./Traitement.model');
const ConstanteVitale = require('./constanceVitale.model');
const Incubateur= require('./Incubateur.model')
const Alerte = require('./Alerte.model');
const IncubateurTrend = require('./IncubateurTrend.model');
const Photo = require('./Photo.model');
const Video = require('./Video.model');

//Définir les relations entre les models

// Relations User-Patient
User.belongsTo(Patient, { foreignKey: 'patientId' });
Patient.hasOne(User, { foreignKey: 'patientId' });

// Relations Patient-Traitement
Patient.hasMany(Traitement, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Traitement.belongsTo(Patient, { foreignKey: 'patientId' });

// Relations Patient-ConstanteVitale
Patient.hasMany(ConstanteVitale, { foreignKey: 'patientId', onDelete: 'CASCADE' });
ConstanteVitale.belongsTo(Patient, { foreignKey: 'patientId' });

// Relations Incubateur-Patient (correction)
// Un patient est associé à un incubateur (si disponible)
// Commenté temporairement car la colonne incubateurId n'existe pas dans la table Patient
// Patient.belongsTo(Incubateur, { foreignKey: 'incubateurId' });
// Un incubateur peut avoir un patient assigné
// Incubateur.hasOne(Patient, { foreignKey: 'incubateurId' });

// Relation temporaire utilisant le champ 'incubateur' existant
// Notez que cela ne crée pas de contrainte de clé étrangère

// Relations Patient-Alerte
Patient.hasMany(Alerte, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Alerte.belongsTo(Patient, { foreignKey: 'patientId' });

// Relations Incubateur-IncubateurTrend
Incubateur.hasMany(IncubateurTrend, { foreignKey: 'incubateurId', onDelete: 'CASCADE' });
IncubateurTrend.belongsTo(Incubateur, { foreignKey: 'incubateurId' });

// Relations Patient-Photo
Patient.hasMany(Photo, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Photo.belongsTo(Patient, { foreignKey: 'patientId' });

// Relations Patient-Video
Patient.hasMany(Video, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Video.belongsTo(Patient, { foreignKey: 'patientId' });

//Exporter tous les modeles
module.exports ={
    db,
    User,
    Patient,
    Traitement,
    ConstanteVitale,
    Incubateur,
    Alerte,
    IncubateurTrend,
    Photo,
    Video
}

// Relations



