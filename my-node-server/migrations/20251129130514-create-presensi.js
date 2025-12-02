'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('presensi', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      checkIn: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      checkOut: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      latitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      longitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('presensi');
  }
};
