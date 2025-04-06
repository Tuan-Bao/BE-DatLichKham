import express from "express";
import * as patientController from "../controllers/patientController";
import multer from "multer";
import authentication from "../middlewares/authentication.js";
import authorized from "../middlewares/authorization.js";

const patientRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

patientRouter.post("/register", patientController.registerPatient);

patientRouter.get("/verify", patientController.verifyEmail);

patientRouter.post("/login", patientController.loginPatient);

patientRouter.post(
  "/change_password",
  authentication,
  authorized(["patient"]),
  patientController.changePassword
);

patientRouter.get(
  "/all",
  authentication,
  authorized(["admin"]),
  patientController.getAllPatients
);

patientRouter.get(
  "/profile",
  authentication,
  authorized(["patient"]),
  patientController.getPatientProfile
);

// patientRouter.get(
//   "/appointments_medical_records_prescriptions",
//   authentication,
//   authorized(["doctor"]),
//   patientController.getPatientAppointmentsAndMedicalRecordsAndPrescriptions
// );

patientRouter.patch(
  "/update",
  authentication,
  authorized(["patient"]),
  upload.single("avatar"),
  patientController.updatePatientProfile
);

patientRouter.get(
  "/appointments",
  authentication,
  authorized(["patient", "doctor", "admin"]),
  patientController.getPatientAppointments
);

export default patientRouter;
