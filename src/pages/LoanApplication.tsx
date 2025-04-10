import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/lib/auth';
import { dataService } from '@/services/dataService';

const LoanApplication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loanData, setLoanData] = useState({
    amount: 5000,
    purpose: '',
    duration: 12,
    interestRate: 5,
    employmentStatus: '',
    employerName: '',
    monthlyIncome: 0,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLoanData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setLoanData(prev => ({ ...prev, amount: value[0] }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to apply for a loan');
      return;
    }
    
    // Calculate monthly payment
    const r = loanData.interestRate / 100 / 12; // Monthly interest rate
    const n = loanData.duration; // Number of months
    const monthlyPayment = (loanData.amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    setSubmitting(true);
    
    try {
      // For demonstration, create an empty URL for the document fields
      const documentPlaceholder = '/documents/placeholder.pdf';
      
      await dataService.loans.createLoan({
        user_id: user.id,
        amount: loanData.amount,
        purpose: loanData.purpose,
        duration: loanData.duration,
        interest_rate: loanData.interestRate,
        monthly_payment: parseFloat(monthlyPayment.toFixed(2)),
        employment_status: loanData.employmentStatus,
        employer_name: loanData.employerName,
        monthly_income: loanData.monthlyIncome,
        id_document_url: documentPlaceholder,
        proof_of_income_url: documentPlaceholder,
        selfie_url: documentPlaceholder,
        other_documents_url: documentPlaceholder,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_repaid: false
      });
      
      toast.success('Loan application submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting loan application:', error);
      toast.error('Failed to submit loan application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Loan Application</CardTitle>
              <CardDescription>
                Fill out the form below to apply for a loan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="amount">Loan Amount</Label>
                  <Slider
                    defaultValue={[loanData.amount]}
                    max={10000}
                    step={100}
                    onValueChange={(value) => handleSliderChange(value.map(Number))}
                  />
                  <Input
                    type="number"
                    id="amount"
                    name="amount"
                    value={loanData.amount}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="purpose">Purpose of Loan</Label>
                  <Textarea
                    id="purpose"
                    name="purpose"
                    value={loanData.purpose}
                    onChange={handleInputChange}
                    placeholder="Briefly describe the purpose of the loan"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Loan Duration (months)</Label>
                  <Input
                    type="number"
                    id="duration"
                    name="duration"
                    value={loanData.duration}
                    onChange={handleInputChange}
                    min="6"
                    max="60"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    type="number"
                    id="interestRate"
                    name="interestRate"
                    value={loanData.interestRate}
                    onChange={handleInputChange}
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <Input
                    type="text"
                    id="employmentStatus"
                    name="employmentStatus"
                    value={loanData.employmentStatus}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="employerName">Employer Name</Label>
                  <Input
                    type="text"
                    id="employerName"
                    name="employerName"
                    value={loanData.employerName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyIncome">Monthly Income</Label>
                  <Input
                    type="number"
                    id="monthlyIncome"
                    name="monthlyIncome"
                    value={loanData.monthlyIncome}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-lending-primary hover:bg-lending-primary/90"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                Please ensure all information is accurate before submitting.
              </p>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default LoanApplication;
