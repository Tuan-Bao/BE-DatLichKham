"use strict";
// const {
//   Model
// } = require('sequelize');
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Admin.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  Admin.init(
    {
      admin_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
    },
    {
      sequelize,
      modelName: "Admin",
      tableName: "Admins",
      timestamps: true,
    }
  );
  return Admin;
};
