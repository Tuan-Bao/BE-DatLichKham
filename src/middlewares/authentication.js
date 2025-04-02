import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import UnauthorizedError from "../errors/unauthorized.js";

configDotenv({ path: "../.env" });

const authentication = async (req, res, next) => {
  try {
    const authHeader = req.header.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authentication Invalid");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      user_id: decoded.user_id,
      username: decoded.username,
      email: decoded.email,
    };
    next();
  } catch (error) {
    throw new UnauthorizedError("Authentication Invalid");
  }
};

export default authentication;
