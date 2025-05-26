
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  id_number: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  nationality: string;
  county: string;
  employment_status: string;
  employer_name: string;
  monthly_income: number;
  mpesa_number: string;
  kin_name: string;
  kin_phone: string;
  kin_relationship: string;
  id_document_url?: string;
  income_proof_url?: string;
  selfie_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: string;
  user_id: string;
  amount: number;
  purpose: string;
  duration: number;
  term_days: number;
  interest_rate: number;
  monthly_payment: number;
  processing_fee: number;
  total_amount: number;
  employment_status: string;
  employer_name: string;
  monthly_income: number;
  county: string;
  mpesa_number: string;
  phone_number: string;
  kin_name: string;
  kin_phone: string;
  kin_relationship: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  is_repaid: boolean;
  approved_at?: string;
  rejected_at?: string;
  rejected_reason?: string;
  disbursed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  loan_id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  mpesa_receipt?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_admin?: boolean;
}
