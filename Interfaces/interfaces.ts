export interface PatientSignup {
  name: string;
  phone: string;
  username: string;
  password: string;
  insurance_number: string;
  address: string;
  dob: Date;
}

export interface PatientLogin {
  username: string;
  password: string;
}

export interface DoctorCreate {
  name: string;
  phone: string;
  username: string;
  password: string;
  salary: number;
  department_id: number;
  specialization_id: number;
  license_number: string;
}

export interface JWTPayload {
  user_id: number;
  user_role: USER_ROLE;
}

export interface User {
  password: string;
  user_role: USER_ROLE;
  user_id: number;
  name: number;
}

export enum USER_ROLE {
  doctor = "DOCTOR",
  patient = "PATIENT",
  admin = "ADMIN",
}

export interface CreateResponse {
  insertId: number;
}

export interface AppointmentMapping {
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
}

export type SelectResponse = Array<Object>;

export const TRANSACTION = "START TRANSACTION";
export const ROLLBACK = "ROLLBACK";
export const COMMIT = "COMMIT";
