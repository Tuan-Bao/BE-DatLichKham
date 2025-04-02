import initDB from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";
import { or } from "sequelize";

const db = await initDB();
const Doctor = db.Doctor;
const User = db.User;
const Specialization = db.Specialization;
const Appointment = db.Appointment;

export const loginDoctor = async (email, password) => {
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundError("Doctor not found");
    }

    if (user.role !== "doctor") {
      throw new BadRequestError("This account is not a doctor");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new BadRequestError("Invalid password");
    }

    const token = user.createJWT();

    return {
      message: "Success",
      token,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllDoctors = async () => {
  try {
    const doctors = await Doctor.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: { exclude: ["password"] },
        },
        {
          model: Specialization,
          as: "specialization",
        },
      ],
    });

    if (doctors.length === 0) {
      throw new NotFoundError("No doctors found");
    }

    return {
      message: "Success",
      doctors,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getDoctorProfile = async (user_id) => {
  try {
    const user = await User.findByPk(user_id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Doctor,
          as: "doctor",
        },
      ],
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { doctor } = user;
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    return {
      message: "Success",
      user,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getDoctorAppointments = async (user_id) => {
  try {
    const user = await User.findByPk(user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Doctor, as: "doctor" }],
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { doctor } = user;
    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    const doctor_id = doctor.doctor_id;

    const appointments = await Appointment.findAll({
      where: { doctor_id },
      include: [
        {
          model: Patient,
          as: "patient",
          include: [
            { model: User, as: "user", attributes: { exclude: ["password"] } },
          ],
        },
      ],
      order: [["appointment_datetime", "DESC"]],
    });

    return {
      message: "Success",
      appointments,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addDoctor = async () => {}; // add user + doctor + schedule

export const updateDoctorProfile = async (user_id, updateData) => {};

export const deleteDoctor = async (user_id) => {
  try {
    const user = await User.findByPk(user_id, {
      include: { model: Doctor, as: "doctor" },
    });

    if (!user || !user.doctor) {
      throw new NotFoundError("Doctor not found");
    }

    await user.destroy(); // CASCADE sẽ xóa doctor & schedule liên quan

    return {
      message: "Doctor deleted successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
