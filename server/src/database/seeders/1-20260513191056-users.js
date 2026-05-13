'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Хешируем пароль Admin123!
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Администратор',
        email: 'admin@funeral.ru',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};