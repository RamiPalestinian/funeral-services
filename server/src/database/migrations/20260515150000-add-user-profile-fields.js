'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users');

    const add = async (name) => {
      if (!table[name]) {
        await queryInterface.addColumn('users', name, {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }
    };

    await add('lastName');
    await add('middleName');
    await add('phone');
    await add('address');
    await add('city');
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('users');
    const remove = async (name) => {
      if (table[name]) {
        await queryInterface.removeColumn('users', name);
      }
    };

    await remove('city');
    await remove('address');
    await remove('phone');
    await remove('middleName');
    await remove('lastName');
  },
};
