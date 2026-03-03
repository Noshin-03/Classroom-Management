'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    static associate(models) {
      Submission.belongsTo(models.Assignment, { foreignKey: 'assignment_id' });
      Submission.belongsTo(models.User, { foreignKey: 'student_id' });
    }
  }
  Submission.init({
    content: DataTypes.TEXT,
    grade: DataTypes.INTEGER,
    assignment_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Submission',
  });
  return Submission;
};