"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doDoctorLogin = exports.doLogin = exports.doPatientSignup = void 0;
const Database_1 = __importDefault(require("../database/Database"));
const jsonwebtoken_1 = require("jsonwebtoken");
// import { hashSync } from "bcrypt";
// import { hashSync } from "bcrypt";
const obj = new Database_1.default();
const db = obj.db;
const JWT_SECRET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789987654321";
const USER_ROLES = {
    doctor: "DOCTOR",
    patient: "PATIENT",
    admin: "ADMIN",
};
const internalServerError = (res) => {
    return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Internal Server Error",
    });
};
const doPatientSignup = (req, res) => {
    const body = req.body;
    const userExistsQuery = `select * from user where phone='${body.phone}'`;
    db.query(userExistsQuery, (err0, data) => {
        if (err0) {
            return internalServerError(res);
        }
        if (data.length !== 0) {
            return res.json({
                success: false,
                error: "User with this phone number already exists",
            });
        }
        // const passwordHash = hashSync(body.password, 10);
        const createUserQuery = `insert into user(name,phone,user_role,username,password) values('${body.name}','${body.phone}','${USER_ROLES.patient}','${body.username}','${body.password}')`;
        db.query(createUserQuery, (err1, res1) => {
            if (err1) {
                return internalServerError(res);
            }
            // console.log(result.insertId);
            const u_id = res1.insertId;
            const createPatientQuery = `insert into patient values(${u_id},'${body.dob}','${body.insurance_number}','${body.address}',0)`;
            db.query(createPatientQuery, (err2, res2) => {
                if (err2) {
                    return internalServerError(res);
                }
                const authToken = (0, jsonwebtoken_1.sign)({ user_id: u_id, user_role: USER_ROLES.patient }, JWT_SECRET);
                return res.json({
                    success: true,
                    user: {
                        user_id: u_id,
                    },
                    auth_token: authToken,
                });
            });
        });
    });
};
exports.doPatientSignup = doPatientSignup;
const doLogin = (req, res) => {
    const body = req.body;
    const { userRole } = req.params;
    const userExistsQuery = `select * from user where username='${body.username}'`;
    db.query(userExistsQuery, (err0, res0) => {
        if (err0) {
        }
        if (res0.length === 0) {
            return res.json({
                success: false,
                error: "User does not exists",
            });
        }
        const user = res0[0];
        const passwordMatches = body.password === user.password;
        const roleMatches = user.user_role === userRole.toUpperCase();
        if (!passwordMatches) {
            return res.json({
                success: false,
                error: "Incorrect password",
            });
        }
        if (!roleMatches) {
            return res.json({
                status: false,
                error: "Roles do not match",
            });
        }
        const u_id = user.user_id;
        const authToken = (0, jsonwebtoken_1.sign)({
            user_id: u_id,
            user_role: userRole.toUpperCase(),
        }, JWT_SECRET);
        return res.json({
            success: true,
            user: {
                user_id: u_id,
            },
            auth_token: authToken,
        });
    });
};
exports.doLogin = doLogin;
const doDoctorLogin = (req, res) => { };
exports.doDoctorLogin = doDoctorLogin;
