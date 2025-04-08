import db from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";

// const db = await initDB();
const Admin = db.Admin;
const User = db.User;

export const registerAdmin = async (username, password, email) => {
  const transaction = await Sequelize.transaction();
  try {
    const existingUser = await User.findOne({ where: { email }, transaction });
    if (existingUser) {
      throw new BadRequestError("Email is already registered");
    }
    const newUser = await User.create(
      { username, password, email },
      { transaction }
    );
    const user_id = newUser.user_id;

    const newAdmin = await Admin.create({ user_id }, { transaction });
    await transaction.commit();
    return { message: "Success", admin: newAdmin };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

export const loginAdmin = async (email, password) => {
  try {
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
      include: [{ model: Admin, as: "admin" }],
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { admin } = user;
    if (!admin) throw new NotFoundError("Admin not found");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    const role = user.role;
    const token = user.createJWT();

    return {
      message: "Success",
      role,
      token,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
