"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("mysql");
class Database {
    constructor() {
        this._db = (0, mysql_1.createConnection)({
            host: "localhost",
            user: "root",
            password: "nizam123",
            // database: "dbs_project",
        });
        this._db.connect((err) => {
            if (err)
                throw err;
            this._db.query("create database if not exists dbs", (err0, res0) => {
                this._db.query("use dbs", (err1, res1) => {
                    console.log("Database connected");
                });
            });
        });
    }
    get db() {
        return this._db;
    }
}
exports.default = Database;
// export function connectDatabase() {
//     conn = createConnection({
//     host: "localhost",
//     user: "root",
//     password: "nizam123",
//   });
// }
