import { Request, Response } from "express";
import {
  PatientLogin,
  PatientSignup,
  USER_ROLE,
} from "../Interfaces/interfaces";
import { sign } from "jsonwebtoken";
import { db } from "../index";

// import { hashSync } from "bcrypt";
// import { hashSync } from "bcrypt";

export const JWT_SECRET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789987654321";

const internalServerError = (res: Response, err: Error) => {
  console.log(err);
  return res.status(500).json({
    success: false,
    statusCode: 500,
    error: "Internal Server Error",
  });
};

export const doPatientSignup = (req: Request, res: Response) => {
  const body: PatientSignup = req.body;
  const userExistsQuery = `select * from user where phone='${body.phone}'`;
  db.query(userExistsQuery, (err0, data) => {
    if (err0) {
      return internalServerError(res, err0);
    }
    if (data.length !== 0) {
      return res.json({
        success: false,
        error: "User with this phone number already exists",
      });
    }

    const createUserQuery = `insert into user(name,phone,user_role,username,password) values('${body.name}','${body.phone}','${USER_ROLE.patient}','${body.username}','${body.password}')`;
    db.query(createUserQuery, (err1, res1) => {
      if (err1) {
        return internalServerError(res, err1);
      }
      // console.log(result.insertId);
      const u_id = res1.insertId;
      const createPatientQuery = `insert into patient values(${u_id},'${body.dob}','${body.insurance_number}','${body.address}',0)`;
      db.query(createPatientQuery, (err2, res2) => {
        if (err2) {
          return internalServerError(res, err2);
        }
        const authToken = sign(
          { user_id: u_id, user_role: USER_ROLE.patient },
          JWT_SECRET
        );
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

export const doLogin = (req: Request, res: Response) => {
  const body: PatientLogin = req.body;
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

    const authToken = sign(
      {
        user_id: u_id,
        user_role: userRole.toUpperCase(),
      },
      JWT_SECRET
    );

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

export const doDoctorLogin = (req: Request, res: Response) => {};
