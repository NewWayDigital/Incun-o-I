const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Patient = db.define('Patient', {
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement:true
},
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Le nom est requis" }
    }
  },
  dateNaissance: DataTypes.STRING,
  sexe: {
    type: DataTypes.STRING,
    validate: {
      isIn: {
        args: [['Masculin', 'Féminin']],
        msg: "Le sexe doit être 'Masculin' ou 'Féminin'"
      }
    }
  },
  poids: DataTypes.STRING,
  taille: DataTypes.STRING,
  incubateur: DataTypes.STRING,
  status: DataTypes.STRING,
  parent: DataTypes.STRING,
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  telephone: {
    type: DataTypes.STRING,
    validate: {
      isNumeric: { msg: "Format numérique requis pour le téléphone" }
    }
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: { msg: "Email invalide" }
    }
  },
  adresse: DataTypes.STRING,
  groupeSanguin: DataTypes.STRING,
  allergies: DataTypes.STRING,
  noteMedicale: DataTypes.TEXT,
  antecedents: DataTypes.TEXT,
}, {
  timestamps: true
});

module.exports = Patient;
