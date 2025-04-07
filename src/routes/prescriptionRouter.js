import express from "express";
import * as prescriptionController from "../controllers/prescriptionController.js";
import authentication from "../middlewares/authentication.js";
import authorized from "../middlewares/authorization.js";

const prescriptionRouter = express.Router();

prescriptionRouter.post(
  "/add",
  authentication,
  authorized(["doctor"]),
  prescriptionController.addPrescription
);

prescriptionRouter.patch(
  "/update/:prescription_id",
  authentication,
  authorized(["doctor"]),
  prescriptionController.updatePrescription
);

export default prescriptionRouter;
