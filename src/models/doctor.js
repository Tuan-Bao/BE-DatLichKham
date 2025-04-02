"use strict";
// const { Model } = require("sequelize");
import { Model, Sequelize } from "sequelize";
export default (sequelize, DataTypes) => {
  class Doctor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Doctor.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      Doctor.belongsTo(models.Specialization, {
        foreignKey: "specialization_id",
        as: "specialization",
      });
      Doctor.hasOne(models.Schedule, {
        foreignKey: "doctor_id",
        as: "schedule",
      });
      Doctor.hasMany(models.Appointment, {
        foreignKey: "doctor_id",
        as: "appointments",
      });
    }
  }
  Doctor.init(
    {
      doctor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "user_id",
        },
        onDelete: "CASCADE",
      },
      specialization_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Specializations",
          key: "specialization_id",
        },
        onDelete: "SET NULL",
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      experience_years: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: "Experience years must be an integer" },
          min: { args: [0], msg: "Experience years must be at least 0" },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Doctor",
      tableName: "Doctors",
      timestamps: true,
    }
  );
  return Doctor;
};
