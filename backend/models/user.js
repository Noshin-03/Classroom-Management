'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Subject, { foreignKey: 'teacher_id' });
      User.hasMany(models.Enrollment, { foreignKey: 'student_id' });
      User.hasMany(models.Department, { foreignKey: 'created_by' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};