import * as prescriptionService from "../services/prescriptionService.js";
import BadRequestError from "../errors/bad_request.js";
import { StatusCodes } from "http-status-codes";

export const addPrescription = async (req, res, next) => {
  try {
    const { appointment_id, medicine_details } = req.body;

    if (!appointment_id || !medicine_details) {
      throw new BadRequestError("Missing required fields");
    }

    const result = await prescriptionService.addPrescription(
      appointment_id,
      medicine_details
    );
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const updatePrescription = async (req, res, next) => {
  try {
    const { prescription_id } = req.params;
    const { medicine_details } = req.body;

    if (!medicine_details) {
      throw new BadRequestError("A least medicine details must be provided");
    }

    const result = await prescriptionService.updatePrescription(
      prescription_id,
      medicine_details
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
