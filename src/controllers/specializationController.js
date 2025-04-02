import * as specializationService from "../services/specializationService.js";
import { StatusCodes } from "http-status-codes";

export const createSpecialization = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new BadRequestError("Specialization name is required.");
    }

    if (!req.file) {
      throw new BadRequestError("Image is required.");
    }

    // Chuyển file buffer thành base64 để Cloudinary xử lý
    const imageBuffer = req.file.buffer.toString("base64");
    const imageFile = `data:image/png;base64,${imageBuffer}`;

    const result = await specializationService.createSpecialization(
      name,
      imageFile
    );

    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateSpecialization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name && !req.file) {
      throw new BadRequestError(
        "At least one field (name or image) must be provided."
      );
    }

    let updateData = {};

    if (name) {
      updateData.name = name;
    }

    if (req.file) {
      const imageBuffer = req.file.buffer.toString("base64");
      updateData.image = `data:image/png;base64,${imageBuffer}`;
    }

    const result = await specializationService.updateSpecialization(
      id,
      updateData
    );

    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
