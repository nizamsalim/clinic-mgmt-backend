import { Request, Response, Router } from "express";
import {
  createAppointment,
  getAvailableDoctors,
  getMyAppointments,
} from "../controllers/patientController";
import { JWTPayload, USER_ROLE } from "../Interfaces/interfaces";
import { JWT_SECRET } from "../controllers/authController";
import { verify } from "jsonwebtoken";
const router = Router();

const verifyPatientAuthToken = (
  req: Request,
  res: Response,
  next: Function
) => {
  const auth_token = req.headers["auth_token"] as string;
  let payload: JWTPayload;
  try {
    payload = verify(auth_token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return res.json({ success: false, error: "Incorrect auth token" });
  }
  if (payload.user_role !== USER_ROLE.patient) {
    return res.json({ success: false, error: "Incorrect user role" });
  }
  req.user_id = payload.user_id;
  next();
};

router.get("/appointments", verifyPatientAuthToken, getMyAppointments);

router.post("/appointment/create", verifyPatientAuthToken, createAppointment);

router.post("/availabledoctors", verifyPatientAuthToken, getAvailableDoctors);

export default router;
