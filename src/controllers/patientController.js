import * as patientService from "../services/patientService.js";
import BadRequestError from "../errors/bad_request.js";
import { StatusCodes } from "http-status-codes";

export const registerPatient = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      throw new BadRequestError("Missing required fields");
    }

    const result = await patientService.registerPatient(
      username,
      password,
      email
    );
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp_code } = req.query;
    const result = await patientService.verifyEmail(email, otp_code);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const loginPatient = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Missing required fields");
    }
    const result = await patientService.loginPatient(email, password);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      throw new BadRequestError("Missing required fields");
    }

    if (old_password === new_password) {
      throw new BadRequestError(
        "New password must be different from old password."
      );
    }

    const result = await patientService.changePassword(
      user_id,
      old_password,
      new_password
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllPatients = async (req, res, next) => {
  try {
    const result = await patientService.getAllPatients();
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPatientProfile = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const result = await patientService.getPatientProfile(user_id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const updatePatientProfile = async (req, res, next) => {
  try {
    const { user_id } = req.user;

    const updateData = { ...req.body };

    if (!updateData && !req.file) {
      throw new BadRequestError("At least one field must be provided.");
    }

    if (req.file) {
      const imageBuffer = req.file.buffer.toString("base64");
      updateData.avatar = `data:image/png;base64,${imageBuffer}`;
    }

    const result = await patientService.updatePatientProfile(
      user_id,
      updateData
    );

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPatientAppointments = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const result = await patientService.getPatientAppointments(user_id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPatientPayments = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const result = await patientService.getPatientPayments(user_id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getDoctorProfileByPatient = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const result = await patientService.getDoctorProfileByPatient(user_id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getDoctorAppointmentsByPatient = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const result = await patientService.getDoctorAppointmentsByPatient(user_id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
