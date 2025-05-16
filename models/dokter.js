const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Dokter = sequelize.define(
  "Dokter",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "dokter",
    timestamps: true,
  },
);

module.exports = Dokter;
