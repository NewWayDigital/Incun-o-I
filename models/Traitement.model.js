const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Traitement = db.define('Traitement', {
  medicament: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  frequence: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  medecin: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true
});

module.exports = Traitement;
