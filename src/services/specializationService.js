import initDB from "../models/index.js";
import cloudinary from "../config/cloudinary.js";
import BadRequestError from "../errors/bad_request.js";
import NotFoundError from "../errors/not_found.js";

const db = await initDB();
const Specialization = db.Specialization;

export const getAllSpecializations = async () => {
  try {
    const specializations = await Specialization.findAll();
    if (specializations.length === 0) {
      throw new NotFoundError("No specializations found");
    }

    return { message: "Success", specializations };
  } catch (error) {
    throw new Error(error.message);
  }
};

// export const getSpecializationsById = async (specialization_id) => {
//   try {
//     const specialization = await Specialization.findByPk(specialization_id);
//     if (!specialization) {
//       throw new NotFoundError("Specialization not found");
//     }

//     return { message: "Success", specialization };
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

export const createSpecialization = async (name, fees, imageFile) => {
  const transaction = await db.sequelize.transaction();
  try {
    const existingSpecialization = await Specialization.findOne({
      where: { name },
      transaction,
    });
    if (existingSpecialization) {
      throw new BadRequestError("Specialization already exists");
    }

    let imageUrl = null;
    if (imageFile) {
      const uploadResult = await cloudinary.uploader.upload(imageFile, {
        folder: "specializations",
        use_filename: true,
        unique_filename: false,
      });

      imageUrl = uploadResult.secure_url;
    }

    await Specialization.create(
      {
        name,
        fees,
        image:
          imageUrl ||
          "https://cdn1.youmed.vn/tin-tuc/wp-content/uploads/2023/05/yhocduphong.png",
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

export const updateSpecialization = async (specialization_id, updateData) => {
  const transaction = await db.sequelize.transaction();
  try {
    const specialization = await Specialization.findByPk(specialization_id, {
      transaction,
    });
    if (!specialization) {
      throw new NotFoundError("Specialization not found");
    }

    const data = {};

    if (updateData.name) {
      const existingSpecialization = await Specialization.findOne({
        where: { name: updateData.name },
        transaction,
      });

      if (existingSpecialization) {
        throw new BadRequestError("Specialization name already exists.");
      }

      data.name = updateData.name;
    }

    if (updateData.fees) {
      data.fees = updateData.fees;
    }

    if (updateData.image) {
      const uploadResult = await cloudinary.uploader.upload(updateData.image, {
        folder: "specializations",
        use_filename: true,
        unique_filename: false,
      });

      let imageUrl = uploadResult.secure_url;

      data.image = imageUrl;
    }

    await specialization.update({ ...data }, { transaction });

    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

export const deleteSpecialization = async (specialization_id) => {
  const transaction = await db.sequelize.transaction();
  try {
    const specialization = await Specialization.findByPk(specialization_id, {
      transaction,
    });
    if (!specialization) {
      throw new NotFoundError("Specialization not found");
    }

    await specialization.destroy({ transaction });
    await transaction.commit();
    return { message: "Success" };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
