import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import errorHandler from "./middlewares/errorHandle.js";
import notFoundRouter from "./middlewares/notFoundRouter.js";
import { configDotenv } from "dotenv";

import patientRouter from "./routes/patientRouter.js";
import doctorRouter from "./routes/doctorRouter.js";
import adminRouter from "./routes/adminRouter.js";
import specializationRouter from "./routes/specializationRouter.js";
import scheduleRouter from "./routes/scheduleRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import feedbackRouter from "./routes/feedbackRouter.js";
import medicalRecordRouter from "./routes/medicalRecordRouter.js";
import prescriptionRouter from "./routes/prescriptionRouter.js";
import paymentRouter from "./routes/paymentRouter.js";

configDotenv({ path: "src/.env" });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// Routes
app.use("/api/patient", patientRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/specialization", specializationRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/medical_record", medicalRecordRouter);
app.use("/api/prescription", prescriptionRouter);
app.use("/api/payment", paymentRouter);

app.use(notFoundRouter);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
