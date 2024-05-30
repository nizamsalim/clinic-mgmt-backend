"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = require("./routers/index");
const Database_1 = __importDefault(require("./database/Database"));
const app = (0, express_1.default)();
const obj = new Database_1.default();
exports.db = obj.db;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", index_1.authRouter);
app.use("/api/admin", index_1.adminRouter);
app.use("/api/doctor", index_1.doctorRouter);
app.use("/api/patient", index_1.patientRouter);
app.listen(5000, () => {
    console.log("Server started");
});
