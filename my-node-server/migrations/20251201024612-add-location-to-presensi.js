'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('presensi', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true
    });

    await queryInterface.addColumn('presensi', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('presensi', 'latitude');
    await queryInterface.removeColumn('presensi', 'longitude');
  }
};
