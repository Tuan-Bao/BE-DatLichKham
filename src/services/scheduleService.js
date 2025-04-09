import initDB from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";

const db = await initDB();
const Schedule = db.Schedule;
const User = db.User;
const Doctor = db.Doctor;

export const updateDoctorSchedule = async (user_id, updateData) => {
  const transaction = await db.sequelize.transaction();
  try {
    const user = await User.findByPk(user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Doctor, as: "doctor" }],
      transaction,
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { doctor } = user;
    if (!doctor) {
      throw new NotFoundError("Patient not found");
    }

    const doctor_id = doctor.doctor_id;
    const schedule = await Schedule.findOne(
      { where: { doctor_id } },
      {
        transaction,
      }
    );

    if (!schedule) {
      throw new NotFoundError("Schedule not found");
    }

    // Cập nhật các ngày làm việc
    const allowedDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    for (const key of Object.keys(updateData)) {
      if (!allowedDays.includes(key)) {
        throw new BadRequestError(`Invalid day: ${key}`);
      }
    }

    Object.assign(schedule, updateData);
    await schedule.save({ transaction });

    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    throw new Error(error.message);
  }
};
