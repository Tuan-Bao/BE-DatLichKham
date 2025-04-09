import initDB from "../models/index.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";

const db = await initDB();
const Feedback = db.Feedback;
const Appointment = db.Appointment;

export const addFeedback = async (appointment_id, rating, comment) => {
  const transaction = await db.sequelize.transaction();
  try {
    const appointment = await Appointment.findByPk(appointment_id, {
      include: [{ model: Feedback, as: "feedback" }],
      transaction,
    });

    if (!appointment) {
      throw new NotFoundError("Appointment not found");
    }

    if (appointment.status !== "completed") {
      throw new BadRequestError(
        "You can only give feedback to completed appointments"
      );
    }

    if (appointment.feedback) {
      throw new BadRequestError("Feedback already exists");
    }

    await Feedback.create(
      {
        appointment_id,
        rating,
        comment,
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

export const updateFeedback = async (feedback_id, rating, comment) => {
  const transaction = await db.sequelize.transaction();
  try {
    const feedback = await Feedback.findByPk(feedback_id, {
      transaction,
    });

    if (!feedback) {
      throw new NotFoundError("Feedback not found");
    }

    if (rating) {
      feedback.rating = rating;
    }

    if (comment) {
      feedback.comment = comment;
    }

    await feedback.save({ transaction });
    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

/*
DELIMITER $$

CREATE TRIGGER update_doctor_rating_after_insert
AFTER INSERT ON Feedbacks
FOR EACH ROW
BEGIN
  DECLARE doctorId INT;

  SELECT doctor_id INTO doctorId
  FROM Appointments
  WHERE appointment_id = NEW.appointment_id;

  UPDATE Doctors
  SET rating = (
    SELECT ROUND(AVG(f.rating), 1)
    FROM Appointments a
    JOIN Feedbacks f ON f.appointment_id = a.appointment_id
    WHERE a.doctor_id = doctorId
  )
  WHERE doctor_id = doctorId;
END$$

DELIMITER ;
*/

/*
DELIMITER $$

CREATE TRIGGER update_doctor_rating_after_update
AFTER UPDATE ON Feedbacks
FOR EACH ROW
BEGIN
  DECLARE doctorId INT;

  SELECT doctor_id INTO doctorId
  FROM Appointments
  WHERE appointment_id = NEW.appointment_id;

  UPDATE Doctors
  SET rating = (
    SELECT ROUND(AVG(f.rating), 1)
    FROM Appointments a
    JOIN Feedbacks f ON f.appointment_id = a.appointment_id
    WHERE a.doctor_id = doctorId
  )
  WHERE doctor_id = doctorId;
END$$

DELIMITER ;
*/
