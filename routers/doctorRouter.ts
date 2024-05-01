import { Request, Response, Router } from "express";
import {
  createDoctorAvailability,
  deleteDoctorAvailability,
  getDoctorAvailability,
  getMyAppointments,
  getTimeSlotsByDate,
} from "../controllers/doctorController";
import { JWT_SECRET } from "../controllers/authController";
import { JWTPayload, USER_ROLE } from "../Interfaces/interfaces";
import { verify } from "jsonwebtoken";

const router = Router();

const verifyDoctorAuthToken = (req: Request, res: Response, next: Function) => {
  const auth_token = req.headers["auth_token"] as string;
  let payload: JWTPayload;
  try {
    payload = verify(auth_token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error: "Incorrect auth token" });
  }
  if (payload.user_role !== USER_ROLE.doctor) {
    return res.json({ success: false, error: "Incorrect user role" });
  }
  req.user_id = payload.user_id;
  next();
};

router.get("/appointments", verifyDoctorAuthToken, getMyAppointments);

router.get("/availability/get", verifyDoctorAuthToken, getDoctorAvailability);

router.post(
  "/availability/create",
  verifyDoctorAuthToken,
  createDoctorAvailability
);

router.delete(
  "/availability/delete/:doctor_availability_id",
  verifyDoctorAuthToken,
  deleteDoctorAvailability
);

router.post("/timeslot/get", verifyDoctorAuthToken, getTimeSlotsByDate);

export default router;

declare global {
  namespace Express {
    interface Request {
      user_id?: number;
    }
  }
}
