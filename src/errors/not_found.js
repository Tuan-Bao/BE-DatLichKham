import { StatusCodes } from "http-status-codes";
import CustomError from "./custom_error.js";

class NotFoundError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND; // 404
  }
}

export default NotFoundError;
