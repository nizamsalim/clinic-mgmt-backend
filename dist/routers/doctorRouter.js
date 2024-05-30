"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctorController_1 = require("../controllers/doctorController");
const authController_1 = require("../controllers/authController");
const interfaces_1 = require("../Interfaces/interfaces");
const jsonwebtoken_1 = require("jsonwebtoken");
const router = (0, express_1.Router)();
const verifyDoctorAuthToken = (req, res, next) => {
    const auth_token = req.headers["auth_token"];
    let payload;
    try {
        payload = (0, jsonwebtoken_1.verify)(auth_token, authController_1.JWT_SECRET);
    }
    catch (error) {
        return res.json({ success: false, error: "Incorrect auth token" });
    }
    if (payload.user_role !== interfaces_1.USER_ROLE.doctor) {
        return res.json({ success: false, error: "Incorrect user role" });
    }
    req.user_id = payload.user_id;
    next();
};
router.get("/appointments", verifyDoctorAuthToken, doctorController_1.getMyAppointments);
router.get("/availability/get", verifyDoctorAuthToken, doctorController_1.getDoctorAvailability);
router.post("/availability/create", verifyDoctorAuthToken, doctorController_1.createDoctorAvailability);
router.delete("/availability/delete/:doctor_availability_id", verifyDoctorAuthToken, doctorController_1.deleteDoctorAvailability);
router.post("/timeslot/get", verifyDoctorAuthToken, doctorController_1.getTimeSlotsByDate);
exports.default = router;
