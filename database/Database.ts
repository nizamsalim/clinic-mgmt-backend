import { createConnection, Connection } from "mysql";
import { db } from "../index";
import internalServerError from "../Interfaces/ise";
import { Response } from "express";
import { config } from "dotenv";

export default class Database {
  private _db: Connection;
  constructor() {
    config();
    const localConn = createConnection({
      host: "localhost",
      user: "root",
      password: "nizam123",
      database: "dbs",
    });
    const remoteConn = createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
    });
    this._db = remoteConn;
    this._db.connect((err) => {
      if (err) throw err;
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
