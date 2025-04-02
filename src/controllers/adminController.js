import * as adminService from "../services/adminService.js";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "../errors/not_found.js";

export const registerAdmin = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      throw new NotFoundError("Missing required fields");
    }
    const result = await adminService.registerAdmin(username, password, email);
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new NotFoundError("Missing required fields");
    }
    const result = await adminService.loginAdmin(email, password);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
