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
  getAppointmentById,
  getAllPatients,
  getPatientByName,
  getDoctorByName,
} from "../controllers/adminController";
const router = Router();

router.get("/init", initDb);

router.post("/doctor/create", createDoctor);

router.get("/doctors/get", getDoctors);

router.get("/doctor/get/:name", getDoctorByName);

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

router.get("/appointment/:appointment_id", getAppointmentById);

router.post("/token", generateToken);

router.get("/patients", getAllPatients);

router.get("/patient/:name", getPatientByName);

export default router;
