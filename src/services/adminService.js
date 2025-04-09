import initDB from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";
import { or, where } from "sequelize";

const db = await initDB();
const Admin = db.Admin;
const User = db.User;
const Patient = db.Patient;
const Doctor = db.Doctor;
const Specialization = db.Specialization;
const Schedule = db.Schedule;
const Appointment = db.Appointment;

export const registerAdmin = async (username, password, email) => {
  const transaction = await db.sequelize.transaction();
  try {
    const existingUser = await User.findOne({ where: { email }, transaction });
    if (existingUser) {
      throw new BadRequestError("Email is already registered");
    }
    const newUser = await User.create(
      { username, password, email, role: "admin" },
      { transaction }
    );
    const user_id = newUser.user_id;

    await Admin.create({ user_id }, { transaction });
    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

export const loginAdmin = async (email, password) => {
  try {
    const user = await User.findOne({
      where: { email },
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

export const getPatientAppointmentsByAdmin = async (user_id) => {
  try {
    const user = await User.findByPk(user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Patient, as: "patient" }],
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { patient } = user;
    if (!patient) {
      throw new NotFoundError("Patient not found");
    }

    const appointments = await Appointment.findAll({
      where: { patient_id: patient.patient_id },
      include: [
        {
          model: Doctor,
          as: "doctor",
          include: [
            { model: User, as: "user", attributes: { exclude: ["password"] } },
            { model: Specialization, as: "specialization" },
          ],
        },
      ],
      order: [["appointment_datetime", "DESC"]],
    });

    return {
      message: "Success",
      user,
      appointments,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getDoctorProfileByAdmin = async (user_id) => {
  try {
    const user = await User.findByPk(user_id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Doctor,
          as: "doctor",
          include: [
            { model: Specialization, as: "specialization" },
            { model: Schedule, as: "schedule" },
          ],
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

export const getDoctorAppointmentsByAdmin = async (user_id) => {
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
      user,
      appointments,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
