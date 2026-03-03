'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    static associate(models) {
      Assignment.belongsTo(models.Class, { foreignKey: 'class_id' });
      Assignment.belongsTo(models.User, { foreignKey: 'teacher_id' });
      Assignment.hasMany(models.Submission, { foreignKey: 'assignment_id' });
    }
  }
  Assignment.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    due_date: DataTypes.DATE,
    points: DataTypes.INTEGER,
    class_id: DataTypes.INTEGER,
    teacher_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Assignment',
  });
  return Assignment;
};