import db from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";
import cloudinary from "../config/cloudinary.js";
import { sendVerifyLink } from "../utils/gmail.js";
import { configDotenv } from "dotenv";

configDotenv({ path: "../.env" });

// const db = await initDB();
const Patient = db.Patient;
const User = db.User;
const Appointment = db.Appointment;
// const MedicalRecord = db.MedicalRecord;
const Payment = db.Payment;

export const registerPatient = async (username, password, email) => {
  const transaction = await Sequelize.transaction();
  try {
    console.log(username, password, email);
    const existingUser = await User.findOne({ where: { email }, transaction });
    if (existingUser) {
      throw new BadRequestError("Email is already registered");
    }
    const newUser = await User.create(
      { username, password, email },
      { transaction }
    );
    const user_id = newUser.user_id;
    const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    await Patient.create({ user_id, otp_code, otp_expiry }, { transaction });
    const link = `${process.env.URL}/patient/verify?email=${email}&otp_code=${otp_code}`;
    await sendVerifyLink(email, otp_code, link);
    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

export const verifyEmail = async (email, otp_code) => {
  try {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Patient, as: "patient" }],
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { patient } = user;
    if (!patient) throw new NotFoundError("Patient not found");

    if (patient.is_verified)
      throw new BadRequestError("Email already verified");
    if (patient.otp_code !== otp_code)
      throw new BadRequestError("Invalid OTP code");
    if (patient.otp_expiry < new Date())
      throw new BadRequestError("OTP code has expired");

    patient.is_verified = true;
    patient.otp_code = null;
    patient.otp_expiry = null;

    await patient.save();

    return { message: "Success" };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginPatient = async (email, password) => {
  try {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Patient, as: "patient" }],
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { patient } = user;
    if (!patient) throw new NotFoundError("Patient not found");

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

export const changePassword = async (user_id, oldPassword, newPassword) => {
  const transaction = await Sequelize.transaction();
  try {
    const user = await User.findByPk(user_id, {
      include: [{ model: Patient, as: "patient" }],
      transaction,
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    const { patient } = user;
    if (!patient) throw new NotFoundError("Patient not found");

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      throw new BadRequestError("Incorrect password");
    }
    user.password = newPassword;
    await user.save({ transaction });

    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

const forgotPassword = async (email) => {};

const resetPassword = async (email, otp_code, newPassword) => {};

export const getAllPatients = async () => {
  try {
    const patients = await Patient.findAll({
      include: [
        { model: User, as: "user", attributes: { exclude: ["password"] } },
      ],
    });
    if (patients.length === 0) {
      throw new NotFoundError("No patients found");
    }
    return { message: "Success", patients };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPatientProfile = async (user_id) => {
  try {
    const user = await User.findByPk(user_id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Patient,
          as: "patient",
        },
      ],
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { patient } = user;
    if (!patient) {
      throw new NotFoundError("Patient not found");
    }

    return { message: "Success", user };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPatientAppointmentsByDoctor = async (user_id) => {
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
      where: {
        patient_id: patient.patient_id,
        status: "completed",
      },
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
      order: [["appointment_date", "DESC"]],
    });

    return { message: "Success", user, appointments };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updatePatientProfile = async (user_id, updateData) => {
  const transaction = await db.sequelize.transaction();
  try {
    const user = await User.findByPk(user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Patient, as: "patient" }],
      transaction,
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { patient } = user;
    if (!patient) {
      throw new NotFoundError("Patient not found");
    }

    const userFields = ["username", "email"];
    userFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    if (updateData.avatar) {
      const uploadResult = await cloudinary.uploader.upload(updateData.avatar, {
        folder: "avatars",
        use_filename: true,
        unique_filename: false,
      });
      user.avatar = uploadResult.secure_url;
    }

    const patientFields = [
      "date_of_birth",
      "gender",
      "address",
      "phone_number",
      "insurance_number",
      "id_number",
    ];

    patientFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        patient[field] = updateData[field];
      }
    });

    await user.save({ transaction });
    await patient.save({ transaction });

    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

export const getPatientAppointments = async (user_id) => {
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
        {
          model: Patient,
          as: "patient",
          include: [
            { model: User, as: "user", attributes: { exclude: ["password"] } },
          ],
        },
      ],
      order: [["appointment_datetime", "DESC"]], // Lịch hẹn được sắp xếp theo thời gian mới nhất đến cũ nhất
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

export const getPatientPayments = async (user_id) => {
  try {
    const user = await User.findByPk(user_id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Patient,
          as: "patient",
        },
      ],
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { patient } = user;
    if (!patient) {
      throw new NotFoundError("Patient not found");
    }

    const appointments = await Appointment.findAll({
      where: { patient_id: patient.patient_id, status: "completed" },
      include: [
        {
          model: Doctor,
          as: "doctor",
          include: [
            { model: User, as: "user", attributes: { exclude: ["password"] } },
            { model: Specialization, as: "specialization" },
          ],
        },
        {
          model: Payment,
          as: "payment",
        },
      ],
      order: [["appointment_datetime", "DESC"]],
    });

    return {
      message: "Success",
      appointments, // chứa cả payment
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
