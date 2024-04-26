import { Router } from "express";
import { doPatientSignup, doLogin } from "../controllers/authController";
const router = Router();

router.post("/patient/signup", doPatientSignup);

// for PATIENT | DOCTOR | ADMIN
router.post("/:userRole/login", doLogin);

export default router;
