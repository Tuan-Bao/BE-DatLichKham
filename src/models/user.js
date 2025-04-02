"use strict";
// const {
//   Model
// } = require('sequelize');
import { Model } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BadRequestError from "../errors/bad_request.js";
import { configDotenv } from "dotenv";

configDotenv({ path: "../.env" });
export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Patient, { foreignKey: "user_id", as: "patient" });
      User.hasOne(models.Doctor, { foreignKey: "user_id", as: "doctor" });
      User.hasOne(models.Admin, { foreignKey: "user_id", as: "admin" });
    }
  }
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please enter your username" },
          len: {
            args: [3, 50],
            msg: "Username must be between 3 and 50 characters",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "Please enter your email" },
          isEmail: {
            args: true,
            msg: "Please enter a valid email",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue:
          "https://static.vecteezy.com/system/resources/previews/020/911/740/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png",
      },
      role: {
        type: DataTypes.ENUM("patient", "doctor", "admin"),
        allowNull: false,
        defaultValue: "patient",
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    }
  );

  User.beforeSave(async (user) => {
    if (user.changed("password")) {
      const value = user.password;

      if (value.length < 8 || value.length > 32) {
        throw new BadRequestError(
          "Password must be between 8 and 32 characters."
        );
      }

      const hasUppercase = /[A-Z]/.test(value);
      const hasLowercase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?\/\\|-]/.test(value);

      if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
        throw new BadRequestError(
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.prototype.createJWT = function () {
    // console.log(process.env.JWT_SECRET);
    return jwt.sign(
      { user_id: this.user_id, username: this.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
  };

  User.prototype.comparePassword = async function (cadidatePassword) {
    const isMatch = await bcrypt.compare(cadidatePassword, this.password);
    return isMatch;
  };

  return User;
};
