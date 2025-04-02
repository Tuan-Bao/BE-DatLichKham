import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/custom_error.js";

const errorHandler = (err, req, res, next) => {
  // Nếu là lỗi CustomError (BadRequestError, UnauthorizedError, ...)
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Xử lý lỗi Sequelize (Validation, Unique Constraint, ...)
  if (err.name === "SequelizeValidationError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Duplicate entry detected",
    });
  }

  // Xử lý lỗi không xác định
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message });
};

export default errorHandler;
