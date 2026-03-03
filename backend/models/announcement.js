'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Announcement extends Model {
    static associate(models) {
      Announcement.belongsTo(models.Class, { foreignKey: 'class_id' });
      Announcement.belongsTo(models.User, { foreignKey: 'teacher_id' });
    }
  }
  Announcement.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    class_id: DataTypes.INTEGER,
    teacher_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Announcement',
  });
  return Announcement;
};