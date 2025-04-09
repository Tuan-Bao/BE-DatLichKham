import initDB from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";

const db = await initDB();
const Payment = db.Payment;
const Appointment = db.Appointment;

export const paymentForAppointment = async () => {};
