'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Classes', 'teacher_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Classes', 'teacher_id');
  }
};