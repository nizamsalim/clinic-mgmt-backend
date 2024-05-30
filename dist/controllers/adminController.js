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
exports.initDb = exports.test = exports.dropDb = exports.getPatientByName = exports.getAllPatients = exports.generateToken = exports.getAppointmentById = exports.getAppointments = exports.createSpecialization = exports.createDepartment = exports.getSpecializationsByDeptId = exports.getDoctorsBySpecialization = exports.getDoctorsByDepartment = exports.getAllSpecializations = exports.getAllDepartments = exports.deleteDoctor = exports.updateDoctor = exports.getDoctorByName = exports.getDoctors = exports.createDoctor = void 0;
const index_1 = require("../index");
const Database_1 = require("../database/Database");
const bcrypt_1 = require("bcrypt");
const internalServerError = (res, err) => {
    console.log(err);
    return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Internal Server Error",
    });
};
const createDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const USER_ROLE = "DOCTOR";
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
    const createUserQuery = `insert into user(name,phone,user_role,username,password) values('${body.name}','${body.phone}','${USER_ROLE}','${body.username}','${hash}')`;
    const res1 = (yield (0, Database_1.runQuery)(createUserQuery, res));
    const u_id = res1.insertId;
    const createDoctorQuery = `insert into doctor values(${u_id},'${body.license_number}',${body.salary},${body.department_id},${body.specialization_id})`;
    const res2 = (yield (0, Database_1.runQuery)(createDoctorQuery, res));
    const getDoctorDetailsQuery = `select * from user u natural join doctor d where d.user_id=u.user_id and u.user_id=${u_id}`;
    const res3 = (yield (0, Database_1.runQuery)(getDoctorDetailsQuery, res));
    const doctor = res3[0];
    return res.json({
        success: true,
        doctor,
    });
});
exports.createDoctor = createDoctor;
const getDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = "select u.user_id,CONCAT('Dr. ',u.name) as name,u.phone,d.license_number,d.salary,de.department_name,s.specialization_name from user u natural join doctor d natural join department de natural join specialization s";
    const res0 = (yield (0, Database_1.runQuery)(query, res));
    return res.json({
        success: true,
        doctors: res0,
    });
});
exports.getDoctors = getDoctors;
const getDoctorByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    const query = `select u.user_id,CONCAT('Dr. ',u.name) as name,u.phone,d.license_number,d.salary,de.department_name,s.specialization_name from user u natural join doctor d natural join department de natural join specialization s where u.name like '%${name}%'`;
    const res0 = yield (0, Database_1.runQuery)(query, res);
    return res.json({
        success: true,
        doctors: res0,
    });
});
exports.getDoctorByName = getDoctorByName;
const updateDoctor = (req, res) => {
    const body = req.body;
};
exports.updateDoctor = updateDoctor;
const deleteDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctor_id } = req.params;
    const deleteDoctorQuery = `delete from doctor where user_id=${doctor_id}`;
    const deleteUserQuery = `delete from user where user_id=${doctor_id}`;
    yield (0, Database_1.runQuery)(deleteDoctorQuery, res);
    yield (0, Database_1.runQuery)(deleteUserQuery, res);
    res.json({ success: true });
});
exports.deleteDoctor = deleteDoctor;
const getAllDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const q = "SELECT * from department";
    const res0 = yield (0, Database_1.runQuery)(q, res);
    return res.json({ success: true, departments: res0 });
});
exports.getAllDepartments = getAllDepartments;
const getAllSpecializations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const q = "SELECT s.specialization_id,s.specialization_name,d.department_name from specialization s natural join department d";
    const res0 = yield (0, Database_1.runQuery)(q, res);
    return res.json({ success: true, specializations: res0 });
});
exports.getAllSpecializations = getAllSpecializations;
const getDoctorsByDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { department_id } = req.params;
    const q = `select u.user_id,CONCAT('Dr. ',u.name) as name,u.phone,d.license_number,d.salary,de.department_name,s.specialization_name from user u natural join doctor d natural join department de natural join specialization s where de.department_id=${department_id}`;
    const res0 = yield (0, Database_1.runQuery)(q, res);
    return res.json({ success: true, doctors: res0 });
});
exports.getDoctorsByDepartment = getDoctorsByDepartment;
const getDoctorsBySpecialization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { specialization_id } = req.params;
    const q = `select u.user_id,CONCAT('Dr. ',u.name) as name,u.phone,d.license_number,d.salary,de.department_name,s.specialization_name from user u natural join doctor d natural join department de natural join specialization s where s.specialization_id=${specialization_id}`;
    const res0 = yield (0, Database_1.runQuery)(q, res);
    return res.json({ success: true, doctors: res0 });
});
exports.getDoctorsBySpecialization = getDoctorsBySpecialization;
const getSpecializationsByDeptId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { deptId } = req.params;
    const q = `select s.specialization_id,s.specialization_name,d.department_name from department d natural join specialization s where d.department_id=${deptId}`;
    const res0 = yield (0, Database_1.runQuery)(q, res);
    return res.json({ success: true, specializations: res0 });
});
exports.getSpecializationsByDeptId = getSpecializationsByDeptId;
const createDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { department_name } = req.body;
    const q = `insert into department(department_name) values('${department_name}')`;
    const res0 = yield (0, Database_1.runQuery)(q, res);
    return res.json({ success: true });
});
exports.createDepartment = createDepartment;
const createSpecialization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { specialization_name, department_id } = req.body;
    const q = `insert into specialization(department_id,specialization_name) values(${department_id},'${specialization_name}')`;
    const res0 = yield (0, Database_1.runQuery)(q, res);
    return res.json({ success: true });
});
exports.createSpecialization = createSpecialization;
const getAppointments = (req, res) => {
    const getAppointmentMappings = `select ap.appointment_id,pap.patient_id,dap.doctor_id from appointment ap natural join patient_appointment pap natural join doctor_appointment dap`;
    let appointments = [];
    index_1.db.query(getAppointmentMappings, (err0, res0) => __awaiter(void 0, void 0, void 0, function* () {
        if (err0) {
            return internalServerError(res, err0);
        }
        if (!res0 || res0.length === 0) {
            return res.json({ success: true, appointments: [] });
        }
        for (let i = 0; i < res0.length; i++) {
            let appointment = res0[i];
            const getAppointmentDetails = `select ap.appointment_id,da.da_date as date,ts.start_time,ts.end_time,ap.status from appointment ap,doctor_availability da,timeslot ts where ap.doctor_availability_id=da.doctor_availability_id and da.timeslot_id=ts.timeslot_id and ap.appointment_id=${appointment.appointment_id}`;
            const getPatientDetails = `select u.name,u.phone,p.dob,p.insurance_number,p.visits from user u natural join patient p where u.user_id=${appointment.patient_id}`;
            const getDoctorDetails = `select concat('Dr. ',u.name) as name,u.phone,d.department_name,s.specialization_name from user u natural join doctor do natural join department d natural join specialization s where u.user_id=${appointment.doctor_id}`;
            const appointmentDetails = yield (0, Database_1.runQuery)(getAppointmentDetails, res);
            const doctorDetails = yield (0, Database_1.runQuery)(getDoctorDetails, res);
            const patientDetails = yield (0, Database_1.runQuery)(getPatientDetails, res);
            appointments.push({
                appointmentDetails,
                doctorDetails,
                patientDetails,
            });
        }
        res.json({ success: true, appointments });
    }));
};
exports.getAppointments = getAppointments;
const getAppointmentById = (req, res) => {
    const { appointment_id } = req.params;
    const getAppointmentMappings = `select ap.appointment_id,pap.patient_id,dap.doctor_id from appointment ap natural join patient_appointment pap natural join doctor_appointment dap where ap.appointment_id=${appointment_id}`;
    let appointments = [];
    index_1.db.query(getAppointmentMappings, (err0, res0) => __awaiter(void 0, void 0, void 0, function* () {
        if (err0) {
            return internalServerError(res, err0);
        }
        if (!res0 || res0.length === 0) {
            return res.json({ success: true, appointments: [] });
        }
        let appointment = res0[0];
        const getAppointmentDetails = `select ap.appointment_id,da.da_date as date,ts.start_time,ts.end_time,ap.status from appointment ap,doctor_availability da,timeslot ts where ap.doctor_availability_id=da.doctor_availability_id and da.timeslot_id=ts.timeslot_id and ap.appointment_id=${appointment.appointment_id}`;
        const getPatientDetails = `select u.name,u.phone,p.dob,p.insurance_number,p.visits from user u natural join patient p where u.user_id=${appointment.patient_id}`;
        const getDoctorDetails = `select concat('Dr. ',u.name) as name,u.phone,d.department_name,s.specialization_name from user u natural join doctor do natural join department d natural join specialization s where u.user_id=${appointment.doctor_id}`;
        const appointmentDetails = yield (0, Database_1.runQuery)(getAppointmentDetails, res);
        const doctorDetails = yield (0, Database_1.runQuery)(getDoctorDetails, res);
        const patientDetails = yield (0, Database_1.runQuery)(getPatientDetails, res);
        appointments.push({
            appointmentDetails,
            doctorDetails,
            patientDetails,
        });
        res.json({ success: true, appointments });
    }));
};
exports.getAppointmentById = getAppointmentById;
const generateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment_id = req.body.appointment_id;
    yield (0, Database_1.runQuery)(`update appointment set status='COMPLETED' where appointment_id=${appointment_id}`, res);
    yield (0, Database_1.runQuery)(`update patient set visits=visits+1 where user_id=(select patient_id from patient_appointment where patient_appointment.appointment_id=${appointment_id})`, res);
    return res.json({ success: true });
});
exports.generateToken = generateToken;
const getAllPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const q = "select u.user_id,u.name,u.phone,p.dob,p.insurance_number,p.address,p.visits from user u natural join patient p";
    const res0 = yield (0, Database_1.runQuery)(q, res);
    return res.json({ success: true, patients: res0 });
});
exports.getAllPatients = getAllPatients;
const getPatientByName = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    const q = `select u.user_id,u.name,u.phone,p.dob,p.insurance_number,p.address,p.visits from user u natural join patient p where u.name like '%${name}%'`;
    const res0 = yield (0, Database_1.runQuery)(q, res);
    return res.json({ success: true, patients: res0 });
});
exports.getPatientByName = getPatientByName;
const dropDb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dropQueries = [
        "drop table doctor_appointment",
        "drop table patient_appointment",
        "drop table appointment",
        "drop table doctor_availability",
        "drop table timeslot",
        "drop table doctor",
        "drop table specialization",
        "drop table department",
        "drop table patient",
        "drop table user",
    ];
    for (let i = 0; i < dropQueries.length; i++) {
        yield (0, Database_1.runQuery)(dropQueries[i], res);
    }
    res.end();
});
exports.dropDb = dropDb;
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, Database_1.runQuery)("select * from user", res);
    res.json({ success: true, data: data });
});
exports.test = test;
const initDb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const initQueries = [
        // "create database if not exists dbs",
        "use sql12710339",
        "create table if not exists user (user_id int primary key auto_increment,name varchar(50),phone varchar(10),user_role ENUM('ADMIN','PATIENT','DOCTOR'),username varchar(20),password varchar(100))",
        "create table if not exists patient(user_id int,dob date,insurance_number varchar(7),address varchar(100),visits int,foreign key(user_id) references user(user_id) on delete cascade)",
        "create table if not exists department(department_id int primary key auto_increment,department_name varchar(20))",
        "create table if not exists specialization(specialization_id int primary key auto_increment,specialization_name varchar(50),department_id int,foreign key(department_id) references department(department_id) on delete cascade)",
        "create table if not exists doctor(user_id int,license_number varchar(7),salary int,department_id int,specialization_id int,foreign key(user_id) references user(user_id) on delete cascade,foreign key(department_id) references department(department_id) on delete cascade,foreign key(specialization_id) references specialization(specialization_id) on delete cascade)",
        "create table if not exists timeslot(timeslot_id int primary key auto_increment, start_time varchar(10), end_time varchar(10),unique(start_time,end_time))",
        "create table if not exists doctor_availability(doctor_availability_id int primary key auto_increment,doctor_id int,timeslot_id int,foreign key(doctor_id) references doctor(user_id) on delete cascade,foreign key(timeslot_id) references timeslot(timeslot_id) on delete cascade,da_date date,status ENUM('FREE','BOOKED') default 'FREE')",
        "create table if not exists appointment(appointment_id int primary key auto_increment,doctor_availability_id int, foreign key(doctor_availability_id) references doctor_availability(doctor_availability_id) on delete cascade,status ENUM('BOOKED','COMPLETED','CANCELLED') default 'BOOKED')",
        "create table if not exists patient_appointment(patient_id int,appointment_id int, foreign key(patient_id) references patient(user_id) on delete cascade,foreign key(appointment_id) references appointment(appointment_id) on delete cascade)",
        "create table if not exists doctor_appointment(doctor_id int,appointment_id int, foreign key(doctor_id) references doctor(user_id) on delete cascade,foreign key(appointment_id) references appointment(appointment_id) on delete cascade)",
        // "alter table user auto_increment=1000",
        // "alter table patient auto_increment=2000",
        // "alter table department auto_increment=8000",
        // "alter table specialization auto_increment=9000",
        // "alter table doctor auto_increment=3000",
        // "alter table timeslot auto_increment=7000",
        "alter table user auto_increment=1000",
        "alter table appointment auto_increment=3000",
        "INSERT INTO timeslot (start_time, end_time) VALUES \
    ('10:00 A.M.', '10:15 A.M.'),\
    ('10:15 A.M.', '10:30 A.M.'),\
    ('10:30 A.M.', '10:45 A.M.'),\
    ('10:45 A.M.', '11:00 A.M.'),\
    ('11:00 A.M.', '11:15 A.M.'),\
    ('11:15 A.M.', '11:30 A.M.'),\
    ('11:30 A.M.', '11:45 A.M.'),\
    ('11:45 A.M.', '12:00 P.M.'),\
    ('2:00 P.M.', '2:15 P.M.'),\
    ('2:15 P.M.', '2:30 P.M.'),\
    ('2:30 P.M.', '2:45 P.M.'),\
    ('2:45 P.M.', '3:00 P.M.'),\
    ('3:00 P.M.', '3:15 P.M.'),\
    ('3:15 P.M.', '3:30 P.M.'),\
    ('3:30 P.M.', '3:45 P.M.'),\
    ('3:45 P.M.', '4:00 P.M.')",
        "INSERT INTO department (department_name) VALUES ('Cardiology')",
        "INSERT INTO department (department_name) VALUES ('Orthopaedics')",
        "INSERT INTO department (department_name) VALUES ('Pediatrics')",
        // "INSERT INTO department (department_name) VALUES ('Oncology')",
        // "INSERT INTO department (department_name) VALUES ('Ophthalmology')",
        // "INSERT INTO department (department_name) VALUES ('Neurology')",
        "INSERT INTO specialization (specialization_name, department_id) VALUES \
      ('Interventional Cardiology', 1),\
      ('Electrophysiology', 1),\
      ('Heart Failure and Transplant Cardiology', 1)",
        "INSERT INTO specialization (specialization_name, department_id) VALUES \
      ('Sports Medicine', 2),\
      ('Orthopaedic Trauma', 2),\
      ('Joint Replacement', 2)",
        "INSERT INTO specialization (specialization_name, department_id) VALUES \
      ('Neonatology', 3),\
      ('Pediatric Oncology', 3),\
      ('Pediatric Cardiology', 3)",
        // "INSERT INTO specialization (specialization_name, department_id) VALUES \
        //   ('Medical Oncology', 4),\
        //   ('Radiation Oncology', 4),\
        //   ('Surgical Oncology', 4)",
        // "INSERT INTO specialization (specialization_name, department_id) VALUES \
        //   ('Retina and Vitreous', 5),\
        //   ('Cornea and External Disease', 5),\
        //   ('Ophthalmic Plastic Surgery', 5)",
        // "INSERT INTO specialization (specialization_name, department_id) VALUES \
        //   ('Stroke Neurology', 6),\
        //   ('Epilepsy', 6),\
        //   ('Movement Disorders', 6)",
        "insert into user(name,user_role,username,password) values('Admin','ADMIN','admin','admin123')",
    ];
    for (let i = 0; i < initQueries.length; i++) {
        try {
            yield (0, Database_1.runQuery)(initQueries[i], res);
        }
        catch (error) {
            continue;
        }
    }
    res.end();
});
exports.initDb = initDb;
