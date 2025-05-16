const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Dokter = require("./dokter");

const Jadwal = sequelize.define(
  "Jadwal",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    day: {
      type: DataTypes.STRING,
    },
    time_start: {
      type: DataTypes.TIME,
    },
    time_finish: {
      type: DataTypes.TIME,
    },
    quota: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    tableName: "jadwal",
    timestamps: true,
  },
);

Jadwal.belongsTo(Dokter, { foreignKey: "dokter_id" });
Dokter.hasMany(Jadwal, { foreignKey: "dokter_id" });

module.exports = Jadwal;
