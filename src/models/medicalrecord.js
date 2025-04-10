"use strict";
// const {
//   Model
// } = require('sequelize');
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class MedicalRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MedicalRecord.belongsTo(models.Appointment, {
        foreignKey: "appointment_id",
        as: "appointment",
      });
    }
  }
  MedicalRecord.init(
    {
      record_id: {
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
      diagnosis: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      treatment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "MedicalRecord",
      tableName: "MedicalRecords",
      timestamps: true,
    }
  );
  return MedicalRecord;
};
