import express from "express";
import * as specializationController from "../controllers/specializationController.js";
import multer from "multer";
import authentication from "../middlewares/authentication.js";
import authorized from "../middlewares/authorization.js";

const specializationRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

specializationRouter.get(
  "/all",
  authentication,
  authorized(["patient", "admin"]),
  specializationController.getAllSpecializations
);

specializationRouter.post(
  "/create",
  authentication,
  authorized(["admin"]),
  upload.single("image"),
  specializationController.createSpecialization
);

specializationRouter.patch(
  "/update/:specialization_id",
  authentication,
  authorized(["admin"]),
  upload.single("image"),
  specializationController.updateSpecialization
);

specializationRouter.delete(
  "/delete/:specialization_id",
  authentication,
  authorized(["admin"]),
  specializationController.deleteSpecialization
);

export default specializationRouter;
