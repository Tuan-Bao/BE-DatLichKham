import express from "express";
import * as patientController from "../controllers/patientController";
import multer from "multer";

const patientRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

patientRouter.patch(
  "/update/:id",
  upload.single("avatar"),
  patientController.updatePatientProfile
);

export default patientRouter;
