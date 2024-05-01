"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAppointments = exports.getDoctorAvailability = exports.deleteDoctorAvailability = exports.getTimeSlotsByDate = exports.createDoctorAvailability = void 0;
const index_1 = require("../index");
const internalServerError = (res, err) => {
    console.log(err);
    return res.status(500).json({
        success: false,
        statusCode: 500,
        error: "Internal Server Error",
    });
};
const createDoctorAvailability = (req, res) => {
    const { timeslot_id, da_date } = req.body;
    const user_id = req.user_id;
    const createDoctorAvailabilityQuery = `insert into doctor_availability(doctor_id,timeslot_id,da_date) values (${user_id},${timeslot_id},'${da_date}')`;
    index_1.db.query(createDoctorAvailabilityQuery, (err0, res0) => {
        if (err0) {
            return internalServerError(res, err0);
        }
        return res.json({ success: true });
    });
};
exports.createDoctorAvailability = createDoctorAvailability;
const getTimeSlotsByDate = (req, res) => {
    const user_id = req.user_id;
    const { da_date } = req.body;
    // console.log(da_date);
    const query = `select * from timeslot where timeslot_id not in (select timeslot_id from doctor_availability where doctor_id=${user_id} and da_date='${da_date}');`;
    index_1.db.query(query, (err0, res0) => {
        if (err0) {
            return internalServerError(res, err0);
        }
        return res.json({ success: true, timeslots: res0 });
    });
};
exports.getTimeSlotsByDate = getTimeSlotsByDate;
const deleteDoctorAvailability = (req, res) => {
    const { doctor_availability_id } = req.params;
    const deleteDoctorAvailabilityQuery = `delete from doctor_availability where doctor_availability_id=${doctor_availability_id}`;
    index_1.db.query(deleteDoctorAvailabilityQuery, (err0, res0) => {
        if (err0) {
            return internalServerError(res, err0);
        }
        return res.json({ success: true });
    });
};
exports.deleteDoctorAvailability = deleteDoctorAvailability;
const getDoctorAvailability = (req, res) => {
    const user_id = req.user_id;
    const getDoctorAvailabilityQuery = `SELECT da.doctor_availability_id,da.da_date,da.status,ts.start_time,ts.end_time from doctor_availability da natural join timeslot ts where da.doctor_id=${user_id}`;
    index_1.db.query(getDoctorAvailabilityQuery, (err0, res0) => {
        if (err0) {
            return internalServerError(res, err0);
        }
        return res.json({ success: true, doctorAvailabilities: res0 });
    });
};
exports.getDoctorAvailability = getDoctorAvailability;
const getMyAppointments = (req, res) => {
    const user_id = req.user_id;
    const query = ` select 
  ap.appointment_id,u.name,p.dob,da.da_date as date,ts.start_time,ts.end_time,ap.status 
  from user u,patient p,doctor_availability da,timeslot ts,appointment ap,doctor_appointment dap,patient_appointment pap 
  where dap.doctor_id=${user_id} and dap.appointment_id=ap.appointment_id and 
  pap.appointment_id=ap.appointment_id and pap.patient_id=p.user_id and 
  u.user_id=p.user_id and ap.doctor_availability_id=da.doctor_availability_id 
  and da.timeslot_id=ts.timeslot_id`;
    index_1.db.query(query, (err0, res0) => {
        if (err0) {
            return internalServerError(res, err0);
        }
        return res.json({ success: true, appointments: res0 });
    });
};
exports.getMyAppointments = getMyAppointments;
