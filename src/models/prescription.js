"use strict";
// const {
//   Model
// } = require('sequelize');
import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
  class Prescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Prescription.belongsTo(models.Appointment, {
        foreignKey: "appointment_id",
        as: "appointment",
      });
    }
  }
  Prescription.init(
    {
      prescription_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Appointments",
          key: "appointment_id",
        },
        onDelete: "CASCADE",
      },
      medicine_details: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Prescription",
      tableName: "Prescriptions",
      timestamps: true,
    }
  );
  return Prescription;
};
