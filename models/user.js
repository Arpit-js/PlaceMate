// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sqlite');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  passwordHash: { type: DataTypes.STRING }
});

module.exports = User;
