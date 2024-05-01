import { Router } from "express";
import {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  initDb,
  getDoctors,
  getAllDepartments,
  getSpecializationsByDeptId,
  getAllSpecializations,
  getDoctorsByDepartment,
  getDoctorsBySpecialization,
  createDepartment,
  createSpecialization,
  getAppointments,
  generateToken,
} from "../controllers/adminController";
const router = Router();

router.get("/init", initDb);

router.post("/doctor/create", createDoctor);

router.get("/doctors/get", getDoctors);

// @TODO
router.post("/doctor/update", updateDoctor);

router.post("/doctor/delete", deleteDoctor);

router.get("/departments", getAllDepartments);

router.get("/specializations", getAllSpecializations);

router.get("/specialization/:deptId", getSpecializationsByDeptId);

router.get("/doctors/d/:department_id", getDoctorsByDepartment);

router.get("/doctors/s/:specialization_id", getDoctorsBySpecialization);

router.post("/department/create", createDepartment);

router.post("/specialization/create", createSpecialization);

router.get("/appointments", getAppointments);

router.post("/token", generateToken);

export default router;
