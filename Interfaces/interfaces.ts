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

export enum USER_ROLE {
  doctor = "DOCTOR",
  patient = "PATIENT",
  admin = "ADMIN",
}

export const TRANSACTION = "START TRANSACTION";
export const ROLLBACK = "ROLLBACK";
export const COMMIT = "COMMIT";
