import express from "express";
import * as doctorController from "../controllers/doctorController.js";
import multer from "multer";
import authentication from "../middlewares/authentication.js";

const doctorRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

doctorController.post(
  "/add",
  authentication,
  upload.single("avatar"),
  doctorController.addDoctor
);

doctorRouter.patch(
  "/update",
  authentication,
  upload.single("avatar"),
  doctorController.updateDoctorProfile
);
