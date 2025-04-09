import * as adminService from "../services/adminService.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad_request.js";

export const registerAdmin = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      throw new BadRequestError("Missing required fields");
    }
    const result = await adminService.registerAdmin(username, password, email);
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Missing required fields");
    }
    const result = await adminService.loginAdmin(email, password);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPatientAppointmentsByAdmin = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const result = await adminService.getPatientAppointmentsByAdmin(user_id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getDoctorProfileByAdmin = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const result = await adminService.getDoctorProfileByAdmin(user_id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getDoctorAppointmentsByAdmin = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const result = await adminService.getDoctorAppointmentsByAdmin(user_id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
