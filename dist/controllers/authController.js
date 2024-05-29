"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doLogin = exports.doPatientSignup = exports.JWT_SECRET = void 0;
const interfaces_1 = require("../Interfaces/interfaces");
const jsonwebtoken_1 = require("jsonwebtoken");
const Database_1 = require("../database/Database");
const bcrypt_1 = require("bcrypt");
exports.JWT_SECRET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789987654321";
const doPatientSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const userExistsQuery = `select * from user where phone='${body.phone}'`;
    const data = (yield (0, Database_1.runQuery)(userExistsQuery, res));
    if (data.length !== 0) {
        return res.json({
            success: false,
            error: "User with this phone number already exists",
        });
    }
    const hash = (0, bcrypt_1.hashSync)(body.password, 10);
    const createUserQuery = `insert into user(name,phone,user_role,username,password) values('${body.name}','${body.phone}','${interfaces_1.USER_ROLE.patient}','${body.username}','${hash}')`;
    const res1 = (yield (0, Database_1.runQuery)(createUserQuery, res));
    const u_id = res1.insertId;
    const createPatientQuery = `insert into patient values(${u_id},'${body.dob}','${body.insurance_number}','${body.address}',0)`;
    (yield (0, Database_1.runQuery)(createPatientQuery, res));
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
exports.doPatientSignup = doPatientSignup;
const doLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { userRole } = req.params;
    const userExistsQuery = `select * from user where username='${body.username}'`;
    const res0 = (yield (0, Database_1.runQuery)(userExistsQuery, res));
    if (res0.length === 0) {
        return res.json({
            success: false,
            error: "User does not exists",
        });
    }
    const user = res0[0];
    const roleMatches = user.user_role === userRole.toUpperCase();
    let passwordMatches;
    if (userRole.toUpperCase() === interfaces_1.USER_ROLE.admin) {
        passwordMatches = body.password === user.password;
    }
    else {
        passwordMatches = (0, bcrypt_1.compareSync)(body.password, user.password);
    }
    if (!roleMatches) {
        return res.json({
            status: false,
            error: "Roles do not match",
        });
    }
    if (!passwordMatches) {
        return res.json({
            success: false,
            error: "Incorrect password",
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
exports.doLogin = doLogin;
