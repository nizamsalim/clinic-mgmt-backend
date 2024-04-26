import express from "express";
import cors from "cors";
import { config } from "dotenv";

import {
  adminRouter,
  doctorRouter,
  patientRouter,
  authRouter,
} from "./routers/index";
import Database from "./database/Database";

const app = express();

config();

new Database();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/patient", patientRouter);

app.listen(5000, () => {
  console.log("server on 5000");
});
