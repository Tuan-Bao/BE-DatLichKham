import express from "express";
import * as paymentController from "../controllers/paymentController.js";
import authentication from "../middlewares/authentication.js";
import authorized from "../middlewares/authorization.js";

const paymentRouter = express.Router();

paymentRouter.post(
  "/payment",
  authentication,
  authorized(["patient"]),
  paymentController.paymentForAppointment
);

export default paymentRouter;
