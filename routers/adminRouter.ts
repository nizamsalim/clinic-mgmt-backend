import { Router } from "express";
import {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  initDb,
} from "../controllers/adminController";
const router = Router();

router.get("/init", initDb);

router.post("/doctor/create", createDoctor);

// @TODO
router.post("/doctor/update", updateDoctor);

router.post("/doctor/delete", deleteDoctor);

export default router;
