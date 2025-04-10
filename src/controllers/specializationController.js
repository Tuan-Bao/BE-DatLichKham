import * as specializationService from "../services/specializationService.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad_request.js";

export const getAllSpecializations = async (req, res, next) => {
  try {
    const result = await specializationService.getAllSpecializations();
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const createSpecialization = async (req, res, next) => {
  try {
    const { name, fees } = req.body;

    if (!name || !fees) {
      throw new BadRequestError("Missing required fields");
    }

    let imageFile = null;
    if (req.file) {
      // Chuyển file buffer thành base64 để Cloudinary xử lý
      const imageBuffer = req.file.buffer.toString("base64");
      imageFile = `data:image/png;base64,${imageBuffer}`;
    }

    const result = await specializationService.createSpecialization(
      name,
      fees,
      imageFile
    );

    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateSpecialization = async (req, res, next) => {
  try {
    const { specialization_id } = req.params;
    const { name, fees } = req.body;

    if (!name && !fees && !req.file) {
      throw new BadRequestError(
        "At least one field (name or image) must be provided."
      );
    }

    let updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (fees) {
      updateData.fees = fees;
    }

    if (req.file) {
      const imageBuffer = req.file.buffer.toString("base64");
      updateData.image = `data:image/png;base64,${imageBuffer}`;
    }

    const result = await specializationService.updateSpecialization(
      specialization_id,
      updateData
    );

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteSpecialization = async (req, res, next) => {
  try {
    const { specialization_id } = req.params;
    const result = await specializationService.deleteSpecialization(
      specialization_id
    );
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
