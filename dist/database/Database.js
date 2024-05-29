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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runQuery = void 0;
const mysql_1 = require("mysql");
const index_1 = require("../index");
const ise_1 = __importDefault(require("../Interfaces/ise"));
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
const runQuery = (query, res) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        index_1.db.query(query, (err, res0) => {
            if (err) {
                return (0, ise_1.default)(res, err);
            }
            resolve(res0);
        });
    });
});
exports.runQuery = runQuery;
// export function connectDatabase() {
//     conn = createConnection({
//     host: "localhost",
//     user: "root",
//     password: "nizam123",
//   });
// }
