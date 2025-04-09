import * as doctorService from "../services/doctorService.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";
import { StatusCodes } from "http-status-codes";

export const loginDoctor = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError("Missing required fields");
    }
    const result = await doctorService.loginDoctor(email, password);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllDoctors = async (req, res, next) => {
  try {
    const result = await doctorService.getAllDoctors();
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getDoctorProfile = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const result = await doctorService.getDoctorProfile(user_id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getDoctorAppointments = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const result = await doctorService.getDoctorAppointments(user_id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPatientAppointmentsByDoctor = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const result = await doctorService.getPatientAppointmentsByDoctor(user_id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const addDoctor = async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      specialization_id,
      degree,
      experience_years,
      description,
    } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      !specialization_id ||
      !degree ||
      !experience_years ||
      !description
    ) {
      throw new BadRequestError("Missing required fields");
    }

    let avatar = null;
    if (req.file) {
      const imageBuffer = req.file.buffer.toString("base64");
      avatar = `data:image/png;base64,${imageBuffer}`;
    }

    const doctorData = {
      username,
      email,
      password,
      avatar,
      specialization_id,
      degree,
      experience_years,
      description,
    };

    const result = await doctorService.addDoctor(doctorData);
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateDoctorProfile = async (req, res, next) => {
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

    const result = await doctorService.updateDoctorProfile(user_id, updateData);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteDoctor = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const result = await doctorService.deleteDoctor(user_id);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
