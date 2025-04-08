"use strict";
// const {
//   Model
// } = require('sequelize');
import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.Appointment, {
        foreignKey: "appointment_id",
        as: "appointment",
      });
    }
  }
  Payment.init(
    {
      payment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM("cash", "credit_card", "e-wallet"),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("paid", "pending"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "Payments",
      timestamps: true,
    }
  );
  return Payment;
};
