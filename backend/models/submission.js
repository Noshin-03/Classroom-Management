'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    static associate(models) {
<<<<<<< HEAD
      Submission.belongsTo(models.Assignment, { foreignKey: 'assignment_id' });
      Submission.belongsTo(models.User, { foreignKey: 'student_id' });
    }
  }
  Submission.init({
    content: DataTypes.TEXT,
    grade: DataTypes.INTEGER,
    assignment_id: DataTypes.INTEGER,
    student_id: DataTypes.INTEGER
=======
      Submission.belongsTo(models.User, { foreignKey: 'student_id', as: 'User' });
      Submission.belongsTo(models.Assignment, { foreignKey: 'assignment_id' });
    }
  }
  Submission.init({
    student_id: DataTypes.INTEGER,
    assignment_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    file_url: DataTypes.STRING,
    file_name: DataTypes.STRING,
    grade: DataTypes.FLOAT
>>>>>>> 5726d0b (- Profile page with edit info and change password)
  }, {
    sequelize,
    modelName: 'Submission',
  });
  return Submission;
<<<<<<< HEAD
};
=======
};
>>>>>>> 5726d0b (- Profile page with edit info and change password)
