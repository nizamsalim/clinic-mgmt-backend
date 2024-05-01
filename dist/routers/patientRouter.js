"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patientController_1 = require("../controllers/patientController");
const interfaces_1 = require("../Interfaces/interfaces");
const authController_1 = require("../controllers/authController");
const jsonwebtoken_1 = require("jsonwebtoken");
const router = (0, express_1.Router)();
const verifyPatientAuthToken = (req, res, next) => {
    const auth_token = req.headers["auth_token"];
    let payload;
    try {
        payload = (0, jsonwebtoken_1.verify)(auth_token, authController_1.JWT_SECRET);
    }
    catch (error) {
        return res.json({ success: false, error: "Incorrect auth token" });
    }
    if (payload.user_role !== interfaces_1.USER_ROLE.patient) {
        return res.json({ success: false, error: "Incorrect user role" });
    }
    req.user_id = payload.user_id;
    next();
};
router.get("/appointments", verifyPatientAuthToken, patientController_1.getMyAppointments);
router.post("/appointment/create", verifyPatientAuthToken, patientController_1.createAppointment);
router.post("/availabledoctors", verifyPatientAuthToken, patientController_1.getAvailableDoctors);
router.delete("/appointment/:appointment_id", verifyPatientAuthToken, patientController_1.deleteAppointment);
exports.default = router;
