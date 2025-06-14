// src/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
