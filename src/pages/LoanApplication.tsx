
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, ProtectedRoute } from '@/lib/auth';
import { dataService } from '@/services/dataService';
import { Loan, Profile } from '@/types/loan';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const loanApplicationSchema = z.object({
  amount: z.string()
    .min(1, { message: "Loan amount is required" })
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, {
      message: "Loan amount must be a positive number",
    }),
  purpose: z.string().min(1, { message: "Purpose is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
});

type LoanApplicationFormValues = z.infer<typeof loanApplicationSchema>;

const LoanApplication = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoanApplicationFormValues>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      amount: '',
      purpose: '',
      duration: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const profileData = await dataService.profiles.getProfile(user.id);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const onSubmit = async (data: LoanApplicationFormValues) => {
    if (!user || !profile) return;

    try {
      setIsSubmitting(true);

      // Check if user has complete profile
      if (!profile.phone_number || !profile.employment_status || !profile.monthly_income) {
        toast.error('Please complete your profile first');
        navigate('/profile');
        return;
      }

      // Calculate loan details
      const amount = parseFloat(data.amount);
      const duration = parseInt(data.duration);
      const interestRate = calculateInterestRate(amount);
      const processingFee = calculateProcessingFee(amount);
      const monthlyPayment = calculateMonthlyPayment(amount, interestRate, duration);
      const termDays = duration * 30; // Convert months to days

      // Create loan application
      const loanData: Omit<Loan, 'id' | 'created_at' | 'updated_at'> = {
        user_id: user.id,
        amount,
        purpose: data.purpose,
        duration,
        term_days: termDays,
        interest_rate: interestRate,
        monthly_payment: monthlyPayment,
        employment_status: profile.employment_status,
        employer_name: profile.employer_name || '',
        monthly_income: profile.monthly_income,
        county: profile.county || '',
        mpesa_number: profile.mpesa_number || '',
        phone_number: profile.phone_number,
        kin_name: profile.kin_name || '',
        kin_phone: profile.kin_phone || '',
        kin_relationship: profile.kin_relationship || '',
        status: 'pending',
        processing_fee: processingFee,
        total_amount: amount + (amount * interestRate / 100) + processingFee,
        is_repaid: false
      };

      const newLoan = await dataService.loans.createLoan(loanData);
      
      if (newLoan) {
        setApplicationSubmitted(true);
        toast.success('Loan application submitted successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit loan application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateInterestRate = (amount: number): number => {
    if (amount <= 50000) return 15; // 15% for amounts up to KES 50,000
    if (amount <= 100000) return 12; // 12% for amounts up to KES 100,000
    return 10; // 10% for higher amounts
  };

  const calculateProcessingFee = (amount: number): number => {
    return amount * 0.05; // 5% processing fee
  };

  const calculateMonthlyPayment = (amount: number, interestRate: number, duration: number): number => {
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = duration;
    const presentValue = amount;

    const monthlyPayment =
      (presentValue * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    return monthlyPayment;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (applicationSubmitted) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-700">Application Submitted!</CardTitle>
              <CardDescription className="text-lg">
                Your loan application has been submitted successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We will review your application and get back to you within 24 hours.
                You can track the status of your application in your dashboard.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setApplicationSubmitted(false);
                    form.reset();
                  }}
                >
                  Submit Another Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card className="w-full max-w-2xl mx-auto border shadow-md">
            <CardHeader className="space-y-2 bg-blue-500 text-white">
              <CardTitle className="text-2xl font-bold text-center">Loan Application</CardTitle>
              <CardDescription className="text-center text-white/80">
                Fill in the details below to apply for a loan
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <CardContent className="space-y-4 pt-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Amount (KES)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter amount (e.g., 50000)" 
                            {...field} 
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500">
                          Minimum: KES 10,000 | Maximum: KES 500,000
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose of Loan</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Briefly describe the purpose of the loan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Loan Duration (Months)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 6, 9, 12, 18, 24].map(month => (
                              <SelectItem key={month} value={month.toString()}>
                                {month} {month === 1 ? 'Month' : 'Months'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Loan Preview */}
                  {form.watch('amount') && form.watch('duration') && (
                    <div className="bg-blue-50 p-4 rounded-lg border">
                      <h4 className="font-semibold text-blue-800 mb-2">Loan Preview</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Interest Rate:</span>
                          <span className="float-right font-medium">
                            {calculateInterestRate(parseFloat(form.watch('amount') || '0'))}% p.a.
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Processing Fee:</span>
                          <span className="float-right font-medium">
                            KES {calculateProcessingFee(parseFloat(form.watch('amount') || '0')).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Monthly Payment:</span>
                          <span className="float-right font-medium text-blue-600">
                            KES {calculateMonthlyPayment(
                              parseFloat(form.watch('amount') || '0'),
                              calculateInterestRate(parseFloat(form.watch('amount') || '0')),
                              parseInt(form.watch('duration') || '1')
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex justify-end p-6">
                  <Button 
                    type="submit" 
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default LoanApplication;
