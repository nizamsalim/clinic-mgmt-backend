import { createConnection, Connection } from "mysql";
import { db } from "../index";
import internalServerError from "../Interfaces/ise";
import { Response } from "express";

export default class Database {
  private _db: Connection;
  constructor() {
    this._db = createConnection({
      host: "localhost",
      user: "root",
      password: "nizam123",
      // database: "dbs_project",
    });
    this._db.connect((err) => {
      if (err) throw err;
      this._db.query("create database if not exists dbs", (err0, res0) => {
        this._db.query("use dbs", (err1, res1) => {
          console.log("Database connected");
        });
      });
    });
  }

  public get db(): Connection {
    return this._db;
  }
}

export const runQuery = async (query: string, res: Response) => {
  return new Promise((resolve, reject) => {
    db.query(query, (err, res0) => {
      if (err) {
        return internalServerError(res, err);
      }
      resolve(res0);
    });
  });
};

// export function connectDatabase() {
//     conn = createConnection({
//     host: "localhost",
//     user: "root",
//     password: "nizam123",
//   });
// }
