
export interface Loan {
  id: string;
  user_id: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'repaid';
  term_days: number;
  interest_rate: number;
  monthly_payment?: number;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  rejected_at?: string;
  funded_at?: string;
  repaid_at?: string;
  documents_url?: string[];
  other_documents_url?: string[];
  rejected_reason?: string;
  id_document_url?: string;
  proof_of_income_url?: string;
  selfie_url?: string;
  county?: string;
  mpesa_number?: string;
  next_of_kin_name?: string;
  next_of_kin_phone?: string;
  next_of_kin_relation?: string;
  employment_status?: string;
  employer_name?: string;
  monthly_income?: number;
  duration?: number;
  is_repaid?: boolean;
}

export interface Payment {
  id: string;
  loan_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  due_date: string;
  payment_date?: string;
  payment_method?: string;
  transaction_id?: string;
  notes?: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  username?: string;
  created_at: string;
  updated_at?: string;
  id_number?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  nationality?: string;
  phone_number?: string;
  alternative_phone?: string;
  address?: string;
  county?: string;
  sub_county?: string;
  village?: string;
  landmark?: string;
  residence_duration?: string;
  employment_status?: string;
  occupation?: string;
  employer_name?: string;
  employer_contact?: string;
  monthly_income?: number;
  secondary_income?: number;
  pay_frequency?: string;
  work_location?: string;
  bank_name?: string;
  bank_branch?: string;
  account_number?: string;
  mpesa_number?: string;
  kin_name?: string;
  kin_relationship?: string;
  kin_phone?: string;
  kin_id_number?: string;
  kin_address?: string;
  id_document_url?: string;
  selfie_url?: string;
  payslip_url?: string;
  statement_url?: string;
  email?: string;
}

export interface KYCProfile {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  national_id_number: string;
  date_of_birth: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone_number: string;
  employment_status: string;
  employer_name?: string;
  monthly_income: number;
  purpose_of_loan: string;
}
