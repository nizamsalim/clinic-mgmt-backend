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

const obj = new Database();
export const db = obj.db;

app.use(cors());
app.use(express.json());

app.get("/health_check",(req,res)=>{
  res.status(200).json({
    success:true,
    statusCode:200,
    message:"Server healthy"
  })
})

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/patient", patientRouter);

app.listen(5000, () => {
  console.log("Server started");
});
