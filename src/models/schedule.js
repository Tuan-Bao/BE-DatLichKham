"use strict";
// const { Model } = require("sequelize");
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Doctor, {
        foreignKey: "doctor_id",
        as: "doctor",
      });
    }
  }
  Schedule.init(
    {
      schedule_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
      monday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      tuesday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      wednesday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      thursday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      friday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      saturday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      sunday: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Schedule",
      tableName: "Schedules",
      timestamps: true,
    }
  );
  return Schedule;
};
