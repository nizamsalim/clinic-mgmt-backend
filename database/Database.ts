import { createConnection, Connection } from "mysql";

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

// export function connectDatabase() {
//     conn = createConnection({
//     host: "localhost",
//     user: "root",
//     password: "nizam123",
//   });
// }
