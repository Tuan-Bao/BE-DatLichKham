import * as medicalRecordService from "../services/medicalRecordService.js";
import BadRequestError from "../errors/bad_request.js";
import { StatusCodes } from "http-status-codes";

export const addMedicalRecord = async (req, res, next) => {
  try {
    const { appointment_id } = req.body;
    const { diagnosis, treatment, notes } = req.body;

    if (!diagnosis || !treatment) {
      throw new BadRequestError("Missing required fields");
    }

    const result = await medicalRecordService.addMedicalRecord(
      appointment_id,
      diagnosis,
      treatment,
      notes
    );

    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateMedicalRecord = async (req, res, next) => {
  try {
    const { record_id } = req.params;
    const { diagnosis, treatment, notes } = req.body;

    if (!diagnosis && !treatment && !notes) {
      throw new BadRequestError("A least one field must be provided");
    }

    const result = await medicalRecordService.updateMedicalRecord(
      record_id,
      diagnosis,
      treatment,
      notes
    );

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
