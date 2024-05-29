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
exports.getMyAppointments = exports.getDoctorAvailability = exports.deleteDoctorAvailability = exports.getTimeSlotsByDate = exports.createDoctorAvailability = void 0;
const Database_1 = require("../database/Database");
const createDoctorAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { timeslot_id, da_date } = req.body;
    const user_id = req.user_id;
    const createDoctorAvailabilityQuery = `insert into doctor_availability(doctor_id,timeslot_id,da_date) values (${user_id},${timeslot_id},'${da_date}')`;
    yield (0, Database_1.runQuery)(createDoctorAvailabilityQuery, res);
    return res.json({ success: true });
});
exports.createDoctorAvailability = createDoctorAvailability;
const getTimeSlotsByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.user_id;
    const { da_date } = req.body;
    // console.log(da_date);
    const query = `select * from timeslot where timeslot_id not in (select timeslot_id from doctor_availability where doctor_id=${user_id} and da_date='${da_date}');`;
    const res0 = yield (0, Database_1.runQuery)(query, res);
    return res.json({ success: true, timeslots: res0 });
});
exports.getTimeSlotsByDate = getTimeSlotsByDate;
const deleteDoctorAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctor_availability_id } = req.params;
    const deleteDoctorAvailabilityQuery = `delete from doctor_availability where doctor_availability_id=${doctor_availability_id}`;
    yield (0, Database_1.runQuery)(deleteDoctorAvailabilityQuery, res);
    return res.json({ success: true });
});
exports.deleteDoctorAvailability = deleteDoctorAvailability;
const getDoctorAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.user_id;
    const getDoctorAvailabilityQuery = `SELECT da.doctor_availability_id,da.da_date,da.status,ts.start_time,ts.end_time from doctor_availability da natural join timeslot ts where da.doctor_id=${user_id}`;
    const res0 = yield (0, Database_1.runQuery)(getDoctorAvailabilityQuery, res);
    return res.json({ success: true, doctorAvailabilities: res0 });
});
exports.getDoctorAvailability = getDoctorAvailability;
const getMyAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.user_id;
    const query = ` select 
  ap.appointment_id,u.name,p.dob,da.da_date as date,ts.start_time,ts.end_time,ap.status 
  from user u,patient p,doctor_availability da,timeslot ts,appointment ap,doctor_appointment dap,patient_appointment pap 
  where dap.doctor_id=${user_id} and dap.appointment_id=ap.appointment_id and 
  pap.appointment_id=ap.appointment_id and pap.patient_id=p.user_id and 
  u.user_id=p.user_id and ap.doctor_availability_id=da.doctor_availability_id 
  and da.timeslot_id=ts.timeslot_id`;
    const res0 = yield (0, Database_1.runQuery)(query, res);
    return res.json({ success: true, appointments: res0 });
});
exports.getMyAppointments = getMyAppointments;
