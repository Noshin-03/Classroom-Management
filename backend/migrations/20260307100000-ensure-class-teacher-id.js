'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Update classes to have teacher_id from their associated subject
    await queryInterface.sequelize.query(`
      UPDATE Classes 
      SET teacher_id = (
        SELECT teacher_id 
        FROM Subjects 
        WHERE Subjects.id = Classes.subject_id
      )
      WHERE teacher_id IS NULL
    `);
  },

  async down(queryInterface, Sequelize) {
    // No rollback needed
  }
};
