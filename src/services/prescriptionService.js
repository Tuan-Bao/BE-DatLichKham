import db from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";

// const db = await initDB();
const Prescription = db.Prescription;
const Appointment = db.Appointment;

export const addPrescription = async (appointment_id, medicine_details) => {
  const transaction = await db.sequelize.transaction();
  try {
    const appointment = await Appointment.findByPk(appointment_id, {
      include: [{ model: Prescription, as: "prescription" }],
      transaction,
    });

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    if (appointment.status !== "completed") {
      throw new BadRequestError(
        "Prescription can only be created after appointment is completed"
      );
    }

    if (appointment.prescription) {
      throw new BadRequestError("Prescription already exists");
    }

    await Prescription.create(
      {
        appointment_id,
        medicine_details,
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

export const updatePrescription = async (prescription_id, medicine_details) => {
  const transaction = await db.sequelize.transaction();
  try {
    const prescription = await Prescription.findByPk(prescription_id, {
      transaction,
    });

    if (!prescription) {
      throw new NotFoundError("Prescription not found");
    }

    if (medicine_details) {
      prescription.medicine_details = medicine_details;
    }

    await prescription.save({ transaction });
    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
