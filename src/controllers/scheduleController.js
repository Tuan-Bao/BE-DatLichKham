import * as scheduleService from "../services/scheduleService.js";
import BadRequestError from "../errors/bad_request.js";
import { StatusCodes } from "http-status-codes";

export const updateDoctorSchedule = async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const updateData = { ...req.body };

    if (!updateData) {
      throw new BadRequestError("At least one field must be provided.");
    }

    const result = await scheduleService.updateDoctorSchedule(
      user_id,
      updateData
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
