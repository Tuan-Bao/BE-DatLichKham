import express from "express";
import * as scheduleController from "../controllers/scheduleController.js";
import authentication from "../middlewares/authentication.js";
import authorized from "../middlewares/authorization.js";

const scheduleRouter = express.Router();

scheduleRouter.patch(
  "/update",
  authentication,
  authorized(["doctor"]),
  scheduleController.updateDoctorSchedule
);

export default scheduleRouter;
