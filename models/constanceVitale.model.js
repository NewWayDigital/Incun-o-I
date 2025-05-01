const { DataTypes } = require('sequelize');
const db = require('../config/db');

const ConstanteVitale = db.define('ConstanteVitale', {
  date: DataTypes.STRING,
  temperature: DataTypes.STRING,
  pouls: DataTypes.STRING,
  respiration: DataTypes.STRING,
  poids: DataTypes.STRING,
  humiditeCorp: DataTypes.STRING,
  saturationO2: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isNumeric: { msg: "La saturation en oxygène doit être un nombre" }
    }
  }
}, {
  timestamps: true
});

module.exports = ConstanteVitale;
