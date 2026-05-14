'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (const column of [
      'serviceId',
      'islamicId',
      'classicServiceId',
      'cremationId',
    ]) {
      await queryInterface.changeColumn('cards', column, {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    for (const column of [
      'serviceId',
      'islamicId',
      'classicServiceId',
      'cremationId',
    ]) {
      await queryInterface.changeColumn('cards', column, {
        type: Sequelize.INTEGER,
        allowNull: false,
      });
    }
  },
};
