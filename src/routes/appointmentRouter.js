import express from "express";
import * as appointmentController from "../controllers/appoinmentController.js";
import authentication from "../middlewares/authentication.js";
import authorized from "../middlewares/authorization.js";

const appointmentRouter = express.Router();

appointmentRouter.post(
  "/book",
  authentication,
  authorized(["patient"]),
  appointmentController.bookAppointment
);

appointmentRouter.post(
  "/accept_appointment/:appointment_id",
  authentication,
  authorized(["doctor"]),
  appointmentController.acceptAppointment
);

appointmentRouter.post(
  "/cancel_appointment_patient/:appointment_id",
  authentication,
  authorized(["patient"]),
  appointmentController.cancelAppointmentByPatient
);

appointmentRouter.post(
  "/cancel_appointment_doctor/:appointment_id",
  authentication,
  authorized(["doctor"]),
  appointmentController.cancelAppointmentByDoctor
);

appointmentRouter.post(
  "/complete_appointment/:appointment_id",
  authentication,
  authorized(["doctor"]),
  appointmentController.completeAppointment
);

appointmentRouter.post(
  "/mark_patient_not_coming/:appointment_id",
  authentication,
  authorized(["doctor"]),
  appointmentController.markPatientNotComing
);

appointmentRouter.get(
  "/all_appointments",
  authentication,
  authorized(["admin"]),
  appointmentController.getAllAppointments
);

appointmentRouter.get(
  "/paid_appointments",
  authentication,
  authorized(["admin"]),
  appointmentController.getPaidAppointments
);

appointmentRouter.get(
  "/appointment_details/:appointment_id",
  authentication,
  authorized(["patient", "doctor", "admin"]),
  appointmentController.getAppointmentsDetails
);

export default appointmentRouter;
