import express from "express";
import * as specializationController from "../controllers/specializationController.js";
import multer from "multer";

const specializationRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

specializationRouter.post(
  "/create",
  upload.single("image"),
  specializationController.createSpecialization
);

specializationRouter.patch(
  "/update/:id",
  upload.single("image"),
  specializationController.updateSpecialization
);

export default specializationRouter;
