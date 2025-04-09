import express from "express";
import * as doctorController from "../controllers/doctorController.js";
import multer from "multer";
import authentication from "../middlewares/authentication.js";
import authorized from "../middlewares/authorization.js";

const doctorRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

doctorRouter.post("/login", doctorController.loginDoctor);

doctorRouter.get(
  "/all",
  authentication,
  authorized(["patient", "admin"]),
  doctorController.getAllDoctors
);

doctorRouter.get(
  "/profile",
  authentication,
  authorized(["doctor"]),
  doctorController.getDoctorProfile
);

doctorRouter.get(
  "/appointments",
  authentication,
  authorized(["doctor"]),
  doctorController.getDoctorAppointments
);

doctorRouter.get(
  "/patient_appointments/:user_id",
  authentication,
  authorized(["doctor"]),
  doctorController.getPatientAppointmentsByDoctor
);

doctorRouter.post(
  "/add",
  authentication,
  authorized(["admin"]),
  upload.single("avatar"),
  doctorController.addDoctor
);

doctorRouter.patch(
  "/update",
  authentication,
  authorized(["doctor"]),
  upload.single("avatar"),
  doctorController.updateDoctorProfile
);

doctorRouter.delete(
  "/delete/:user_id",
  authentication,
  authorized(["admin"]),
  doctorController.deleteDoctor
);
export default doctorRouter;
