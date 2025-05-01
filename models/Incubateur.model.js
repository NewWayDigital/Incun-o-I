const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Incubateur = db.define('Incubateur', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    patient: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:{msg:'le patient existe déjà pour un autre incubateur'}
    },
    lastMaintenance: {
      type: DataTypes.STRING},
  saturationOxy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  humidite: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  temperature: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status:{
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Incubateur;
