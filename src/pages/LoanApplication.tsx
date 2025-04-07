
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { ProtectedRoute } from '@/lib/auth';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhoneInput } from '@/components/ui/phone-input';
import { FileUpload } from '@/components/ui/file-upload';
import { ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const LoanApplication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    nationalId: '',
    address: '',
    city: '',
    zipCode: '',
    
    // Loan Details
    loanAmount: 1000,
    purpose: '',
    loanTerm: '6',
    
    // Employment & Income
    employmentStatus: '',
    employerName: '',
    monthlyIncome: '',
    otherIncome: '',
    
    // Documents
    identificationDoc: null as File | null,
    proofOfIncomeDoc: null as File | null,
    selfiePhoto: null as File | null,
    
    // References
    reference1Name: '',
    reference1Relationship: '',
    reference1Phone: '',
    reference2Name: '',
    reference2Relationship: '',
    reference2Phone: ''
  });

  const steps = [
    { id: 'personal', title: 'Personal Information' },
    { id: 'loan', title: 'Loan Details' },
    { id: 'employment', title: 'Employment & Income' },
    { id: 'documents', title: 'Upload Documents' },
    { id: 'references', title: 'References' },
    { id: 'review', title: 'Review & Submit' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, loanAmount: value[0] }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string) => (file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateMonthlyPayment = () => {
    const principal = formData.loanAmount;
    const interestRate = 0.12 / 12; // 12% annual rate converted to monthly
    const numberOfPayments = parseInt(formData.loanTerm);
    
    const monthlyPayment = (principal * interestRate) / (1 - Math.pow(1 + interestRate, -numberOfPayments));
    return isNaN(monthlyPayment) ? 0 : monthlyPayment;
  };

  const uploadFile = async (file: File, path: string) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('loan-documents')
      .upload(filePath, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    return filePath;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to submit a loan application');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Upload files
      const idDocPath = formData.identificationDoc ? 
        await uploadFile(formData.identificationDoc, `${user.id}/identification`) : null;
        
      const incomeDocPath = formData.proofOfIncomeDoc ?
        await uploadFile(formData.proofOfIncomeDoc, `${user.id}/income`) : null;
        
      const selfiePath = formData.selfiePhoto ?
        await uploadFile(formData.selfiePhoto, `${user.id}/selfie`) : null;
      
      // Save loan application to database
      const { error: loanError, data: loanData } = await supabase
        .from('loans')
        .insert({
          user_id: user.id,
          amount: formData.loanAmount,
          purpose: formData.purpose,
          duration: parseInt(formData.loanTerm),
          interest_rate: 12,
          monthly_payment: calculateMonthlyPayment(),
          employment_status: formData.employmentStatus,
          employer_name: formData.employerName,
          monthly_income: parseFloat(formData.monthlyIncome),
          other_income: parseFloat(formData.otherIncome) || 0,
          identification_doc_path: idDocPath,
          income_doc_path: incomeDocPath,
          selfie_path: selfiePath,
          reference1_name: formData.reference1Name,
          reference1_relationship: formData.reference1Relationship,
          reference1_phone: formData.reference1Phone,
          reference2_name: formData.reference2Name,
          reference2_relationship: formData.reference2Relationship,
          reference2_phone: formData.reference2Phone,
          status: 'pending',
          is_repaid: false
        })
        .select()
        .single();
        
      if (loanError) {
        throw loanError;
      }
      
      toast.success('Loan application submitted successfully!');
      navigate('/dashboard');
      
    } catch (error: any) {
      toast.error(`Error: ${error.message || 'Failed to submit loan application'}`);
      console.error('Loan submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Personal Information
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name (Optional)</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Enter your middle name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <PhoneInput
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange('phoneNumber')}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationalId">National ID / SSN</Label>
                <Input
                  id="nationalId"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  placeholder="Enter your ID number"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your street address"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Enter your zip code"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 1: // Loan Details
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label>Loan Amount ({formatCurrency(formData.loanAmount)})</Label>
              <div className="pt-4">
                <Slider
                  defaultValue={[1000]}
                  max={10000}
                  min={500}
                  step={100}
                  value={[formData.loanAmount]}
                  onValueChange={handleSliderChange}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>$500</span>
                  <span>$10,000</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">Loan Purpose</Label>
                <Select
                  value={formData.purpose}
                  onValueChange={handleSelectChange('purpose')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="debt_consolidation">Debt Consolidation</SelectItem>
                    <SelectItem value="home_improvement">Home Improvement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (months)</Label>
                <Select
                  value={formData.loanTerm}
                  onValueChange={handleSelectChange('loanTerm')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="18">18 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-medium mb-2">Loan Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Loan Amount:</span>
                  <span className="font-medium">{formatCurrency(formData.loanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rate:</span>
                  <span className="font-medium">12% annually</span>
                </div>
                <div className="flex justify-between">
                  <span>Loan Term:</span>
                  <span className="font-medium">{formData.loanTerm} months</span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
                  <span>Monthly Payment:</span>
                  <span className="font-bold text-lending-primary">
                    {formatCurrency(calculateMonthlyPayment())}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Total Repayment:</span>
                  <span>{formatCurrency(calculateMonthlyPayment() * parseInt(formData.loanTerm))}</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 2: // Employment & Income
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <Select
                value={formData.employmentStatus}
                onValueChange={handleSelectChange('employmentStatus')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_time">Full-time Employed</SelectItem>
                  <SelectItem value="part_time">Part-time Employed</SelectItem>
                  <SelectItem value="self_employed">Self-Employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.employmentStatus && formData.employmentStatus !== 'unemployed' && formData.employmentStatus !== 'student' && (
              <div className="space-y-2">
                <Label htmlFor="employerName">Employer Name</Label>
                <Input
                  id="employerName"
                  name="employerName"
                  value={formData.employerName}
                  onChange={handleChange}
                  placeholder="Enter your employer's name"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income (USD)</Label>
              <Input
                id="monthlyIncome"
                name="monthlyIncome"
                type="number"
                value={formData.monthlyIncome}
                onChange={handleChange}
                placeholder="Enter your monthly income"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otherIncome">Other Income (Optional, USD)</Label>
              <Input
                id="otherIncome"
                name="otherIncome"
                type="number"
                value={formData.otherIncome}
                onChange={handleChange}
                placeholder="Enter any other income"
              />
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <div className="flex">
                <AlertCircle className="text-yellow-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Verification Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    All income information will need to be verified through documents you'll upload in the next step.
                    Providing false information may result in your application being rejected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3: // Documents
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Government-Issued ID</Label>
              <FileUpload
                accept="image/*,.pdf"
                maxSize={5 * 1024 * 1024} // 5MB
                onFileSelected={handleFileChange('identificationDoc')}
                currentFile={formData.identificationDoc}
                helperText="Upload a clear copy of your ID (National ID, Passport, Driver's License). Max 5MB."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Proof of Income</Label>
              <FileUpload
                accept="image/*,.pdf"
                maxSize={5 * 1024 * 1024} // 5MB
                onFileSelected={handleFileChange('proofOfIncomeDoc')}
                currentFile={formData.proofOfIncomeDoc}
                helperText="Upload pay stubs, bank statements, or tax returns from the last 3 months. Max 5MB."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Selfie Photo</Label>
              <FileUpload
                accept="image/*"
                maxSize={5 * 1024 * 1024} // 5MB
                onFileSelected={handleFileChange('selfiePhoto')}
                currentFile={formData.selfiePhoto}
                helperText="Upload a clear selfie photo showing your face. Max 5MB."
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <div className="flex">
                <AlertCircle className="text-blue-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Document Security</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    All documents are encrypted and stored securely. Only authorized loan officers will be able to access them during the verification process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4: // References
        return (
          <div className="space-y-8">
            <div>
              <h3 className="font-medium text-lg mb-4">Reference #1</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reference1Name">Full Name</Label>
                  <Input
                    id="reference1Name"
                    name="reference1Name"
                    value={formData.reference1Name}
                    onChange={handleChange}
                    placeholder="Enter reference's full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reference1Relationship">Relationship</Label>
                  <Select
                    value={formData.reference1Relationship}
                    onValueChange={handleSelectChange('reference1Relationship')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family">Family Member</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="colleague">Colleague</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reference1Phone">Phone Number</Label>
                  <PhoneInput
                    id="reference1Phone"
                    value={formData.reference1Phone}
                    onChange={handlePhoneChange('reference1Phone')}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Reference #2</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reference2Name">Full Name</Label>
                  <Input
                    id="reference2Name"
                    name="reference2Name"
                    value={formData.reference2Name}
                    onChange={handleChange}
                    placeholder="Enter reference's full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reference2Relationship">Relationship</Label>
                  <Select
                    value={formData.reference2Relationship}
                    onValueChange={handleSelectChange('reference2Relationship')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family">Family Member</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="colleague">Colleague</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reference2Phone">Phone Number</Label>
                  <PhoneInput
                    id="reference2Phone"
                    value={formData.reference2Phone}
                    onChange={handlePhoneChange('reference2Phone')}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium mb-2">Why References?</h4>
              <p className="text-sm text-muted-foreground">
                References help us verify your identity and relationships. They may be contacted during the loan approval process but won't be asked about your financial information.
              </p>
            </div>
          </div>
        );
        
      case 5: // Review & Submit
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <CheckCircle2 className="text-green-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Almost Done!</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Please review your loan application details below before submitting.
                  </p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="loan">Loan</TabsTrigger>
                <TabsTrigger value="employment">Employment</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="references">References</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p>{`${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p>{formData.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                    <p>{formData.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">National ID</p>
                    <p>{formData.nationalId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p>{`${formData.address}, ${formData.city}, ${formData.zipCode}`}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="loan" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Loan Amount</p>
                    <p className="text-lg font-semibold">{formatCurrency(formData.loanAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Purpose</p>
                    <p className="capitalize">{formData.purpose.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Loan Term</p>
                    <p>{formData.loanTerm} months</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                    <p>12% annually</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Payment</p>
                    <p className="font-semibold text-lending-primary">{formatCurrency(calculateMonthlyPayment())}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Repayment</p>
                    <p>{formatCurrency(calculateMonthlyPayment() * parseInt(formData.loanTerm))}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="employment" className="mt-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employment Status</p>
                    <p className="capitalize">{formData.employmentStatus?.replace('_', ' ')}</p>
                  </div>
                  {formData.employmentStatus && formData.employmentStatus !== 'unemployed' && formData.employmentStatus !== 'student' && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Employer</p>
                      <p>{formData.employerName}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Income</p>
                    <p>{formatCurrency(parseFloat(formData.monthlyIncome) || 0)}</p>
                  </div>
                  {formData.otherIncome && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Other Income</p>
                      <p>{formatCurrency(parseFloat(formData.otherIncome) || 0)}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID Document</p>
                    <p>{formData.identificationDoc ? formData.identificationDoc.name : 'Not uploaded'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Proof of Income</p>
                    <p>{formData.proofOfIncomeDoc ? formData.proofOfIncomeDoc.name : 'Not uploaded'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Selfie Photo</p>
                    <p>{formData.selfiePhoto ? formData.selfiePhoto.name : 'Not uploaded'}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="references" className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Reference #1</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p>{formData.reference1Name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Relationship</p>
                      <p className="capitalize">{formData.reference1Relationship?.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p>{formData.reference1Phone}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Reference #2</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p>{formData.reference2Name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Relationship</p>
                      <p className="capitalize">{formData.reference2Relationship?.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p>{formData.reference2Phone}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="consent"
                  className="h-4 w-4 mt-1 rounded border-gray-300 text-lending-primary focus:ring-lending-primary"
                />
                <label htmlFor="consent" className="text-sm text-gray-600">
                  I confirm that all the information provided is accurate and complete. I understand that providing false information may result in the rejection of my application and could have legal consequences.
                </label>
              </div>
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
          <h1 className="text-3xl font-bold mb-6">Loan Application</h1>
          
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center flex-1 ${index > 0 ? 'pl-4' : ''}`}
                >
                  <div className="relative w-full mb-2">
                    {index > 0 && (
                      <div 
                        className={`absolute top-1/2 transform -translate-y-1/2 h-1 w-full -left-4 ${
                          index <= currentStep ? 'bg-lending-primary' : 'bg-gray-300'
                        }`} 
                      />
                    )}
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 ${
                        index < currentStep
                          ? 'bg-lending-primary text-white'
                          : index === currentStep
                          ? 'bg-lending-primary text-white'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      {index < currentStep ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs md:text-sm font-medium text-center hidden md:block ${
                    index <= currentStep ? 'text-lending-primary' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Form Container */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>
                {currentStep === 0 && "Please provide your personal information"}
                {currentStep === 1 && "Tell us about the loan you're applying for"}
                {currentStep === 2 && "Tell us about your employment and income"}
                {currentStep === 3 && "Upload the required documents for verification"}
                {currentStep === 4 && "Provide contact information for two references"}
                {currentStep === 5 && "Review your application before submission"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button 
                  onClick={nextStep}
                  className="bg-lending-primary hover:bg-lending-primary/90"
                >
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="bg-lending-primary hover:bg-lending-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default LoanApplication;
