import express from "express";
import * as patientController from "../controllers/patientController";
import multer from "multer";
import authentication from "../middlewares/authentication.js";

const patientRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

patientRouter.patch(
  "/update",
  authentication,
  upload.single("avatar"),
  patientController.updatePatientProfile
);

export default patientRouter;
