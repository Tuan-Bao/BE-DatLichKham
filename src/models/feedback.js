"use strict";
// const {
//   Model
// } = require('sequelize');
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Feedback.belongsTo(models.Appointment, {
        foreignKey: "appointment_id",
        as: "appointment",
      });
    }
  }
  Feedback.init(
    {
      feedback_id: {
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
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: { args: [1], msg: "Rating must be at least 1" },
          max: { args: [5], msg: "Rating cannot be more than 5" },
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Feedback",
      tableName: "Feedbacks",
      timestamps: true,
    }
  );
  return Feedback;
};
