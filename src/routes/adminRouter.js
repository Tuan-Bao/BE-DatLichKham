import express from "express";
import * as adminController from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/register", adminController.registerAdmin);

adminRouter.post("/login", adminController.loginAdmin);

export default adminRouter;
