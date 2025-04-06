import express from "express";
import * as medicalRecordController from "../controllers/medicalRecordController.js";
import authentication from "../middlewares/authentication.js";
import authorized from "../middlewares/authorization.js";

const medicalRecordRouter = express.Router();

medicalRecordRouter.post(
  "/add",
  authentication,
  authorized(["doctor"]),
  medicalRecordController.addMedicalRecord
);

medicalRecordRouter.patch(
  "/update/:record_id",
  authentication,
  authorized(["doctor"]),
  medicalRecordController.updateMedicalRecord
);

export default medicalRecordRouter;
