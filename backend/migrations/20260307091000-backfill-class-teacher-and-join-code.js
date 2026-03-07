'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE Classes c
      JOIN Subjects s ON c.subject_id = s.id
      SET c.teacher_id = s.teacher_id
      WHERE c.teacher_id IS NULL
    `);

    await queryInterface.sequelize.query(`
      UPDATE Classes
      SET join_code = CONCAT('CLS', LPAD(id, 3, '0'))
      WHERE join_code IS NULL OR join_code = ''
    `);
  },

  async down() {
    // No-op: data backfill migration
  },
};
