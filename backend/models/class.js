'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    static associate(models) {
      Class.belongsTo(models.Subject, { foreignKey: 'subject_id' });
      Class.belongsTo(models.User, { foreignKey: 'teacher_id' });
      Class.hasMany(models.Enrollment, { foreignKey: 'class_id' });
      Class.hasMany(models.Announcement, { foreignKey: 'class_id' });
      Class.hasMany(models.Assignment, { foreignKey: 'class_id' });
    }
  }
  Class.init({
    name: DataTypes.STRING,
    subject_id: DataTypes.INTEGER,
    teacher_id: DataTypes.INTEGER,
    join_code: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Class',
  });
  return Class;
};