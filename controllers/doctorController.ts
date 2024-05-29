import { Response, Request } from "express";
import { db } from "../index";
import internalServerError from "../Interfaces/ise";
import { runQuery } from "../database/Database";

export const createDoctorAvailability = async (req: Request, res: Response) => {
  const { timeslot_id, da_date } = req.body;
  const user_id = req.user_id;
  const createDoctorAvailabilityQuery = `insert into doctor_availability(doctor_id,timeslot_id,da_date) values (${user_id},${timeslot_id},'${da_date}')`;
  await runQuery(createDoctorAvailabilityQuery, res);
  return res.json({ success: true });
};

export const getTimeSlotsByDate = async (req: Request, res: Response) => {
  const user_id = req.user_id;
  const { da_date } = req.body;
  // console.log(da_date);
  const query = `select * from timeslot where timeslot_id not in (select timeslot_id from doctor_availability where doctor_id=${user_id} and da_date='${da_date}');`;
  const res0 = await runQuery(query, res);
  return res.json({ success: true, timeslots: res0 });
};

export const deleteDoctorAvailability = async (req: Request, res: Response) => {
  const { doctor_availability_id } = req.params;
  const deleteDoctorAvailabilityQuery = `delete from doctor_availability where doctor_availability_id=${doctor_availability_id}`;
  await runQuery(deleteDoctorAvailabilityQuery, res);
  return res.json({ success: true });
};

export const getDoctorAvailability = async (req: Request, res: Response) => {
  const user_id = req.user_id;
  const getDoctorAvailabilityQuery = `SELECT da.doctor_availability_id,da.da_date,da.status,ts.start_time,ts.end_time from doctor_availability da natural join timeslot ts where da.doctor_id=${user_id}`;
  const res0 = await runQuery(getDoctorAvailabilityQuery, res);
  return res.json({ success: true, doctorAvailabilities: res0 });
};

export const getMyAppointments = async (req: Request, res: Response) => {
  const user_id = req.user_id;
  const query = ` select 
  ap.appointment_id,u.name,p.dob,da.da_date as date,ts.start_time,ts.end_time,ap.status 
  from user u,patient p,doctor_availability da,timeslot ts,appointment ap,doctor_appointment dap,patient_appointment pap 
  where dap.doctor_id=${user_id} and dap.appointment_id=ap.appointment_id and 
  pap.appointment_id=ap.appointment_id and pap.patient_id=p.user_id and 
  u.user_id=p.user_id and ap.doctor_availability_id=da.doctor_availability_id 
  and da.timeslot_id=ts.timeslot_id`;
  const res0 = await runQuery(query, res);
  return res.json({ success: true, appointments: res0 });
};
