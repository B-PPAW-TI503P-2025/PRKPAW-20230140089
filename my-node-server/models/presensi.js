'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    static associate(models) {
      // define association here
    }
  }

  Presensi.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Presensi',
    tableName: 'presensi',   // 🟢 tambahkan baris ini
    freezeTableName: true,   // 🟢 mencegah Sequelize menjamakkan nama tabel
    timestamps: true         // opsional, sesuaikan dengan struktur tabel
  });

  return Presensi;
};
