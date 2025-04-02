import * as patientService from "../services/patientService.js";
import BadRequestError from "../errors/bad_request.js";
import { StatusCodes } from "http-status-codes";

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
