import express from "express";
import * as prescriptionController from "../controllers/prescriptionController.js";
import authentication from "../middlewares/authentication.js";

const prescriptionRouter = express.Router();

prescriptionRouter.post(
  "/add",
  authentication,
  prescriptionController.addPrescription
);

prescriptionRouter.patch(
  "/update/:prescription_id",
  authentication,
  prescriptionController.updatePrescription
);

export default prescriptionRouter;
