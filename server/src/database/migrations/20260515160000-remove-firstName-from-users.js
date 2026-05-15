'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const table = await queryInterface.describeTable('users');

    if (table.firstName) {
      await queryInterface.removeColumn('users', 'firstName');
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users');

    if (!table.firstName) {
      await queryInterface.addColumn('users', 'firstName', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
