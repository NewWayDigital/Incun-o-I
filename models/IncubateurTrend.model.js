const { DataTypes } = require('sequelize');
const db = require('../config/db');

const IncubateurTrend = db.define('IncubateurTrend', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  incubateurId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  temperature: {
    type: DataTypes.STRING,
    allowNull: false
  },
  heartRate: {
    type: DataTypes.STRING,
    allowNull: false
  },
  oxygenLevel: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = IncubateurTrend; 