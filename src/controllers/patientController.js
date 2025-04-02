import * as patientService from "../services/patientService.js";
import { StatusCodes } from "http-status-codes";

export const updatePatientProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
  } catch (error) {
    next(error);
  }
};
