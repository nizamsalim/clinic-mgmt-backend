"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post("/patient/signup", authController_1.doPatientSignup);
// for PATIENT | DOCTOR | ADMIN
router.post("/:userRole/login", authController_1.doLogin);
exports.default = router;
