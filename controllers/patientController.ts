import { Request, Response } from "express";
import { db } from "../index";

const internalServerError = (res: Response, err: Error) => {
  console.log(err);
  return res.status(500).json({
    success: false,
    statusCode: 500,
    error: "Internal Server Error",
  });
};

export const createAppointment = (req: Request, res: Response) => {
  const { doctor_availability_id } = req.body;
  const user_id = req.user_id;
  const appointmentExistsQuery = `SELECT COUNT(*) as count FROM appointment ap NATURAL JOIN patient_appointment pap NATURAL JOIN doctor_availability da NATURAL JOIN timeslot ts INNER JOIN (SELECT timeslot_id, da_date FROM doctor_availability WHERE doctor_availability_id=${doctor_availability_id}) AS subquery USING (timeslot_id, da_date) WHERE pap.patient_id=${user_id}`;
  db.query(appointmentExistsQuery, (e0, r0) => {
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
    db.query(
      `insert into appointment(doctor_availability_id) values(${doctor_availability_id})`,
      (err0, res0) => {
        if (err0) {
          return internalServerError(res, err0);
        }
        const appointment_id = res0.insertId;
        db.query(
          `select doctor_id from doctor_availability where doctor_availability_id=${doctor_availability_id}`,
          (err1, res1) => {
            if (err1) {
              return internalServerError(res, err1);
            }
            const doctor_id = res1[0].doctor_id;
            db.query(
              `insert into doctor_appointment values(${doctor_id},${appointment_id})`,
              (err2, res2) => {
                if (err2) {
                  return internalServerError(res, err2);
                }
                db.query(
                  `insert into patient_appointment values(${user_id},${appointment_id})`,
                  (err3, res3) => {
                    if (err3) {
                      return internalServerError(res, err3);
                    }
                    db.query(
                      `update doctor_availability set status='BOOKED' where doctor_availability_id=${doctor_availability_id}`,
                      (err4, res4) => {
                        if (err4) {
                          return internalServerError(res, err4);
                        }
                        res.json({
                          success: true,
                          appointmentId: appointment_id,
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};

export const getAvailableDoctors = (req: Request, res: Response) => {
  const { date, department_id, specialization_id } = req.body;

  const query = `select 
  da.doctor_availability_id,concat('Dr. ',u.name) as name,dpt.department_name,sp.specialization_name,da.da_date as date,ts.start_time,ts.end_time from 
  user u,doctor d,department dpt,specialization sp,doctor_availability da,timeslot ts
  where u.user_id=d.user_id and d.department_id=dpt.department_id and d.specialization_id=sp.specialization_id and da.doctor_id=u.user_id and 
  da.timeslot_id=ts.timeslot_id
  and d.department_id=${department_id} and sp.specialization_id=${specialization_id} and da.da_date='${date}' and da.status='FREE'`;
  db.query(query, (err0, res0) => {
    if (err0) {
      return internalServerError(res, err0);
    }
    return res.json({ success: true, doctors: res0 });
  });
};

export const getMyAppointments = (req: Request, res: Response) => {
  const user_id = req.user_id;
  const query = `select 
  ap.appointment_id,concat('Dr. ',u.name) as name,dpt.department_name,sp.specialization_name,da.da_date as date,
  ts.start_time,ts.end_time,ap.status from 
  user u,doctor d,department dpt,specialization sp,doctor_availability da,timeslot ts,appointment ap,
  doctor_appointment dap,patient_appointment pap 
  where pap.patient_id=${user_id} and dap.appointment_id=ap.appointment_id and pap.appointment_id=ap.appointment_id and 
  dap.doctor_id=d.user_id and u.user_id=d.user_id and ap.doctor_availability_id=da.doctor_availability_id and 
  da.timeslot_id=ts.timeslot_id and d.department_id=dpt.department_id and d.specialization_id=sp.specialization_id;`;
  db.query(query, (err0, res0) => {
    if (err0) {
      return internalServerError(res, err0);
    }
    return res.json({ success: true, appointments: res0 });
  });
};
