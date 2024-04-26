"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDb = exports.deleteDoctor = exports.updateDoctor = exports.createDoctor = void 0;
const Database_1 = __importDefault(require("../database/Database"));
const internalServerError = (res, err) => {
    console.log(err);
    return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Internal Server Error",
    });
};
const obj = new Database_1.default();
const db = obj.db;
const createDoctor = (req, res) => {
    const USER_ROLE = "DOCTOR";
    const body = req.body;
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
        // const passwordHash = hashSync(body.password, 10);
        const createUserQuery = `insert into user(name,phone,user_role,username,password) values('${body.name}','${body.phone}','${USER_ROLE}','${body.username}','${body.password}')`;
        db.query(createUserQuery, (err1, res1) => {
            if (err1) {
                return internalServerError(res, err1);
            }
            // console.log(result.insertId);
            const u_id = res1.insertId;
            const createDoctorQuery = `insert into doctor values(${u_id},'${body.license_number}',${body.salary},${body.department_id},${body.specialization_id})`;
            db.query(createDoctorQuery, (err2, res2) => {
                if (err2) {
                    return internalServerError(res, err2);
                }
                const getDoctorDetailsQuery = `select * from user u natural join doctor d where d.user_id=u.user_id and u.user_id=${u_id}`;
                db.query(getDoctorDetailsQuery, (err3, res3) => {
                    if (err3) {
                        return internalServerError(res, err3);
                    }
                    const doctor = res3[0];
                    return res.json({
                        success: true,
                        doctor,
                    });
                });
            });
        });
    });
};
exports.createDoctor = createDoctor;
const updateDoctor = (req, res) => {
    const body = req.body;
};
exports.updateDoctor = updateDoctor;
const deleteDoctor = (req, res) => {
    const { user_id } = req.body;
    const deleteDoctorQuery = `delete from doctor where user_id=${user_id}`;
    const deleteUserQuery = `delete from user where user_id=${user_id}`;
    db.query(deleteDoctorQuery, (err0, res0) => {
        if (err0) {
            return internalServerError(res, err0);
        }
        db.query(deleteUserQuery, (err1, res1) => {
            if (err1) {
                return internalServerError(res, err1);
            }
            res.json({ success: true });
        });
    });
};
exports.deleteDoctor = deleteDoctor;
const initDb = (req, res) => {
    const initQueries = [
        "create table if not exists user (user_id int primary key auto_increment,name varchar(50),phone varchar(10),user_role ENUM('ADMIN','PATIENT','DOCTOR'),username varchar(20),password varchar(10))",
        "create table if not exists patient(user_id int,dob date,insurance_number varchar(7),address varchar(100),visits int,foreign key(user_id) references user(user_id))",
        "create table if not exists department(department_id int primary key auto_increment,department_name varchar(20))",
        "create table if not exists specialization(specialization_id int primary key auto_increment,specialization_name varchar(20))",
        "create table if not exists doctor(user_id int,license_number varchar(7),salary int,department_id int,specialization_id int,foreign key(user_id) references user(user_id),foreign key(department_id) references department(department_id),foreign key(specialization_id) references specialization(specialization_id))",
        "create table if not exists timeslot(timeslot_id int primary key auto_increment, start_time varchar(10), end_time varchar(10),unique(start_time,end_time))",
        "create table if not exists appointment(appointment_id int primary key auto_increment,appointment_date date,timeslot_id int,status ENUM('BOOKED','COMPLETED') default('BOOKED'))",
        "create table if not exists doctor_availability(doctor_id int,timeslot_id int,foreign key(doctor_id) references doctor(user_id),foreign key(timeslot_id) references timeslot(timeslot_id),da_date date)",
        // "alter table user auto_increment=1000",
        // "alter table patient auto_increment=2000",
        // "alter table department auto_increment=8000",
        // "alter table specialization auto_increment=9000",
        // "alter table doctor auto_increment=3000",
        "alter table timeslot auto_increment=7000",
        "INSERT INTO timeslot (start_time, end_time) VALUES \
    ('10:00 A.M.', '10:15 A.M.'),\
    ('10:15 A.M.', '10:30 A.M.'),\
    ('10:30 A.M.', '10:45 A.M.'),\
    ('10:45 A.M.', '11:00 A.M.'),\
    ('11:00 A.M.', '11:15 A.M.'),\
    ('11:15 A.M.', '11:30 A.M.'),\
    ('11:30 A.M.', '11:45 A.M.'),\
    ('11:45 A.M.', '12:00 P.M.')",
        "INSERT INTO timeslot (start_time, end_time) VALUES \
    ('2:00 P.M.', '2:15 P.M.'),\
    ('2:15 P.M.', '2:30 P.M.'),\
    ('2:30 P.M.', '2:45 P.M.'),\
    ('2:45 P.M.', '3:00 P.M.'),\
    ('3:00 P.M.', '3:15 P.M.'),\
    ('3:15 P.M.', '3:30 P.M.'),\
    ('3:30 P.M.', '3:45 P.M.'),\
    ('3:45 P.M.', '4:00 P.M.')",
        "insert into department(department_name) values('Cardiology')",
        "insert into specialization(specialization_name) values('Cardiac Surgeon')",
    ];
    for (let i = 0; i < initQueries.length; i++) {
        try {
            db.query(initQueries[i]);
        }
        catch (error) {
            continue;
        }
    }
    console.log();
    res.end();
};
exports.initDb = initDb;
