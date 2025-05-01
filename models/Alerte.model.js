const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Alerte = db.define('Alerte', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: {
        args: [['info', 'warning', 'critical']],
        msg: "Le type doit être 'info', 'warning' ou 'critical'"
      }
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time: DataTypes.STRING,
  incubator: DataTypes.STRING,
  date: DataTypes.DATE,
  temperature: DataTypes.STRING,
  pouls: DataTypes.STRING,
  respiration: DataTypes.STRING,
  poids: DataTypes.STRING,
  humiditeCorp: DataTypes.STRING,
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = Alerte; 