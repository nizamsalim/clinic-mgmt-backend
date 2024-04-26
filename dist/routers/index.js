"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = exports.doctorRouter = exports.patientRouter = exports.adminRouter = void 0;
const adminRouter_1 = __importDefault(require("./adminRouter"));
exports.adminRouter = adminRouter_1.default;
const patientRouter_1 = __importDefault(require("./patientRouter"));
exports.patientRouter = patientRouter_1.default;
const doctorRouter_1 = __importDefault(require("./doctorRouter"));
exports.doctorRouter = doctorRouter_1.default;
const authRouter_1 = __importDefault(require("./authRouter"));
exports.authRouter = authRouter_1.default;
