import initDB from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";

const db = await initDB();
const MedicalRecord = db.MedicalRecord;
const Appointment = db.Appointment;

export const addMedicalRecord = async (
  appointment_id,
  diagnosis,
  treatment,
  notes
) => {
  const transaction = await db.sequelize.transaction();
  try {
    const appointment = await Appointment.findByPk(appointment_id, {
      include: [{ model: MedicalRecord, as: "medical_record" }],
      transaction,
    });
    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    if (appointment.status !== "completed") {
      throw new BadRequestError(
        "Medical record can only be created after appointment is completed"
      );
    }

    if (appointment.medical_record) {
      throw new BadRequestError("Medical record already exists");
    }

    await MedicalRecord.create(
      {
        appointment_id,
        diagnosis,
        treatment,
        notes,
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

export const updateMedicalRecord = async (
  record_id,
  diagnosis,
  treatment,
  notes
) => {
  const transaction = await db.sequelize.transaction();
  try {
    const medicalRecord = await MedicalRecord.findByPk(record_id, {
      transaction,
    });
    if (!medicalRecord) {
      throw new NotFoundError("Medical record not found");
    }

    if (diagnosis) {
      medicalRecord.diagnosis = diagnosis;
    }

    if (treatment) {
      medicalRecord.treatment = treatment;
    }

    if (notes) {
      medicalRecord.notes = notes;
    }

    await medicalRecord.save({ transaction });
    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
