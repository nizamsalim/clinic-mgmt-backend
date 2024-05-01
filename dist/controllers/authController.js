"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doDoctorLogin = exports.doLogin = exports.doPatientSignup = exports.JWT_SECRET = void 0;
const interfaces_1 = require("../Interfaces/interfaces");
const jsonwebtoken_1 = require("jsonwebtoken");
const index_1 = require("../index");
// import { hashSync } from "bcrypt";
// import { hashSync } from "bcrypt";
exports.JWT_SECRET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789987654321";
const internalServerError = (res, err) => {
    console.log(err);
    return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Internal Server Error",
    });
};
const doPatientSignup = (req, res) => {
    const body = req.body;
    const userExistsQuery = `select * from user where phone='${body.phone}'`;
    index_1.db.query(userExistsQuery, (err0, data) => {
        if (err0) {
            return internalServerError(res, err0);
        }
        if (data.length !== 0) {
            return res.json({
                success: false,
                error: "User with this phone number already exists",
            });
        }
        const createUserQuery = `insert into user(name,phone,user_role,username,password) values('${body.name}','${body.phone}','${interfaces_1.USER_ROLE.patient}','${body.username}','${body.password}')`;
        index_1.db.query(createUserQuery, (err1, res1) => {
            if (err1) {
                return internalServerError(res, err1);
            }
            // console.log(result.insertId);
            const u_id = res1.insertId;
            const createPatientQuery = `insert into patient values(${u_id},'${body.dob}','${body.insurance_number}','${body.address}',0)`;
            index_1.db.query(createPatientQuery, (err2, res2) => {
                if (err2) {
                    return internalServerError(res, err2);
                }
                const authToken = (0, jsonwebtoken_1.sign)({ user_id: u_id, user_role: interfaces_1.USER_ROLE.patient }, exports.JWT_SECRET);
                return res.json({
                    success: true,
                    user: {
                        user_id: u_id,
                        username: body.name,
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
    index_1.db.query(userExistsQuery, (err0, res0) => {
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
        }, exports.JWT_SECRET);
        return res.json({
            success: true,
            user: {
                user_id: u_id,
                username: user.name,
            },
            auth_token: authToken,
        });
    });
};
exports.doLogin = doLogin;
const doDoctorLogin = (req, res) => { };
exports.doDoctorLogin = doDoctorLogin;
