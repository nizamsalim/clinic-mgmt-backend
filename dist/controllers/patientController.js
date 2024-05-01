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
exports.deleteAppointment = exports.getMyAppointments = exports.getAvailableDoctors = exports.createAppointment = void 0;
const index_1 = require("../index");
const adminController_1 = require("./adminController");
const internalServerError = (res, err) => {
    console.log(err);
    return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Internal Server Error",
    });
};
const createAppointment = (req, res) => {
    const { doctor_availability_id } = req.body;
    const user_id = req.user_id;
    const appointmentExistsQuery = `SELECT COUNT(*) as count FROM appointment ap NATURAL JOIN patient_appointment pap NATURAL JOIN doctor_availability da NATURAL JOIN timeslot ts INNER JOIN (SELECT timeslot_id, da_date FROM doctor_availability WHERE doctor_availability_id=${doctor_availability_id}) AS subquery USING (timeslot_id, da_date) WHERE pap.patient_id=${user_id}`;
    index_1.db.query(appointmentExistsQuery, (e0, r0) => {
        if (e0) {
            return internalServerError(res, e0);
        }
        const count = r0[0].count;
        if (count != 0) {
            return res.json({
                success: false,
                error: "You already have an appointment at the selected time",
            });
        }
        index_1.db.query(`insert into appointment(doctor_availability_id) values(${doctor_availability_id})`, (err0, res0) => {
            if (err0) {
                return internalServerError(res, err0);
            }
            const appointment_id = res0.insertId;
            index_1.db.query(`select doctor_id from doctor_availability where doctor_availability_id=${doctor_availability_id}`, (err1, res1) => {
                if (err1) {
                    return internalServerError(res, err1);
                }
                const doctor_id = res1[0].doctor_id;
                index_1.db.query(`insert into doctor_appointment values(${doctor_id},${appointment_id})`, (err2, res2) => {
                    if (err2) {
                        return internalServerError(res, err2);
                    }
                    index_1.db.query(`insert into patient_appointment values(${user_id},${appointment_id})`, (err3, res3) => {
                        if (err3) {
                            return internalServerError(res, err3);
                        }
                        index_1.db.query(`update doctor_availability set status='BOOKED' where doctor_availability_id=${doctor_availability_id}`, (err4, res4) => {
                            if (err4) {
                                return internalServerError(res, err4);
                            }
                            res.json({
                                success: true,
                                appointmentId: appointment_id,
                            });
                        });
                    });
                });
            });
        });
    });
};
exports.createAppointment = createAppointment;
const getAvailableDoctors = (req, res) => {
    const { date, department_id, specialization_id } = req.body;
    const query = `select 
  da.doctor_availability_id,concat('Dr. ',u.name) as name,dpt.department_name,sp.specialization_name,da.da_date as date,ts.start_time,ts.end_time from 
  user u,doctor d,department dpt,specialization sp,doctor_availability da,timeslot ts
  where u.user_id=d.user_id and d.department_id=dpt.department_id and d.specialization_id=sp.specialization_id and da.doctor_id=u.user_id and 
  da.timeslot_id=ts.timeslot_id
  and d.department_id=${department_id} and sp.specialization_id=${specialization_id} and da.da_date='${date}' and da.status='FREE'`;
    index_1.db.query(query, (err0, res0) => {
        if (err0) {
            return internalServerError(res, err0);
        }
        return res.json({ success: true, doctors: res0 });
    });
};
exports.getAvailableDoctors = getAvailableDoctors;
const getMyAppointments = (req, res) => {
    const user_id = req.user_id;
    const query = `select 
  ap.appointment_id,concat('Dr. ',u.name) as name,dpt.department_name,sp.specialization_name,da.da_date as date,
  ts.start_time,ts.end_time,ap.status from 
  user u,doctor d,department dpt,specialization sp,doctor_availability da,timeslot ts,appointment ap,
  doctor_appointment dap,patient_appointment pap 
  where pap.patient_id=${user_id} and dap.appointment_id=ap.appointment_id and pap.appointment_id=ap.appointment_id and 
  dap.doctor_id=d.user_id and u.user_id=d.user_id and ap.doctor_availability_id=da.doctor_availability_id and 
  da.timeslot_id=ts.timeslot_id and d.department_id=dpt.department_id and d.specialization_id=sp.specialization_id;`;
    index_1.db.query(query, (err0, res0) => {
        if (err0) {
            return internalServerError(res, err0);
        }
        return res.json({ success: true, appointments: res0 });
    });
};
exports.getMyAppointments = getMyAppointments;
const deleteAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { appointment_id } = req.params;
    const result = (yield (0, adminController_1.runQuery)(`select da.doctor_availability_id from appointment da where da.appointment_id=${appointment_id}`, res));
    const { doctor_availability_id } = result;
    yield (0, adminController_1.runQuery)(`update appointment set status='CANCELLED' where appointment_id=${appointment_id}`, res);
    yield (0, adminController_1.runQuery)(`update doctor_availability da set da.status='FREE' where da.doctor_availability_id=${doctor_availability_id}`, res);
    res.json({ success: true });
});
exports.deleteAppointment = deleteAppointment;
