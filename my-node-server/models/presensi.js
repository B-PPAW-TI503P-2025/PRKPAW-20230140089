'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    static associate(models) {
      Presensi.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  Presensi.init({
    userId: DataTypes.INTEGER,
    checkIn: DataTypes.DATE,
    checkOut: DataTypes.DATE,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    buktiFoto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Presensi',
    tableName: 'presensi',
    freezeTableName: true
  });

  return Presensi;
};
