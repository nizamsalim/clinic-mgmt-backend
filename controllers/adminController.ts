import { Request, Response } from "express";
import { DoctorCreate } from "../Interfaces/interfaces";
import { db } from "../index";

const internalServerError = (res: Response, err: Error) => {
  console.log(err);
  return res.status(500).json({
    success: false,
    statusCode: 500,
    error: "Internal Server Error",
  });
};

export const createDoctor = (req: Request, res: Response) => {
  const USER_ROLE = "DOCTOR";
  const body: DoctorCreate = req.body;
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

export const getDoctors = (req: Request, res: Response) => {
  const query =
    "select u.user_id,CONCAT('Dr. ',u.name) as name,u.phone,d.license_number,d.salary,de.department_name,s.specialization_name from user u natural join doctor d natural join department de natural join specialization s";
  db.query(query, (err0, res0) => {
    if (err0) {
      return internalServerError(res, err0);
    }
    return res.json({
      success: true,
      doctors: res0,
    });
  });
};

export const getDoctorByName = (req: Request, res: Response) => {
  const { name } = req.params;
  const query = `select u.user_id,CONCAT('Dr. ',u.name) as name,u.phone,d.license_number,d.salary,de.department_name,s.specialization_name from user u natural join doctor d natural join department de natural join specialization s where u.name like '%${name}%'`;
  db.query(query, (err0, res0) => {
    if (err0) {
      return internalServerError(res, err0);
    }
    return res.json({
      success: true,
      doctors: res0,
    });
  });
};

export const updateDoctor = (req: Request, res: Response) => {
  const body: DoctorCreate & { user_id: string; doctor_id: string } = req.body;
};

export const deleteDoctor = (req: Request, res: Response) => {
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

export const getAllDepartments = (req: Request, res: Response) => {
  db.query("SELECT * from department", (err0, res0) => {
    if (err0) {
      return internalServerError(res, err0);
    }
    return res.json({ success: true, departments: res0 });
  });
};

export const getAllSpecializations = (req: Request, res: Response) => {
  db.query(
    "SELECT s.specialization_id,s.specialization_name,d.department_name from specialization s natural join department d",
    (err0, res0) => {
      if (err0) {
        return internalServerError(res, err0);
      }
      return res.json({ success: true, specializations: res0 });
    }
  );
};

export const getDoctorsByDepartment = (req: Request, res: Response) => {
  const { department_id } = req.params;
  db.query(
    `select u.user_id,CONCAT('Dr. ',u.name) as name,u.phone,d.license_number,d.salary,de.department_name,s.specialization_name from user u natural join doctor d natural join department de natural join specialization s where de.department_id=${department_id}`,
    (err0, res0) => {
      if (err0) {
        return internalServerError(res, err0);
      }
      res.json({ success: true, doctors: res0 });
    }
  );
};
export const getDoctorsBySpecialization = (req: Request, res: Response) => {
  const { specialization_id } = req.params;
  db.query(
    `select u.user_id,CONCAT('Dr. ',u.name) as name,u.phone,d.license_number,d.salary,de.department_name,s.specialization_name from user u natural join doctor d natural join department de natural join specialization s where s.specialization_id=${specialization_id}`,
    (err0, res0) => {
      if (err0) {
        return internalServerError(res, err0);
      }
      res.json({ success: true, doctors: res0 });
    }
  );
};

export const getSpecializationsByDeptId = (req: Request, res: Response) => {
  const { deptId } = req.params;
  db.query(
    `select s.specialization_id,s.specialization_name,d.department_name from department d natural join specialization s where d.department_id=${deptId}`,
    (err0, res0) => {
      if (err0) {
        return internalServerError(res, err0);
      }
      return res.json({ success: true, specializations: res0 });
    }
  );
};

export const createDepartment = (req: Request, res: Response) => {
  const { department_name } = req.body;
  db.query(
    `insert into department(department_name) values('${department_name}')`,
    (err0, res0) => {
      if (err0) {
        return internalServerError(res, err0);
      }
      res.json({ success: true });
    }
  );
};
export const createSpecialization = (req: Request, res: Response) => {
  const { specialization_name, department_id } = req.body;
  db.query(
    `insert into specialization(department_id,specialization_name) values(${department_id},'${specialization_name}')`,
    (err0, res0) => {
      if (err0) {
        return internalServerError(res, err0);
      }
      res.json({ success: true });
    }
  );
};

interface AppointmentMapping {
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
}

export const runQuery = async (query: string, res: Response) => {
  return new Promise((resolve, reject) => {
    db.query(query, (err0, res0) => {
      if (err0) return internalServerError(res, err0);
      resolve(res0[0]);
    });
  });
};

export const getAppointments = (req: Request, res: Response) => {
  const getAppointmentMappings = `select ap.appointment_id,pap.patient_id,dap.doctor_id from appointment ap natural join patient_appointment pap natural join doctor_appointment dap`;
  let appointments: Array<Object> = [];
  db.query(
    getAppointmentMappings,
    async (err0: Error, res0: Array<AppointmentMapping>) => {
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
        const appointmentDetails = await runQuery(getAppointmentDetails, res);
        const doctorDetails = await runQuery(getDoctorDetails, res);
        const patientDetails = await runQuery(getPatientDetails, res);
        appointments.push({
          appointmentDetails,
          doctorDetails,
          patientDetails,
        });
      }
      res.json({ success: true, appointments });
    }
  );
};

export const getAppointmentById = (req: Request, res: Response) => {
  const { appointment_id } = req.params;
  const getAppointmentMappings = `select ap.appointment_id,pap.patient_id,dap.doctor_id from appointment ap natural join patient_appointment pap natural join doctor_appointment dap where ap.appointment_id=${appointment_id}`;
  let appointments: Array<Object> = [];
  db.query(
    getAppointmentMappings,
    async (err0: Error, res0: Array<AppointmentMapping>) => {
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
      const appointmentDetails = await runQuery(getAppointmentDetails, res);
      const doctorDetails = await runQuery(getDoctorDetails, res);
      const patientDetails = await runQuery(getPatientDetails, res);
      appointments.push({
        appointmentDetails,
        doctorDetails,
        patientDetails,
      });

      res.json({ success: true, appointments });
    }
  );
};

export const generateToken = async (req: Request, res: Response) => {
  const appointment_id = req.body.appointment_id;
  await runQuery(
    `update appointment set status='COMPLETED' where appointment_id=${appointment_id}`,
    res
  );
  await runQuery(
    `update patient set visits=visits+1 where user_id=(select patient_id from patient_appointment where patient_appointment.appointment_id=${appointment_id})`,
    res
  );
  return res.json({ success: true });
};

export const getAllPatients = (req: Request, res: Response) => {
  db.query(
    "select u.user_id,u.name,u.phone,p.dob,p.insurance_number,p.address,p.visits from user u natural join patient p",
    (err0, res0) => {
      if (err0) return internalServerError(res, err0);
      return res.json({ success: true, patients: res0 });
    }
  );
};

export const getPatientByName = (req: Request, res: Response) => {
  const { name } = req.params;
  db.query(
    `select u.user_id,u.name,u.phone,p.dob,p.insurance_number,p.address,p.visits from user u natural join patient p where u.name like '%${name}%'`,
    (err0, res0) => {
      if (err0) return internalServerError(res, err0);
      return res.json({ success: true, patients: res0 });
    }
  );
};

export const initDb = (req: Request, res: Response) => {
  const initQueries = [
    "create database if not exists dbs",
    "use dbs",
    "create table if not exists user (user_id int primary key auto_increment,name varchar(50),phone varchar(10),user_role ENUM('ADMIN','PATIENT','DOCTOR'),username varchar(20),password varchar(100))",
    "create table if not exists patient(user_id int,dob date,insurance_number varchar(7),address varchar(100),visits int,foreign key(user_id) references user(user_id) on delete cascade)",
    "create table if not exists department(department_id int primary key auto_increment,department_name varchar(20))",
    "create table if not exists specialization(specialization_id int primary key auto_increment,specialization_name varchar(50),department_id int,foreign key(department_id) references department(department_id) on delete cascade)",
    "create table if not exists doctor(user_id int,license_number varchar(7),salary int,department_id int,specialization_id int,foreign key(user_id) references user(user_id) on delete cascade,foreign key(department_id) references department(department_id) on delete cascade,foreign key(specialization_id) references specialization(specialization_id) on delete cascade)",
    "create table if not exists timeslot(timeslot_id int primary key auto_increment, start_time varchar(10), end_time varchar(10),unique(start_time,end_time))",
    "create table if not exists doctor_availability(doctor_availability_id int primary key auto_increment,doctor_id int,timeslot_id int,foreign key(doctor_id) references doctor(user_id) on delete cascade,foreign key(timeslot_id) references timeslot(timeslot_id) on delete cascade,da_date date,status ENUM('FREE','BOOKED') default('FREE'))",
    "create table if not exists appointment(appointment_id int primary key auto_increment,doctor_availability_id int, foreign key(doctor_availability_id) references doctor_availability(doctor_availability_id) on delete cascade,status ENUM('BOOKED','COMPLETED') default('BOOKED'))",
    "create table if not exists patient_appointment(patient_id int,appointment_id int, foreign key(patient_id) references patient(user_id) on delete cascade,foreign key(appointment_id) references appointment(appointment_id) on delete cascade)",
    "create table if not exists doctor_appointment(doctor_id int,appointment_id int, foreign key(doctor_id) references doctor(user_id) on delete cascade,foreign key(appointment_id) references appointment(appointment_id) on delete cascade)",
    // "alter table user auto_increment=1000",
    // "alter table patient auto_increment=2000",
    // "alter table department auto_increment=8000",
    // "alter table specialization auto_increment=9000",
    // "alter table doctor auto_increment=3000",
    // "alter table timeslot auto_increment=7000",
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
    "INSERT INTO department (department_name) VALUES ('Cardiology')",
    "INSERT INTO department (department_name) VALUES ('Orthopaedics')",
    "INSERT INTO department (department_name) VALUES ('Pediatrics')",
    "INSERT INTO department (department_name) VALUES ('Oncology')",
    "INSERT INTO department (department_name) VALUES ('Ophthalmology')",
    "INSERT INTO department (department_name) VALUES ('Neurology')",

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
    "INSERT INTO specialization (specialization_name, department_id) VALUES \
      ('Medical Oncology', 4),\
      ('Radiation Oncology', 4),\
      ('Surgical Oncology', 4)",
    "INSERT INTO specialization (specialization_name, department_id) VALUES \
      ('Retina and Vitreous', 5),\
      ('Cornea and External Disease', 5),\
      ('Ophthalmic Plastic Surgery', 5)",
    "INSERT INTO specialization (specialization_name, department_id) VALUES \
      ('Stroke Neurology', 6),\
      ('Epilepsy', 6),\
      ('Movement Disorders', 6)",
    "insert into user(name,user_role,username,password) values('Admin','ADMIN','admin','admin123')",
  ];
  for (let i = 0; i < initQueries.length; i++) {
    try {
      db.query(initQueries[i]);
    } catch (error) {
      continue;
    }
  }
  res.end();
};
