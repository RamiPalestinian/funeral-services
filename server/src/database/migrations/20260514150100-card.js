'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cards', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },

      serviceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'services',
          key: 'id',
        },
      },

      islamicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'islamic',
          key: 'id',
        },
      },

      classicServiceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'classicServices',
          key: 'id',
        },
      },

      cremationId: {  
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cremations',
          key: 'id',
        },
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cards');
  },
};
