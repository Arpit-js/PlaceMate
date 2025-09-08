const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');


const User = sequelize.define('User', {
id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
email: { type: DataTypes.STRING, unique: true, allowNull: false },
name: { type: DataTypes.STRING },
passwordHash: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false });


module.exports = User;