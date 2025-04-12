
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
import { FileUpload } from '@/components/ui/file-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const LoanApplication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form initial values
  const [loanAmount, setLoanAmount] = useState(5000);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [proofOfIncome, setProofOfIncome] = useState<File | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<File | null>(null);
  const [otherDocuments, setOtherDocuments] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Define form schema
  const formSchema = z.object({
    purpose: z.string().min(5, "Purpose is required and must be at least 5 characters"),
    duration: z.number().min(6, "Duration must be at least 6 months").max(60, "Duration cannot exceed 60 months"),
    interestRate: z.number().min(1, "Interest rate must be at least 1%").max(30, "Interest rate cannot exceed 30%"),
    employmentStatus: z.string().min(2, "Employment status is required"),
    employerName: z.string().optional(),
    monthlyIncome: z.number().min(500, "Monthly income must be at least $500"),
    phoneNumber: z.string().min(10, "Phone number is required"),
    address: z.string().min(5, "Address is required")
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: '',
      duration: 12,
      interestRate: 5,
      employmentStatus: '',
      employerName: '',
      monthlyIncome: 0,
      phoneNumber: '',
      address: ''
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('You must be logged in to apply for a loan');
      return;
    }

    if (!idDocument || !proofOfIncome || !selfiePhoto) {
      toast.error('Please upload all required documents');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Mock file uploads with placeholder URLs
      const idDocUrl = `/documents/${idDocument.name}`;
      const incomeDocUrl = `/documents/${proofOfIncome.name}`;
      const selfieUrl = `/documents/${selfiePhoto.name}`;
      const otherDocsUrl = otherDocuments ? `/documents/${otherDocuments.name}` : null;
      
      // Calculate monthly payment
      const r = values.interestRate / 100 / 12; // Monthly interest rate
      const n = values.duration; // Number of months
      const monthlyPayment = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      
      // Create loan application
      await dataService.loans.createLoan({
        user_id: user.id,
        amount: loanAmount,
        purpose: values.purpose,
        duration: values.duration,
        interest_rate: values.interestRate,
        monthly_payment: parseFloat(monthlyPayment.toFixed(2)),
        employment_status: values.employmentStatus,
        employer_name: values.employerName || '',
        monthly_income: values.monthlyIncome,
        id_document_url: idDocUrl,
        proof_of_income_url: incomeDocUrl,
        selfie_url: selfieUrl,
        other_documents_url: otherDocsUrl || '',
        status: 'pending',
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
                Fill out this form completely to apply for a loan. All documents will be verified.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Loan Amount Slider */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Loan Amount: ${loanAmount}</Label>
                    <Slider
                      value={[loanAmount]}
                      max={10000}
                      step={100}
                      onValueChange={(value) => setLoanAmount(value[0])}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>$1,000</span>
                      <span>$5,000</span>
                      <span>$10,000</span>
                    </div>
                  </div>

                  {/* Purpose of Loan */}
                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose of Loan</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Briefly describe how you plan to use this loan"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific about your intended use of the funds
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Loan Terms */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loan Duration (months)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                              min="6"
                              max="60"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="interestRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interest Rate (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Employment Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Employment Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="employmentStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employment Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Full-time">Full-time</SelectItem>
                                <SelectItem value="Part-time">Part-time</SelectItem>
                                <SelectItem value="Self-employed">Self-employed</SelectItem>
                                <SelectItem value="Unemployed">Unemployed</SelectItem>
                                <SelectItem value="Student">Student</SelectItem>
                                <SelectItem value="Retired">Retired</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="employerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employer Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="monthlyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Income</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Required Document Uploads */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Required Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="idDocument" className="mb-2 block">
                          ID Document <span className="text-red-500">*</span>
                        </Label>
                        <FileUpload
                          accept=".jpg,.jpeg,.png,.pdf"
                          maxSize={5 * 1024 * 1024} // 5MB
                          onFileSelected={setIdDocument}
                          currentFile={idDocument}
                          helperText="Upload a clear photo of your government-issued ID (max 5MB)"
                        />
                      </div>
                      <div>
                        <Label htmlFor="proofOfIncome" className="mb-2 block">
                          Proof of Income <span className="text-red-500">*</span>
                        </Label>
                        <FileUpload
                          accept=".jpg,.jpeg,.png,.pdf"
                          maxSize={5 * 1024 * 1024}
                          onFileSelected={setProofOfIncome}
                          currentFile={proofOfIncome}
                          helperText="Upload pay stubs, bank statements, or tax returns"
                        />
                      </div>
                      <div>
                        <Label htmlFor="selfiePhoto" className="mb-2 block">
                          Selfie Photo <span className="text-red-500">*</span>
                        </Label>
                        <FileUpload
                          accept=".jpg,.jpeg,.png"
                          maxSize={5 * 1024 * 1024}
                          onFileSelected={setSelfiePhoto}
                          currentFile={selfiePhoto}
                          helperText="Upload a clear selfie holding your ID card"
                        />
                      </div>
                      <div>
                        <Label htmlFor="otherDocuments" className="mb-2 block">
                          Other Supporting Documents
                        </Label>
                        <FileUpload
                          accept=".jpg,.jpeg,.png,.pdf"
                          maxSize={10 * 1024 * 1024} // 10MB
                          onFileSelected={setOtherDocuments}
                          currentFile={otherDocuments}
                          helperText="Optional: additional documents to support your application"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      type="submit"
                      className="bg-lending-primary hover:bg-lending-primary/90"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                    <p className="text-xs text-gray-500">
                      By submitting this application, you agree to our terms and conditions and consent to a credit check.
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                Please ensure all information is accurate before submitting. Providing false information may result in your application being rejected.
              </p>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default LoanApplication;
