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
