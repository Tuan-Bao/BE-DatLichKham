"use strict";
// const {
//   Model
// } = require('sequelize');
import { Model, DataTypes } from "sequelize";
export default (sequelize) => {
  class Specialization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Specialization.hasMany(models.Doctor, {
        foreignKey: "specialization_id",
        as: "doctors",
      });
    }
  }
  Specialization.init(
    {
      specialization_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:
          "https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/yhocduphong.png",
      },
      fees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: { msg: "Fees must be an integer" },
          min: { args: [0], msg: "Fees must be at least 0" },
        },
      },
    },
    {
      sequelize,
      modelName: "Specialization",
      tableName: "Specializations",
      timestamps: true,
    }
  );
  return Specialization;
};
