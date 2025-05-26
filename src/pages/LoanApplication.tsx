import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { FileUpload } from '@/components/ui/file-upload';
import { useAuth } from '@/lib/auth';
import { dataService } from '@/services/dataService';
import { Loan, Profile } from '@/types/loan';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/lib/auth';
import { FadeIn, StaggeredItems } from '@/components/ui/animations';

const LoanApplication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [incomeProof, setIncomeProof] = useState<File | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<File | null>(null);
  const [formStep, setFormStep] = useState(0);
  const [hasDocuments, setHasDocuments] = useState(false);
  
  // Loan application form state
  const [loanData, setLoanData] = useState({
    amount: '',
    purpose: '',
    duration: '3',
    employment_status: '',
    employer_name: '',
    monthly_income: '',
    county: '',
    mpesa_number: '',
    next_of_kin_name: '',
    next_of_kin_phone: '',
    next_of_kin_relation: '',
  });

  const calculateMonthlyPayment = (amount: number, duration: number, interestRate = 15) => {
    // Simple interest calculation for monthly payments
    const principal = amount;
    const monthlyInterestRate = interestRate / 100 / 12;
    const totalPayments = duration;
    
    const monthly = (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));
    return Math.round(monthly);
  };
  
  useEffect(() => {
    // Fetch user profile to pre-populate form
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const profileData = await dataService.profiles.getProfile(user.id);
        
        if (profileData) {
          setProfile(profileData);
          
          // Check if user already has documents uploaded
          if (profileData.id_document_url && profileData.selfie_url) {
            setHasDocuments(true);
          }
          
          // Pre-populate loan form with profile data
          setLoanData(prevData => ({
            ...prevData,
            employment_status: profileData.employment_status || '',
            employer_name: profileData.employer_name || '',
            monthly_income: profileData.monthly_income?.toString() || '',
            county: profileData.county || '',
            mpesa_number: profileData.mpesa_number || profileData.phone_number || '',
            next_of_kin_name: profileData.kin_name || '',
            next_of_kin_phone: profileData.kin_phone || '',
            next_of_kin_relation: profileData.kin_relationship || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to apply for a loan');
      return;
    }
    
    // Validation for basic fields
    if (!loanData.amount || !loanData.purpose) {
      toast.error('Please fill all required loan details');
      return;
    }
    
    // Only validate documents if the user doesn't have them already
    if (!hasDocuments && (!idDocument || !incomeProof || !selfiePhoto)) {
      toast.error('Please upload all required documents');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Calculate monthly payment
      const amount = parseFloat(loanData.amount);
      const duration = parseInt(loanData.duration);
      const monthly_payment = calculateMonthlyPayment(amount, duration);
      
      // Prepare loan application data
      const newLoan: Omit<Loan, 'id' | 'created_at' | 'updated_at'> = {
        user_id: user.id,
        amount,
        purpose: loanData.purpose,
        duration,
        interest_rate: 15, // Fixed interest rate for now
        monthly_payment,
        employment_status: loanData.employment_status,
        employer_name: loanData.employer_name,
        monthly_income: parseFloat(loanData.monthly_income) || 0,
        // Use existing document URLs if available, otherwise use the new uploads
        id_document_url: hasDocuments && profile?.id_document_url ? 
          profile.id_document_url : 
          `/mock-documents/id-doc-${Date.now()}.jpg`,
        proof_of_income_url: hasDocuments && profile?.payslip_url ? 
          profile.payslip_url : 
          `/mock-documents/income-proof-${Date.now()}.pdf`,
        selfie_url: hasDocuments && profile?.selfie_url ? 
          profile.selfie_url : 
          `/mock-documents/selfie-${Date.now()}.jpg`,
        county: loanData.county,
        mpesa_number: loanData.mpesa_number,
        next_of_kin_name: loanData.next_of_kin_name,
        next_of_kin_phone: loanData.next_of_kin_phone,
        next_of_kin_relation: loanData.next_of_kin_relation,
        status: "pending",
        is_repaid: false,
      };
      
      // Submit loan application
      const result = await dataService.loans.createLoan(newLoan);
      
      toast.success('Loan application submitted successfully!');
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting loan application:', error);
      toast.error('Failed to submit loan application');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleChange = (field: string, value: string) => {
    setLoanData(prev => ({ ...prev, [field]: value }));
  };
  
  const nextStep = () => {
    // Skip document upload step if user already has documents
    if (formStep === 2 && hasDocuments) {
      setFormStep(4); // Skip to final step or confirmation
    } else {
      setFormStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    // Handle going back from final step when documents step was skipped
    if (formStep === 4 && hasDocuments) {
      setFormStep(2);
    } else {
      setFormStep(prev => prev - 1);
    }
  };
  
  // Render steps based on current form step
  const renderFormStep = () => {
    switch (formStep) {
      case 0:
        // Loan details step
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Loan Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Loan Amount (KSh) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={loanData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="e.g. 10000"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Min: KSh 5,000, Max: KSh 50,000</p>
              </div>
              
              <div>
                <Label htmlFor="duration">Loan Duration (Months) *</Label>
                <Select 
                  value={loanData.duration} 
                  onValueChange={(value) => handleChange('duration', value)}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select loan duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="2">2 Months</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="purpose">Purpose of Loan *</Label>
                <Textarea
                  id="purpose"
                  value={loanData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  placeholder="Brief description of how you will use the loan"
                  required
                />
              </div>
            </div>
            
            {loanData.amount && loanData.duration && (
              <div className="p-4 bg-gray-50 rounded-lg mt-4">
                <p className="text-sm">Loan Summary:</p>
                <div className="flex justify-between mt-2">
                  <span>Principal Amount:</span>
                  <span className="font-semibold">KSh {parseFloat(loanData.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Interest Rate:</span>
                  <span className="font-semibold">15% per annum</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Duration:</span>
                  <span className="font-semibold">{loanData.duration} {parseInt(loanData.duration) === 1 ? 'Month' : 'Months'}</span>
                </div>
                <div className="flex justify-between mt-1 text-lending-primary">
                  <span>Monthly Payment:</span>
                  <span className="font-bold">KSh {calculateMonthlyPayment(parseFloat(loanData.amount), parseInt(loanData.duration)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-1 border-t pt-1">
                  <span>Total Repayment:</span>
                  <span className="font-bold">KSh {(calculateMonthlyPayment(parseFloat(loanData.amount), parseInt(loanData.duration)) * parseInt(loanData.duration)).toLocaleString()}</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <Button
                onClick={nextStep}
                disabled={!loanData.amount || !loanData.purpose || !loanData.duration}
                className="bg-lending-primary hover:bg-lending-primary/90"
              >
                Next: Employment Info
              </Button>
            </div>
          </div>
        );
        
      case 1:
        // Employment info step
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Employment and Income</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employment_status">Employment Status *</Label>
                <Select 
                  value={loanData.employment_status} 
                  onValueChange={(value) => handleChange('employment_status', value)}
                >
                  <SelectTrigger id="employment_status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Formally Employed</SelectItem>
                    <SelectItem value="self-employed">Self-Employed</SelectItem>
                    <SelectItem value="business">Business Owner</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="employer_name">Employer/Business Name *</Label>
                <Input
                  id="employer_name"
                  value={loanData.employer_name}
                  onChange={(e) => handleChange('employer_name', e.target.value)}
                  placeholder="Your employer or business name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="monthly_income">Monthly Income (KSh) *</Label>
                <Input
                  id="monthly_income"
                  type="number"
                  value={loanData.monthly_income}
                  onChange={(e) => handleChange('monthly_income', e.target.value)}
                  placeholder="e.g. 30000"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="county">County *</Label>
                <Input
                  id="county"
                  value={loanData.county}
                  onChange={(e) => handleChange('county', e.target.value)}
                  placeholder="e.g. Nairobi"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!loanData.employment_status || !loanData.employer_name || !loanData.monthly_income}
                className="bg-lending-primary hover:bg-lending-primary/90"
              >
                Next: Contact Details
              </Button>
            </div>
          </div>
        );
        
      case 2:
        // Contact info step
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact and Next of Kin</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mpesa_number">M-Pesa Phone Number *</Label>
                <Input
                  id="mpesa_number"
                  value={loanData.mpesa_number}
                  onChange={(e) => handleChange('mpesa_number', e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">This will be used for loan disbursement</p>
              </div>
              
              <div className="md:col-span-2">
                <h4 className="text-sm font-semibold mb-2">Next of Kin Details</h4>
                <p className="text-xs text-gray-500 mb-2">Please provide someone we can contact in case we cannot reach you</p>
              </div>
              
              <div>
                <Label htmlFor="next_of_kin_name">Next of Kin Full Name *</Label>
                <Input
                  id="next_of_kin_name"
                  value={loanData.next_of_kin_name}
                  onChange={(e) => handleChange('next_of_kin_name', e.target.value)}
                  placeholder="Full name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="next_of_kin_phone">Next of Kin Phone Number *</Label>
                <Input
                  id="next_of_kin_phone"
                  value={loanData.next_of_kin_phone}
                  onChange={(e) => handleChange('next_of_kin_phone', e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="next_of_kin_relation">Relationship to Next of Kin *</Label>
                <Select 
                  value={loanData.next_of_kin_relation} 
                  onValueChange={(value) => handleChange('next_of_kin_relation', value)}
                >
                  <SelectTrigger id="next_of_kin_relation">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="relative">Other Relative</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!loanData.mpesa_number || !loanData.next_of_kin_name || !loanData.next_of_kin_phone || !loanData.next_of_kin_relation}
                className="bg-lending-primary hover:bg-lending-primary/90"
              >
                Next: Upload Documents
              </Button>
            </div>
          </div>
        );
        
      case 3:
        // Document upload step
        if (hasDocuments) {
          // Skip this step by going to final step
          nextStep();
          return null;
        }
        
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Upload Required Documents</h3>
            <p className="text-sm text-gray-600">Please upload clear copies of the following documents:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="id_document" className="mb-2 block">
                  National ID Card (Both Sides) *
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
                <Label htmlFor="income_proof" className="mb-2 block">
                  Proof of Income *
                </Label>
                <FileUpload
                  accept=".jpg,.jpeg,.png,.pdf"
                  maxSize={5 * 1024 * 1024} // 5MB
                  onFileSelected={setIncomeProof}
                  currentFile={incomeProof}
                  helperText="Recent payslip, bank statement, or business records"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="selfie_photo" className="mb-2 block">
                  Selfie Photo with ID *
                </Label>
                <FileUpload
                  accept=".jpg,.jpeg,.png"
                  maxSize={5 * 1024 * 1024} // 5MB
                  onFileSelected={setSelfiePhoto}
                  currentFile={selfiePhoto}
                  helperText="Take a clear selfie holding your ID card"
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!idDocument || !incomeProof || !selfiePhoto || submitting}
                className="bg-lending-primary hover:bg-lending-primary/90"
              >
                {submitting ? 'Submitting...' : 'Submit Loan Application'}
              </Button>
            </div>
          </div>
        );
        
      case 4:
        // Final confirmation step or summary when documents already exist
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Loan Application Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm font-medium">Loan Amount:</p>
                <p>KSh {parseFloat(loanData.amount).toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Duration:</p>
                <p>{loanData.duration} {parseInt(loanData.duration) === 1 ? 'Month' : 'Months'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Monthly Payment:</p>
                <p className="text-lending-primary font-semibold">
                  KSh {calculateMonthlyPayment(parseFloat(loanData.amount), parseInt(loanData.duration)).toLocaleString()}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Total Repayment:</p>
                <p className="font-semibold">
                  KSh {(calculateMonthlyPayment(parseFloat(loanData.amount), parseInt(loanData.duration)) * parseInt(loanData.duration)).toLocaleString()}
                </p>
              </div>
              
              <div className="md:col-span-2">
                <p className="text-sm font-medium">Purpose:</p>
                <p>{loanData.purpose}</p>
              </div>
            </div>
            
            {hasDocuments && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center text-green-700">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <p className="font-medium">Documents Already Provided</p>
                </div>
                <p className="text-sm mt-1 text-gray-600">Your identification and verification documents are already on file.</p>
              </div>
            )}
            
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-lending-primary hover:bg-lending-primary/90"
              >
                {submitting ? 'Submitting...' : 'Submit Loan Application'}
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <FadeIn>
            <Card className="max-w-4xl mx-auto border-2 border-lending-primary/20">
              <CardHeader className="bg-gradient-to-r from-lending-primary/10 to-blue-500/10">
                <div className="flex items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold">Loan Application</CardTitle>
                    <CardDescription>
                      Please provide accurate information to process your loan quickly
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lending-primary"></div>
                  </div>
                ) : (
                  <div>
                    {/* Steps indicator - Adjust for users with existing documents */}
                    <div className="mb-6">
                      <div className="flex justify-between">
                        {hasDocuments ? 
                          ['Loan Details', 'Employment', 'Contact Info', 'Summary'].map((step, index) => (
                            <div
                              key={step}
                              className={`flex flex-col items-center ${
                                index <= formStep ? 'text-lending-primary' : 'text-gray-400'
                              }`}
                            >
                              <div
                                className={`rounded-full w-8 h-8 flex items-center justify-center mb-1
                                  ${index < formStep ? 'bg-lending-primary text-white' : 
                                    index === formStep ? 'border-2 border-lending-primary text-lending-primary' : 
                                    'border-2 border-gray-300 text-gray-400'}`}
                              >
                                {index < formStep ? <CheckCircle className="h-5 w-5" /> : index + 1}
                              </div>
                              <span className={`text-xs ${index <= formStep ? 'font-medium' : ''}`}>{step}</span>
                            </div>
                          )) :
                          ['Loan Details', 'Employment', 'Contact Info', 'Documents', 'Summary'].map((step, index) => (
                            <div
                              key={step}
                              className={`flex flex-col items-center ${
                                index <= formStep ? 'text-lending-primary' : 'text-gray-400'
                              }`}
                            >
                              <div
                                className={`rounded-full w-8 h-8 flex items-center justify-center mb-1
                                  ${index < formStep ? 'bg-lending-primary text-white' : 
                                    index === formStep ? 'border-2 border-lending-primary text-lending-primary' : 
                                    'border-2 border-gray-300 text-gray-400'}`}
                              >
                                {index < formStep ? <CheckCircle className="h-5 w-5" /> : index + 1}
                              </div>
                              <span className={`text-xs ${index <= formStep ? 'font-medium' : ''}`}>{step}</span>
                            </div>
                          ))
                        }
                      </div>
                      <div className="mt-2 h-1 bg-gray-200 rounded-full">
                        <div
                          className="h-1 bg-lending-primary rounded-full transition-all duration-300"
                          style={{ width: `${(formStep / (hasDocuments ? 3 : 4)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Form steps */}
                    <div className="mt-6">
                      {renderFormStep()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
          
          {/* Kenya-themed decoration */}
          <div className="fixed bottom-4 left-4 text-4xl hidden md:block animate-bounce">
            🇰🇪
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default LoanApplication;
