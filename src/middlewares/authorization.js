import ForbiddenError from "../errors/forbidden.js";
import NotFoundError from "../errors/not_found.js";
import db from "../models/index.js";

// const db = await initDB();
const User = db.User;

const authorized = (roles) => async (req, res, next) => {
  try {
    const { user_id } = req.user;
    const user = await User.findByPk(user_id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!roles.includes(user.role)) {
      throw new ForbiddenError("Access denied");
    }
    next();
  } catch (error) {
    throw new Error(error.message);
  }
};

export default authorized;
