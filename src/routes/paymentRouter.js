import express from "express";
import * as paymentController from "../controllers/paymentController.js";
import authentication from "../middlewares/authentication.js";

const paymentRouter = express.Router();

paymentRouter.post(
  "/payment",
  authentication,
  paymentController.paymentForAppointment
);

export default paymentRouter;
