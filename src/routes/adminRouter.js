import express from "express";
import * as adminController from "../controllers/adminController.js";
import authentication from "../middlewares/authentication.js";
import authorized from "../middlewares/authorization.js";

const adminRouter = express.Router();

adminRouter.post("/register", adminController.registerAdmin);

adminRouter.post("/login", adminController.loginAdmin);

adminRouter.get(
  "/patient_appointments/:user_id",
  authentication,
  authorized(["admin"]),
  adminController.getPatientAppointmentsByAdmin
);

adminRouter.get(
  "/doctor_profile/:user_id",
  authentication,
  authorized(["admin"]),
  adminController.getDoctorProfileByAdmin
);

adminRouter.get(
  "/doctor_appointments/:user_id",
  authentication,
  authorized(["admin"]),
  adminController.getDoctorAppointmentsByAdmin
);

export default adminRouter;
