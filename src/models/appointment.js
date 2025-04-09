"use strict";
// const {
//   Model
// } = require('sequelize');
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Appointment.belongsTo(models.Patient, {
        foreignKey: "patient_id",
        as: "patient",
      });
      Appointment.belongsTo(models.Doctor, {
        foreignKey: "doctor_id",
        as: "doctor",
      });
      Appointment.hasOne(models.Feedback, {
        foreignKey: "appointment_id",
        as: "feedback",
      });
      Appointment.hasOne(models.Prescription, {
        foreignKey: "appointment_id",
        as: "prescription",
      });
      Appointment.hasOne(models.Payment, {
        foreignKey: "appointment_id",
        as: "payment",
      });
      Appointment.hasOne(models.MedicalRecord, {
        foreignKey: "appointment_id",
        as: "medical_record",
      });
    }
  }
  Appointment.init(
    {
      appointment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Patients",
          key: "patient_id",
        },
        onDelete: "CASCADE",
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Doctors",
          key: "doctor_id",
        },
        onDelete: "CASCADE",
      },
      appointment_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Appointment datetime is required" },
          isDate: { msg: "Invalid date format" },
        },
      },
      status: {
        type: DataTypes.ENUM(
          "waiting_for_confirmation",
          "accepted",
          "cancelled",
          "completed",
          "patient_not_coming"
        ),
        allowNull: false,
        defaultValue: "waiting_for_confirmation",
      },
      fees: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Appointment",
      tableName: "Appointments",
      timestamps: true,
    }
  );
  return Appointment;
};
