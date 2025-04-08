import db from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";
import { Op } from "sequelize";

// const db = await initDB();
const Appointment = db.Appointment;
const User = db.User;
const Doctor = db.Doctor;
const Speacialization = db.Specialization;
const Schedule = db.Schedule;
const Patient = db.Patient;
const Feedback = db.Feedback;
const Prescription = db.Prescription;
const MedicalRecord = db.MedicalRecord;
const Payment = db.Payment;

export const bookAppointment = async (
  user_id,
  doctor_id,
  appointment_datetime
) => {
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

    const doctor = await Doctor.findByPk(doctor_id, {
      include: [
        {
          model: Speacialization,
          as: "specialization",
        },
        {
          model: Schedule,
          as: "schedule",
        },
      ],
      transaction,
    });

    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    const appointmentTime = new Date(appointment_datetime);
    const dayOfWeek = appointmentTime
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase(); // e.g. 'monday'
    console.log(appointmentTime, dayOfWeek);
    const schedule = doctor.schedule;
    if (schedule[dayOfWeek] === false) {
      throw new BadRequestError(`Doctor is not available on ${dayOfWeek}`);
    }

    const doctorConflict = await Appointment.findOne({
      where: {
        doctor_id,
        appointment_datetime: appointmentTime,
        status: {
          [Op.in]: ["waiting_for_confirmation", "accepted"],
        },
      },
      transaction,
    });

    if (doctorConflict) {
      throw new BadRequestError(
        "Doctor already has an appointment at this time"
      );
    }

    const patientConflict = await Appointment.findOne({
      where: {
        patient_id: patient.patient_id,
        appointment_datetime: appointmentTime,
        status: {
          [Op.in]: ["waiting_for_confirmation", "accepted"],
        },
      },
      transaction,
    });

    if (patientConflict) {
      throw new BadRequestError("You already have an appointment at this time");
    }

    await Appointment.create(
      {
        patient_id: patient.patient_id,
        doctor_id,
        appointment_datetime,
        fees: doctor.speacialization.fees,
      },
      { transaction }
    );

    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

export const acceptAppointment = async (appointment_id) => {
  const transaction = await db.sequelize.transaction();
  try {
    const appointment = await Appointment.findByPk(appointment_id, {
      transaction,
    });

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    appointment.status = "accepted";
    await appointment.save({ transaction });

    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

export const cancelAppointmentByPatient = async (appointment_id) => {
  const transaction = await db.sequelize.transaction();
  try {
    const appointment = await Appointment.findByPk(appointment_id, {
      transaction,
    });

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    const now = new Date();
    const appointmentDate = new Date(appointment.appointment_datetime);
    const oneDayBefore = new Date(appointmentDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    console.log(now, appointmentDate, oneDayBefore);

    if (appointment.status === "waiting_for_confirmation") {
      // Bệnh nhân hủy khi chưa được bác sĩ xác nhận
      appointment.status = "cancelled";
    } else if (appointment.status === "accepted") {
      // Bệnh nhân chỉ được hủy nếu còn trước 1 ngày
      if (now > oneDayBefore) {
        throw new BadRequestError(
          "You can only cancel accepted appointments at least 1 day in advance."
        );
      }
      appointment.status = "cancelled";
    } else {
      throw new BadRequestError("You cannot cancel this appointment.");
    }
    await appointment.save({ transaction });

    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

export const cancelAppointmentByDoctor = async (appointment_id) => {
  const transaction = await db.sequelize.transaction();
  try {
    const appointment = await Appointment.findByPk(appointment_id, {
      transaction,
    });

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    const now = new Date();
    const appointmentDate = new Date(appointment.appointment_datetime);
    const oneDayBefore = new Date(appointmentDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    console.log(now, appointmentDate, oneDayBefore);

    if (appointment.status === "waiting_for_confirmation") {
      // Bác sĩ hủy khi chưa xác nhận
      appointment.status = "cancelled";
    } else if (appointment.status === "accepted") {
      // Bác sĩ chỉ được hủy nếu còn trước 1 ngày
      if (now > oneDayBefore) {
        throw new BadRequestError(
          "You cannot cancel this appointment less than 1 day in advance."
        );
      }
      appointment.status = "cancelled";
    } else {
      throw new BadRequestError("You cannot cancel this appointment.");
    }
    await appointment.save({ transaction });

    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

export const completeAppointment = async (appointment_id) => {
  const transaction = await db.sequelize.transaction();
  try {
    const appointment = await Appointment.findByPk(appointment_id, {
      transaction,
    });

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    if (appointment.status === "completed") {
      throw new BadRequestError("Appointment is already completed");
    }

    appointment.status = "completed";
    await appointment.save({ transaction });

    const existingPayment = await Payment.findOne({
      where: { appointment_id },
      transaction,
    });

    if (!existingPayment) {
      await Payment.create(
        {
          appointment_id,
          amount: appointment.fees,
        },
        { transaction }
      );
    }

    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

export const markPatientNotComing = async (appointment_id) => {
  const transaction = await db.sequelize.transaction();
  try {
    const appointment = await Appointment.findByPk(appointment_id, {
      transaction,
    });

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    appointment.status = "patient_not_coming";
    await appointment.save({ transaction });

    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

export const getAllAppointments = async () => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        {
          model: Patient,
          as: "patient",
          include: [
            { model: User, as: "user", attributes: { exclude: ["password"] } },
          ],
        },
        {
          model: Doctor,
          as: "doctor",
          include: [
            { model: User, as: "user", attributes: { exclude: ["password"] } },
            { model: Specialization, as: "specialization" },
          ],
        },
      ],
    });
    if (appointments.length === 0) {
      throw new NotFoundError("No appointments found");
    }
    return { message: "Success", appointments };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPaidAppointments = async () => {
  try {
    const paidAppointments = await Appointment.findAll({
      where: { status: "completed" },
      include: [
        {
          model: Patient,
          as: "patient",
          include: [
            { model: User, as: "user", attributes: { exclude: ["password"] } },
          ],
        },
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
          where: { status: "paid" },
          required: true,
        },
      ],
      order: [["appointment_datetime", "DESC"]],
    });

    /*
    Khi dùng include + where, mặc định Sequelize dùng LEFT OUTER JOIN, tức là:
    - Vẫn lấy bản ghi từ bảng Appointment
    - Dù không có Payment, chỉ cần có Appointment, nó vẫn trả về (payment sẽ là null)
    - Điều này phá vỡ điều kiện lọc status: "paid" nếu bạn không cẩn thận
    -> dùng required: true, Sequelize sẽ dùng INNER JOIN
    */

    return { message: "Success", paidAppointments };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAppointmentsDetails = async (appointment_id) => {
  try {
    const appointmentDetails = await Appointment.findByPk(appointment_id, {
      include: [
        {
          model: Feedback,
          as: "feedback",
        },
        {
          model: Prescription,
          as: "prescription",
        },
        {
          model: MedicalRecord,
          as: "medical_record",
        },
        {
          model: Payment,
          as: "payment",
        },
      ],
    });

    if (!appointmentDetails) {
      throw new NotFoundError("No appointment found");
    }

    return { message: "Success", appointmentDetails };
  } catch (error) {
    throw new Error(error.message);
  }
};
