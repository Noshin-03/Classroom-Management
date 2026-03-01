'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      Class.belongsTo(models.Subject, { foreignKey: 'subject_id' });
      Class.hasMany(models.Enrollment, { foreignKey: 'class_id' });
    }
  }
  Class.init({
    name: DataTypes.STRING,
    subject_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Class',
  });
  return Class;
};