import * as appointmentService from "../services/appointmentService.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad_request.js";

export const bookAppointment = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { doctor_id, appointment_datetime } = req.body;

    if (!doctor_id || !appointment_datetime) {
      throw new BadRequestError("Missing required fields");
    }

    const result = await appointmentService.bookAppointment(
      user_id,
      doctor_id,
      appointment_datetime
    );

    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const acceptAppointment = async (req, res, next) => {
  try {
    const { appointment_id } = req.params;
    const result = await appointmentService.acceptAppointment(appointment_id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const cancelAppointmentByPatient = async (req, res, next) => {
  try {
    const { appointment_id } = req.params;
    const result = await appointmentService.cancelAppointmentByPatient(
      appointment_id
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const cancelAppointmentByDoctor = async (req, res, next) => {
  try {
    const { appointment_id } = req.params;
    const result = await appointmentService.cancelAppointmentByDoctor(
      appointment_id
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const completeAppointment = async (req, res, next) => {
  try {
    const { appointment_id } = req.params;
    const result = await appointmentService.completeAppointment(appointment_id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const markPatientNotComing = async (req, res, next) => {
  try {
    const { appointment_id } = req.params;
    const result = await appointmentService.markPatientNotComing(
      appointment_id
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllAppointments = async (req, res, next) => {
  try {
    const result = await appointmentService.getAllAppointments();
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPaidAppointments = async (req, res, next) => {
  try {
    const result = await appointmentService.getPaidAppointments();
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAppointmentsDetails = async (req, res, next) => {
  try {
    const { appointment_id } = req.params;
    const result = await appointmentService.getAppointmentsDetails(
      appointment_id
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
