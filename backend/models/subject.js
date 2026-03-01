'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    static associate(models) {
      Subject.belongsTo(models.Department, { foreignKey: 'department_id' });
      Subject.belongsTo(models.User, { foreignKey: 'teacher_id' });
      Subject.hasMany(models.Class, { foreignKey: 'subject_id' });
    }
  }
  Subject.init({
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    department_id: DataTypes.INTEGER,
    teacher_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Subject',
  });
  return Subject;
};