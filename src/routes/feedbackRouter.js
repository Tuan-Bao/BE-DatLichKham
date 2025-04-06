import express from "express";
import * as feedbackController from "../controllers/feedbackController.js";
import authentication from "../middlewares/authentication.js";
import authorized from "../middlewares/authorization.js";

const feedbackRouter = express.Router();

feedbackRouter.post(
  "/add",
  authentication,
  authorized(["patient"]),
  feedbackController.addFeedback
);

feedbackRouter.patch(
  "/update/:feedback_id",
  authentication,
  authorized(["patient"]),
  feedbackController.updateFeedback
);

export default feedbackRouter;
