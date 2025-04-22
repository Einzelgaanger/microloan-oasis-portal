
// Mock data types and functions for development
// This will be replaced by real data from Supabase in production

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Loan {
  id: string;
  user_id: string;
  amount: number;
  interest_rate: number;
  duration: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  monthly_payment: number;
  total_repayment: number;
  is_repaid: boolean;
  created_at: string;
  approved_at?: string;
  rejected_at?: string;
  rejected_reason?: string;
  employment_status: string;
  employer_name?: string;
  monthly_income: number;
  id_document_url?: string;
  proof_of_income_url?: string;
  selfie_url?: string;
  other_documents_url?: string;
}

export interface KycProfile {
  id: string;
  user_id: string;
  national_id_number: string;
  date_of_birth: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone_number: string;
  employment_status: 'employed' | 'self-employed' | 'unemployed' | 'student' | 'retired';
  employer_name?: string | null;
  monthly_income: number;
  purpose_of_loan: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string | null;
  submitted_at: string;
  reviewed_at?: string | null;
}

export interface Payment {
  id: string;
  loan_id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  due_date: string;
  payment_date?: string;
  payment_method?: string;
  transaction_id?: string;
}

// This would be replaced by actual API calls to Supabase
export const mockDataService = {
  getRandomId: () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  },
  
  createMockProfile: (userId: string): Profile => ({
    id: userId,
    first_name: 'John',
    last_name: 'Doe',
    avatar_url: 'https://i.pravatar.cc/150?img=68',
    created_at: new Date().toISOString()
  }),
  
  createMockLoan: (userId: string, status = 'pending'): Loan => {
    const amount = Math.floor(Math.random() * 10000) + 1000;
    const interestRate = 5 + Math.random() * 10;
    const duration = [12, 24, 36, 48][Math.floor(Math.random() * 4)];
    const monthlyPayment = amount * (1 + interestRate/100) / duration;
    
    return {
      id: mockDataService.getRandomId(),
      user_id: userId,
      amount,
      interest_rate: interestRate,
      duration,
      purpose: ['Home renovation', 'Debt consolidation', 'Education', 'Medical expenses', 'Business'][Math.floor(Math.random() * 5)],
      status: status as 'pending' | 'approved' | 'rejected',
      monthly_payment: monthlyPayment,
      total_repayment: monthlyPayment * duration,
      is_repaid: false,
      created_at: new Date().toISOString(),
      employment_status: ['employed', 'self-employed', 'retired'][Math.floor(Math.random() * 3)],
      employer_name: 'Acme Corporation',
      monthly_income: 4000 + Math.random() * 6000,
      id_document_url: 'https://example.com/id-document.pdf',
      proof_of_income_url: 'https://example.com/income-proof.pdf',
      selfie_url: 'https://example.com/selfie.jpg',
      other_documents_url: 'https://example.com/other-docs.pdf'
    };
  },
  
  createMockLoans: (userId: string, count = 3): Loan[] => {
    const loans: Loan[] = [];
    const statuses = ['pending', 'approved', 'rejected'];
    
    for (let i = 0; i < count; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      loans.push(mockDataService.createMockLoan(userId, status));
    }
    
    return loans;
  },
  
  createMockKycProfile: (userId: string): KycProfile => ({
    id: mockDataService.getRandomId(),
    user_id: userId,
    national_id_number: '123-45-6789',
    date_of_birth: '1990-01-01',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip_code: '12345',
    phone_number: '+1 (555) 123-4567',
    employment_status: 'employed',
    employer_name: 'Acme Corporation',
    monthly_income: 5000,
    purpose_of_loan: 'Home renovation',
    status: 'pending',
    submitted_at: new Date().toISOString(),
  }),
  
  createMockPayments: (loanId: string, userId: string, count = 12): Payment[] => {
    const payments: Payment[] = [];
    const startDate = new Date();
    
    for (let i = 0; i < count; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i);
      
      let status: 'pending' | 'paid' | 'overdue' = 'pending';
      let paymentDate = undefined;
      
      if (i < 2) {
        status = 'paid';
        const pd = new Date(dueDate);
        pd.setDate(pd.getDate() - Math.floor(Math.random() * 5));
        paymentDate = pd.toISOString();
      } else if (i === 2 && Math.random() > 0.5) {
        status = 'overdue';
      }
      
      payments.push({
        id: mockDataService.getRandomId(),
        loan_id: loanId,
        user_id: userId,
        amount: 500 + Math.random() * 200,
        status,
        due_date: dueDate.toISOString(),
        payment_date: paymentDate,
        payment_method: status === 'paid' ? 'credit_card' : undefined,
        transaction_id: status === 'paid' ? `txn_${mockDataService.getRandomId()}` : undefined,
      });
    }
    
    return payments;
  }
};
