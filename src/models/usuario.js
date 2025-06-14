const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // importa o sequelize corretamente

class Usuario extends Model {}

Usuario.init({
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize, // instancia do sequelize
  modelName: 'Usuario',
  tableName: 'usuarios', // opcional, defina o nome da tabela se quiser
  timestamps: false // defina se não tem createdAt, updatedAt
});

module.exports = Usuario;
