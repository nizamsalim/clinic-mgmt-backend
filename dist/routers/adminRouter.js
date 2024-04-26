"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
router.get("/init", adminController_1.initDb);
router.post("/doctor/create", adminController_1.createDoctor);
// @TODO
router.post("/doctor/update", adminController_1.updateDoctor);
router.post("/doctor/delete", adminController_1.deleteDoctor);
exports.default = router;
