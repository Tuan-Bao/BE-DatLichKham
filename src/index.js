import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import errorHandler from "./middlewares/errorHandle.js";
import notFoundRouter from "./middlewares/notFoundRouter.js";
import { configDotenv } from "dotenv";

configDotenv({ path: "src/.env" });

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// Router

app.use(notFoundRouter);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
