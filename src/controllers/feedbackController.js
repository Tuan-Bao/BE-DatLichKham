import * as feedbackService from "../services/feedbackService.js";
import BadRequestError from "../errors/bad_request.js";
import { StatusCodes } from "http-status-codes";

export const addFeedback = async (req, res, next) => {
  try {
    const { appointment_id, rating, comment } = req.body;
    if (!appointment_id || !rating) {
      throw new BadRequestError("Missing required fields");
    }

    const result = await feedbackService.addFeedback(
      appointment_id,
      rating,
      comment
    );
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateFeedback = async (req, res, next) => {
  try {
    const { feedback_id } = req.params;
    const { rating, comment } = req.body;
    if (!rating && !comment) {
      throw new BadRequestError(
        "At least one of rating or comment must be provided"
      );
    }

    const result = await feedbackService.updateFeedback(
      feedback_id,
      rating,
      comment
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
