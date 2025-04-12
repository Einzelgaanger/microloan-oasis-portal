
import React, { useState, useEffect } from 'react';
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
import { Profile } from '@/services/mockDataService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { FadeIn, StaggeredItems } from '@/components/ui/animations';

const LoanApplication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Form initial values
  const [loanAmount, setLoanAmount] = useState(5000);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [proofOfIncome, setProofOfIncome] = useState<File | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<File | null>(null);
  const [otherDocuments, setOtherDocuments] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const profileData = await dataService.profiles.getProfile(user.id);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load your profile information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  // Define form schema with Kenyan context
  const formSchema = z.object({
    purpose: z.string().min(5, "Purpose is required and must be at least 5 characters"),
    duration: z.number().min(1, "Duration must be at least 1 month").max(24, "Duration cannot exceed 24 months"),
    interestRate: z.number().min(1, "Interest rate must be at least 1%").max(30, "Interest rate cannot exceed 30%"),
    employmentStatus: z.string().min(2, "Employment status is required"),
    employerName: z.string().min(2, "Employer or business name is required"),
    monthlyIncome: z.number().min(5000, "Monthly income must be at least KSh 5,000"),
    phoneNumber: z.string().min(10, "M-Pesa number is required"),
    county: z.string().min(2, "County is required"),
    nextOfKinName: z.string().min(2, "Next of kin name is required"),
    nextOfKinPhone: z.string().min(10, "Next of kin phone number is required"),
    nextOfKinRelation: z.string().min(2, "Relationship to next of kin is required"),
  });

  // Initialize form with profile data if available
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: '',
      duration: 3,
      interestRate: 15,
      employmentStatus: profile?.employment_status || '',
      employerName: profile?.employer_name || '',
      monthlyIncome: profile?.monthly_income || 0,
      phoneNumber: profile?.phone_number || '',
      county: profile?.county || '',
      nextOfKinName: profile?.kin_name || '',
      nextOfKinPhone: profile?.kin_phone || '',
      nextOfKinRelation: profile?.kin_relationship || '',
    },
  });

  // Update form with profile data when profile loads
  useEffect(() => {
    if (profile) {
      form.reset({
        purpose: form.getValues('purpose'),
        duration: form.getValues('duration'),
        interestRate: form.getValues('interestRate'),
        employmentStatus: profile.employment_status || '',
        employerName: profile.employer_name || '',
        monthlyIncome: profile.monthly_income || 0,
        phoneNumber: profile.phone_number || '',
        county: profile.county || '',
        nextOfKinName: profile.kin_name || '',
        nextOfKinPhone: profile.kin_phone || '',
        nextOfKinRelation: profile.kin_relationship || '',
      });
      
      // Use existing documents from profile if available
      if (profile.id_document_url) {
        // This is just a mock implementation - in reality you'd need to handle this differently
        // since we can't convert URLs back to Files
        console.log('User already has ID document uploaded');
      }
    }
  }, [profile, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('You must be logged in to apply for a loan');
      return;
    }

    const requiredDocs = !profile?.id_document_url && !idDocument;
    const requiredIncome = !profile?.payslip_document_url && !proofOfIncome;
    const requiredSelfie = !profile?.selfie_photo_url && !selfiePhoto;
    
    if (requiredDocs || requiredIncome || requiredSelfie) {
      toast.error('Please upload all required documents');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Mock file uploads with placeholder URLs
      const idDocUrl = idDocument ? `/documents/${idDocument.name}` : profile?.id_document_url || '';
      const incomeDocUrl = proofOfIncome ? `/documents/${proofOfIncome.name}` : profile?.payslip_document_url || '';
      const selfieUrl = selfiePhoto ? `/documents/${selfiePhoto.name}` : profile?.selfie_photo_url || '';
      const otherDocsUrl = otherDocuments ? `/documents/${otherDocuments.name}` : '';
      
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
        county: values.county,
        mpesa_number: values.phoneNumber,
        next_of_kin_name: values.nextOfKinName,
        next_of_kin_phone: values.nextOfKinPhone,
        next_of_kin_relation: values.nextOfKinRelation,
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

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lending-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <FadeIn>
            <Card className="border-2 border-lending-primary/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-lending-primary/10 to-blue-500/10">
                <CardTitle className="text-2xl">Loan Application - Karibu!</CardTitle>
                <CardDescription>
                  Fill out this form to apply for a loan. All information will be verified.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!profile?.id_number && (
                  <Alert className="mb-6 bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-600 font-medium">Profile Incomplete</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Please complete your profile information to streamline the loan application process.{' '}
                      <a href="/profile" className="underline font-medium">Update your profile</a>
                    </AlertDescription>
                  </Alert>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Loan Amount Slider */}
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="font-medium">Loan Amount: KSh {loanAmount.toLocaleString()}</Label>
                      <Slider
                        value={[loanAmount]}
                        max={100000}
                        step={1000}
                        onValueChange={(value) => setLoanAmount(value[0])}
                        className="my-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>KSh 5,000</span>
                        <span>KSh 50,000</span>
                        <span>KSh 100,000</span>
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
                              className="resize-none"
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
                    <StaggeredItems className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loan Duration (months)</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value.toString()}
                                onValueChange={(value) => field.onChange(parseInt(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 month</SelectItem>
                                  <SelectItem value="3">3 months</SelectItem>
                                  <SelectItem value="6">6 months</SelectItem>
                                  <SelectItem value="12">12 months</SelectItem>
                                  <SelectItem value="18">18 months</SelectItem>
                                  <SelectItem value="24">24 months</SelectItem>
                                </SelectContent>
                              </Select>
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
                              <Select
                                value={field.value.toString()}
                                onValueChange={(value) => field.onChange(parseInt(value))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select interest rate" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="10">10% (Excellent Credit)</SelectItem>
                                  <SelectItem value="15">15% (Standard Rate)</SelectItem>
                                  <SelectItem value="18">18% (New Customer)</SelectItem>
                                  <SelectItem value="20">20% (Special Circumstances)</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </StaggeredItems>

                    {/* Employment Information */}
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h3 className="text-lg font-medium">Employment Information</h3>
                      <StaggeredItems className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                  <SelectItem value="employed">Formally Employed</SelectItem>
                                  <SelectItem value="self-employed">Self-employed</SelectItem>
                                  <SelectItem value="business">Business Owner</SelectItem>
                                  <SelectItem value="unemployed">Unemployed</SelectItem>
                                  <SelectItem value="student">Student</SelectItem>
                                  <SelectItem value="farmer">Farmer</SelectItem>
                                  <SelectItem value="retired">Retired</SelectItem>
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
                              <FormLabel>Employer Name/Business Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="monthlyIncome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Income (KSh)</FormLabel>
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
                        
                        <FormField
                          control={form.control}
                          name="county"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>County</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select county" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="nairobi">Nairobi</SelectItem>
                                  <SelectItem value="mombasa">Mombasa</SelectItem>
                                  <SelectItem value="kisumu">Kisumu</SelectItem>
                                  <SelectItem value="nakuru">Nakuru</SelectItem>
                                  <SelectItem value="eldoret">Eldoret</SelectItem>
                                  <SelectItem value="kakamega">Kakamega</SelectItem>
                                  <SelectItem value="nyeri">Nyeri</SelectItem>
                                  <SelectItem value="machakos">Machakos</SelectItem>
                                  {/* Add more counties */}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </StaggeredItems>
                    </div>

                    {/* Next of Kin */}
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h3 className="text-lg font-medium">Next of Kin Details</h3>
                      <StaggeredItems className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="nextOfKinName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="nextOfKinPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="+254 7XX XXX XXX" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="nextOfKinRelation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relationship</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select relationship" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="spouse">Spouse</SelectItem>
                                  <SelectItem value="parent">Parent</SelectItem>
                                  <SelectItem value="sibling">Sibling</SelectItem>
                                  <SelectItem value="child">Child</SelectItem>
                                  <SelectItem value="friend">Friend</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </StaggeredItems>
                    </div>

                    {/* M-Pesa */}
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>M-Pesa Number (for disbursement)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+254 7XX XXX XXX" />
                          </FormControl>
                          <FormDescription>
                            Enter the M-Pesa number where you want to receive the loan
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Required Document Uploads */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Required Documents</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="idDocument" className="mb-2 block">
                            ID Document <span className="text-red-500">*</span>
                            {profile?.id_document_url && <span className="text-green-600 ml-2">(Already Uploaded)</span>}
                          </Label>
                          <FileUpload
                            accept=".jpg,.jpeg,.png,.pdf"
                            maxSize={5 * 1024 * 1024} // 5MB
                            onFileSelected={setIdDocument}
                            currentFile={idDocument}
                            helperText="Upload a clear photo of your National ID (front and back)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="proofOfIncome" className="mb-2 block">
                            Proof of Income <span className="text-red-500">*</span>
                            {profile?.payslip_document_url && <span className="text-green-600 ml-2">(Already Uploaded)</span>}
                          </Label>
                          <FileUpload
                            accept=".jpg,.jpeg,.png,.pdf"
                            maxSize={5 * 1024 * 1024}
                            onFileSelected={setProofOfIncome}
                            currentFile={proofOfIncome}
                            helperText="Upload M-Pesa statements, bank statements, or payslips"
                          />
                        </div>
                        <div>
                          <Label htmlFor="selfiePhoto" className="mb-2 block">
                            Selfie Photo <span className="text-red-500">*</span>
                            {profile?.selfie_photo_url && <span className="text-green-600 ml-2">(Already Uploaded)</span>}
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
                        {submitting ? 'Submitting...' : 'Submit Loan Application'}
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
          </FadeIn>
          
          {/* Add a Kenya-themed floating character */}
          <FloatingCharacter
            character="💰"
            position="bottom-left"
            className="hidden md:block"
          />
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default LoanApplication;
