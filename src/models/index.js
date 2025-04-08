// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

/*
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { Sequelize } from "sequelize";
import process from "process";
import configFile from "../config/config.js";
import { configDotenv } from "dotenv";

configDotenv({ path: "../.env" });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const dbconfig = configFile[env];
const db = {};

let sequelize;
if (dbconfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbconfig.use_env_variable], {
    ...dbconfig,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  sequelize = new Sequelize(
    dbconfig.database,
    dbconfig.username,
    dbconfig.password,
    {
      ...dbconfig,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

const loadModels = async () => {
  const modelFiles = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  });

  const modelImports = modelFiles.map((file) =>
    import(pathToFileURL(path.join(__dirname, file)).href)
  );

  const modules = await Promise.all(modelImports);

  for (let i = 0; i < modules.length; i++) {
    const module = modules[i];
    const file = modelFiles[i];

    if (typeof module.default === "function") {
      const model = module.default(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    } else {
      console.error(`Model ${file} không xuất mặc định một function.`);
    }
  }

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
};

const initDB = async () => {
  await loadModels();
  // console.log("Models loaded:", Object.keys(db));
  return db;
};

export default initDB;
*/

import { Sequelize } from "sequelize";
import dbConfig from "../config/config.js";
import User from "./user.js";
import Patient from "./patient.js";
import Admin from "./admin.js";
import Specialization from "./specialization.js";
import Doctor from "./doctor.js";
import Schedule from "./schedule.js";
import Appointment from "./appointment.js";
import Feedback from "./feedback.js";
import Prescription from "./prescription.js";
import Payment from "./payment.js";
import MedicalRecord from "./medicalRecord.js";

const sequelize = new Sequelize(dbConfig.development);

const db = {
  sequelize,
  Sequelize,
  User: User(sequelize, Sequelize.DataTypes),
  Patient: Patient(sequelize, Sequelize.DataTypes),
  Admin: Admin(sequelize, Sequelize.DataTypes),
  Specialization: Specialization(sequelize, Sequelize.DataTypes),
  Doctor: Doctor(sequelize, Sequelize.DataTypes),
  Schedule: Schedule(sequelize, Sequelize.DataTypes),
  Appointment: Appointment(sequelize, Sequelize.DataTypes),
  Feedback: Feedback(sequelize, Sequelize.DataTypes),
  Prescription: Prescription(sequelize, Sequelize.DataTypes),
  Payment: Payment(sequelize, Sequelize.DataTypes),
  MedicalRecord: MedicalRecord(sequelize, Sequelize.DataTypes),
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

console.log("Models loaded:", Object.keys(db));

export default db;
