import { Request, Response } from "express";
import {
  CreateResponse,
  PatientLogin,
  PatientSignup,
  SelectResponse,
  USER_ROLE,
  User,
} from "../Interfaces/interfaces";
import { sign } from "jsonwebtoken";
import { db } from "../index";
import internalServerError from "../Interfaces/ise";
import { runQuery } from "../database/Database";

import { compareSync, hashSync } from "bcrypt";

export const JWT_SECRET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789987654321";

export const doPatientSignup = async (req: Request, res: Response) => {
  const body: PatientSignup = req.body;
  const userExistsQuery = `select * from user where phone='${body.phone}'`;

  const data = (await runQuery(userExistsQuery, res)) as SelectResponse;
  if (data.length !== 0) {
    return res.json({
      success: false,
      error: "User with this phone number already exists",
    });
  }

  const hash = hashSync(body.password, 10);

  const createUserQuery = `insert into user(name,phone,user_role,username,password) values('${body.name}','${body.phone}','${USER_ROLE.patient}','${body.username}','${hash}')`;
  const res1 = (await runQuery(createUserQuery, res)) as CreateResponse;
  const u_id = res1.insertId;

  const createPatientQuery = `insert into patient values(${u_id},'${body.dob}','${body.insurance_number}','${body.address}',0)`;
  (await runQuery(createPatientQuery, res)) as CreateResponse;

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
};

export const doLogin = async (req: Request, res: Response) => {
  const body: PatientLogin = req.body;
  const { userRole } = req.params;

  const userExistsQuery = `select * from user where username='${body.username}'`;
  const res0 = (await runQuery(userExistsQuery, res)) as SelectResponse;
  if (res0.length === 0) {
    return res.json({
      success: false,
      error: "User does not exists",
    });
  }

  const user = res0[0] as User;

  const roleMatches = user.user_role === userRole.toUpperCase();

  let passwordMatches;
  if (userRole.toUpperCase() === USER_ROLE.admin) {
    passwordMatches = body.password === user.password;
  } else {
    passwordMatches = compareSync(body.password, user.password);
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
};
