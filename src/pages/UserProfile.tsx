import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhoneInput } from '@/components/ui/phone-input';
import { Camera, Check, CreditCard, FileText, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/lib/auth';
import { dataService } from '@/services/dataService';
import { Profile } from '@/services/mockDataService';
import { FadeIn, StaggeredItems } from '@/components/ui/animations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { FileUpload } from '@/components/ui/file-upload';
import { useScreenSize } from '@/hooks/use-screen-size';

const UserProfile = () => {
  const { user } = useAuth();
  const { isMobile } = useScreenSize();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Personal Identification Details
  const [personalInfo, setPersonalInfo] = useState({
    avatar_url: '',
    first_name: '',
    last_name: '',
    id_number: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    nationality: 'Kenyan',
    id_document: null as File | null,
    selfie_photo: null as File | null,
  });

  // Contact & Residential Information
  const [contactInfo, setContactInfo] = useState({
    address: '',
    county: '',
    sub_county: '',
    village: '',
    landmark: '',
    permanent_address: '',
    phone_number: '',
    alternative_phone: '',
    email: '',
    years_at_address: '',
  });

  // Employment & Income Details
  const [employmentInfo, setEmploymentInfo] = useState({
    employment_status: '',
    occupation: '',
    employer_name: '',
    employer_contact: '',
    monthly_income: 0,
    secondary_income: '',
    pay_frequency: '',
    work_location: '',
    payslip_document: null as File | null,
  });

  // Banking & Mobile Money Details
  const [bankingInfo, setBankingInfo] = useState({
    bank_name: '',
    bank_branch: '',
    account_number: '',
    mpesa_number: '',
    statements_document: null as File | null,
    preferred_disbursement: '',
  });

  // Credit History & Loan Behavior
  const [creditInfo, setCreditInfo] = useState({
    previous_loans: '',
    outstanding_loans: '',
    credit_score_consent: false,
    purpose_of_loan: '',
    requested_amount: '',
    repayment_period: '',
    repayment_channel: '',
  });

  // Next of Kin / Guarantor Details
  const [kinInfo, setKinInfo] = useState({
    kin_name: '',
    kin_relationship: '',
    kin_phone: '',
    kin_id_number: '',
    kin_address: '',
    guarantor_consent: false,
  });

  // Digital Footprint
  const [digitalInfo, setDigitalInfo] = useState({
    smartphone_ownership: '',
    social_media_handles: '',
    app_permissions_consent: false,
  });

  // Legal & Compliance
  const [legalInfo, setLegalInfo] = useState({
    kyc_consent: false,
    terms_agreement: false,
    data_usage_consent: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const profileData = await dataService.profiles.getProfile(user.id);
        
        if (profileData) {
          setProfile(profileData);
          
          // Update all state objects with data from profile
          setPersonalInfo(prev => ({
            ...prev,
            avatar_url: profileData.avatar_url || '',
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            id_number: profileData.id_number || '',
            date_of_birth: profileData.date_of_birth || '',
            gender: profileData.gender || '',
            marital_status: profileData.marital_status || '',
            nationality: profileData.nationality || 'Kenyan',
          }));

          setContactInfo(prev => ({
            ...prev,
            address: profileData.address || '',
            county: profileData.county || '',
            sub_county: profileData.sub_county || '',
            village: profileData.village || '',
            landmark: profileData.landmark || '',
            permanent_address: profileData.permanent_address || '',
            phone_number: profileData.phone_number || '',
            alternative_phone: profileData.alternative_phone || '',
            email: profileData.email || user.email || '',
            years_at_address: profileData.years_at_address || '',
          }));

          setEmploymentInfo(prev => ({
            ...prev,
            employment_status: profileData.employment_status || '',
            occupation: profileData.occupation || '',
            employer_name: profileData.employer_name || '',
            employer_contact: profileData.employer_contact || '',
            monthly_income: profileData.monthly_income?.toString() || '',
            secondary_income: profileData.secondary_income || '',
            pay_frequency: profileData.pay_frequency || '',
            work_location: profileData.work_location || '',
          }));

          setBankingInfo(prev => ({
            ...prev,
            bank_name: profileData.bank_name || '',
            bank_branch: profileData.bank_branch || '',
            account_number: profileData.account_number || '',
            mpesa_number: profileData.mpesa_number || '',
            preferred_disbursement: profileData.preferred_disbursement || '',
          }));
          
          // ... Populate other state objects similarly
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

  const handleInputChange = (stateSetter: React.Dispatch<React.SetStateAction<any>>, fieldName: string, value: any) => {
    stateSetter(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleFileChange = (stateSetter: React.Dispatch<React.SetStateAction<any>>, fieldName: string, file: File | null) => {
    stateSetter(prev => ({ ...prev, [fieldName]: file }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      // Convert monthly income to number if it's a string
      const monthlyIncome = typeof employmentInfo.monthly_income === 'string' 
        ? parseInt(employmentInfo.monthly_income, 10) || 0
        : employmentInfo.monthly_income;
      
      // Combine all profile data
      const profileData: Partial<Profile> = {
        ...personalInfo,
        ...contactInfo,
        ...{...employmentInfo, monthly_income: monthlyIncome},
        ...bankingInfo,
        ...creditInfo,
        ...kinInfo,
        ...digitalInfo,
        ...legalInfo,
        // Handle file uploads separately or convert to URLs
        id_document_url: personalInfo.id_document ? `/mock-url/${personalInfo.id_document.name}` : profile?.id_document_url || '',
        selfie_photo_url: personalInfo.selfie_photo ? `/mock-url/${personalInfo.selfie_photo.name}` : profile?.selfie_photo_url || '',
        payslip_document_url: employmentInfo.payslip_document ? `/mock-url/${employmentInfo.payslip_document.name}` : profile?.payslip_document_url || '',
        statements_document_url: bankingInfo.statements_document ? `/mock-url/${bankingInfo.statements_document.name}` : profile?.statements_document_url || '',
      };
      
      await dataService.profiles.updateProfile(user.id, profileData);
      
      toast.success('Profile updated successfully');
      
      // Update local profile state
      setProfile(prev => prev ? {...prev, ...profileData} : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (!personalInfo.first_name || !personalInfo.last_name) return 'U';
    return `${personalInfo.first_name[0]}${personalInfo.last_name[0]}`.toUpperCase();
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
            <Card className="border-2 border-lending-primary/20">
              <CardHeader className="bg-gradient-to-r from-lending-primary/10 to-blue-500/10">
                <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="space-y-4">
                  <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="contact">Contact & Location</TabsTrigger>
                    <TabsTrigger value="employment">Employment & Income</TabsTrigger>
                    <TabsTrigger value="financial">Financial Info</TabsTrigger>
                  </TabsList>

                  {/* Personal Identification Details */}
                  <TabsContent value="personal" className="space-y-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar className="h-20 w-20">
                        {personalInfo.avatar_url ? (
                          <AvatarImage src={personalInfo.avatar_url} alt="Avatar" />
                        ) : (
                          <AvatarFallback className="bg-lending-primary text-white text-xl">
                            {getInitials()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-lg font-medium leading-none">
                          {personalInfo.first_name} {personalInfo.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user?.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                handleInputChange(setPersonalInfo, 'avatar_url', url);
                              }
                            }}
                          />
                          <Label
                            htmlFor="avatar-upload"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary hover:bg-secondary bg-muted text-muted-foreground hover:text-muted-foreground h-9 px-4 py-2"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Upload Photo
                          </Label>
                        </div>
                      </div>
                    </div>

                    <StaggeredItems className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          type="text"
                          id="firstName"
                          value={personalInfo.first_name}
                          onChange={(e) => handleInputChange(setPersonalInfo, 'first_name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          type="text"
                          id="lastName"
                          value={personalInfo.last_name}
                          onChange={(e) => handleInputChange(setPersonalInfo, 'last_name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="idNumber">National ID/Passport Number</Label>
                        <Input
                          type="text"
                          id="idNumber"
                          value={personalInfo.id_number}
                          onChange={(e) => handleInputChange(setPersonalInfo, 'id_number', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          type="date"
                          id="dateOfBirth"
                          value={personalInfo.date_of_birth}
                          onChange={(e) => handleInputChange(setPersonalInfo, 'date_of_birth', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select 
                          value={personalInfo.gender}
                          onValueChange={(value) => handleInputChange(setPersonalInfo, 'gender', value)}
                        >
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="maritalStatus">Marital Status</Label>
                        <Select 
                          value={personalInfo.marital_status}
                          onValueChange={(value) => handleInputChange(setPersonalInfo, 'marital_status', value)}
                        >
                          <SelectTrigger id="maritalStatus">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input
                          type="text"
                          id="nationality"
                          value={personalInfo.nationality}
                          onChange={(e) => handleInputChange(setPersonalInfo, 'nationality', e.target.value)}
                        />
                      </div>
                    </StaggeredItems>

                    <div className="space-y-4 mt-6">
                      <h3 className="text-lg font-semibold">Identity Documents</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="idDocument" className="mb-2 block">
                            ID Document <span className="text-red-500">*</span>
                          </Label>
                          <FileUpload
                            accept=".jpg,.jpeg,.png,.pdf"
                            maxSize={5 * 1024 * 1024} // 5MB
                            onFileSelected={(file) => handleFileChange(setPersonalInfo, 'id_document', file)}
                            currentFile={personalInfo.id_document}
                            helperText="Upload a clear photo of your National ID (front and back)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="selfiePhoto" className="mb-2 block">
                            Selfie Photo <span className="text-red-500">*</span>
                          </Label>
                          <FileUpload
                            accept=".jpg,.jpeg,.png"
                            maxSize={5 * 1024 * 1024}
                            onFileSelected={(file) => handleFileChange(setPersonalInfo, 'selfie_photo', file)}
                            currentFile={personalInfo.selfie_photo}
                            helperText="Upload a clear selfie holding your ID card"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        className="bg-lending-primary hover:bg-lending-primary/90"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Personal Information'}
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Contact & Residential Information */}
                  <TabsContent value="contact" className="space-y-6">
                    <StaggeredItems className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="address">Current Physical Address</Label>
                        <Input
                          type="text"
                          id="address"
                          value={contactInfo.address}
                          onChange={(e) => handleInputChange(setContactInfo, 'address', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="county">County</Label>
                        <Select 
                          value={contactInfo.county}
                          onValueChange={(value) => handleInputChange(setContactInfo, 'county', value)}
                        >
                          <SelectTrigger id="county">
                            <SelectValue placeholder="Select county" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nairobi">Nairobi</SelectItem>
                            <SelectItem value="mombasa">Mombasa</SelectItem>
                            <SelectItem value="kisumu">Kisumu</SelectItem>
                            <SelectItem value="nakuru">Nakuru</SelectItem>
                            <SelectItem value="eldoret">Eldoret</SelectItem>
                            {/* Add more counties */}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subCounty">Sub-county</Label>
                        <Input
                          type="text"
                          id="subCounty"
                          value={contactInfo.sub_county}
                          onChange={(e) => handleInputChange(setContactInfo, 'sub_county', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="village">Village/Estate</Label>
                        <Input
                          type="text"
                          id="village"
                          value={contactInfo.village}
                          onChange={(e) => handleInputChange(setContactInfo, 'village', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="landmark">Nearest Landmark</Label>
                        <Input
                          type="text"
                          id="landmark"
                          value={contactInfo.landmark}
                          onChange={(e) => handleInputChange(setContactInfo, 'landmark', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="permanentAddress">Permanent Address (if different)</Label>
                        <Input
                          type="text"
                          id="permanentAddress"
                          value={contactInfo.permanent_address}
                          onChange={(e) => handleInputChange(setContactInfo, 'permanent_address', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phoneNumber">Phone Number (M-Pesa)</Label>
                        <PhoneInput
                          id="phoneNumber"
                          value={contactInfo.phone_number}
                          onChange={(value) => handleInputChange(setContactInfo, 'phone_number', value)}
                          placeholder="+254 7XX XXX XXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="alternativePhone">Alternative Phone Number</Label>
                        <PhoneInput
                          id="alternativePhone"
                          value={contactInfo.alternative_phone}
                          onChange={(value) => handleInputChange(setContactInfo, 'alternative_phone', value)}
                          placeholder="+254 7XX XXX XXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          type="email"
                          id="email"
                          value={contactInfo.email}
                          onChange={(e) => handleInputChange(setContactInfo, 'email', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="yearsAtAddress">Years at Current Address</Label>
                        <Select 
                          value={contactInfo.years_at_address}
                          onValueChange={(value) => handleInputChange(setContactInfo, 'years_at_address', value)}
                        >
                          <SelectTrigger id="yearsAtAddress">
                            <SelectValue placeholder="Select years" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="less_than_1">Less than 1 year</SelectItem>
                            <SelectItem value="1_to_3">1-3 years</SelectItem>
                            <SelectItem value="3_to_5">3-5 years</SelectItem>
                            <SelectItem value="more_than_5">More than 5 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </StaggeredItems>
                    
                    <div className="flex justify-end pt-4">
                      <Button
                        className="bg-lending-primary hover:bg-lending-primary/90"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Contact Information'}
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Employment & Income Details */}
                  <TabsContent value="employment" className="space-y-6">
                    <StaggeredItems className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="employmentStatus">Employment Status</Label>
                        <Select 
                          value={employmentInfo.employment_status}
                          onValueChange={(value) => handleInputChange(setEmploymentInfo, 'employment_status', value)}
                        >
                          <SelectTrigger id="employmentStatus">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employed">Formally Employed</SelectItem>
                            <SelectItem value="self-employed">Self-employed</SelectItem>
                            <SelectItem value="business">Business Owner</SelectItem>
                            <SelectItem value="unemployed">Unemployed</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="occupation">Occupation/Business Type</Label>
                        <Input
                          type="text"
                          id="occupation"
                          value={employmentInfo.occupation}
                          onChange={(e) => handleInputChange(setEmploymentInfo, 'occupation', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="employerName">Employer Name/Business Name</Label>
                        <Input
                          type="text"
                          id="employerName"
                          value={employmentInfo.employer_name}
                          onChange={(e) => handleInputChange(setEmploymentInfo, 'employer_name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="employerContact">Employer Contact</Label>
                        <Input
                          type="text"
                          id="employerContact"
                          value={employmentInfo.employer_contact}
                          onChange={(e) => handleInputChange(setEmploymentInfo, 'employer_contact', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="monthlyIncome">Monthly Income (KSh)</Label>
                        <Input
                          type="number"
                          id="monthlyIncome"
                          value={employmentInfo.monthly_income}
                          onChange={(e) => handleInputChange(setEmploymentInfo, 'monthly_income', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="secondaryIncome">Secondary Income Source</Label>
                        <Input
                          type="text"
                          id="secondaryIncome"
                          value={employmentInfo.secondary_income}
                          onChange={(e) => handleInputChange(setEmploymentInfo, 'secondary_income', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="payFrequency">Pay Frequency</Label>
                        <Select 
                          value={employmentInfo.pay_frequency}
                          onValueChange={(value) => handleInputChange(setEmploymentInfo, 'pay_frequency', value)}
                        >
                          <SelectTrigger id="payFrequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="workLocation">Work Location</Label>
                        <Input
                          type="text"
                          id="workLocation"
                          value={employmentInfo.work_location}
                          onChange={(e) => handleInputChange(setEmploymentInfo, 'work_location', e.target.value)}
                        />
                      </div>
                    </StaggeredItems>
                    
                    <div className="space-y-4 mt-6">
                      <h3 className="text-lg font-semibold">Income Verification</h3>
                      <div>
                        <Label htmlFor="payslipDocument" className="mb-2 block">
                          Payslip or Proof of Income <span className="text-red-500">*</span>
                        </Label>
                        <FileUpload
                          accept=".jpg,.jpeg,.png,.pdf"
                          maxSize={5 * 1024 * 1024}
                          onFileSelected={(file) => handleFileChange(setEmploymentInfo, 'payslip_document', file)}
                          currentFile={employmentInfo.payslip_document}
                          helperText="Upload payslip, bank statements, or business income records"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button
                        className="bg-lending-primary hover:bg-lending-primary/90"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Employment Information'}
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Financial Information */}
                  <TabsContent value="financial" className="space-y-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Banking & Mobile Money Details</h3>
                      <StaggeredItems className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Select 
                            value={bankingInfo.bank_name}
                            onValueChange={(value) => handleInputChange(setBankingInfo, 'bank_name', value)}
                          >
                            <SelectTrigger id="bankName">
                              <SelectValue placeholder="Select bank" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kcb">KCB Bank</SelectItem>
                              <SelectItem value="equity">Equity Bank</SelectItem>
                              <SelectItem value="coop">Cooperative Bank</SelectItem>
                              <SelectItem value="stanbic">Stanbic Bank</SelectItem>
                              <SelectItem value="absa">ABSA Bank Kenya</SelectItem>
                              <SelectItem value="dtb">Diamond Trust Bank</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="bankBranch">Bank Branch</Label>
                          <Input
                            type="text"
                            id="bankBranch"
                            value={bankingInfo.bank_branch}
                            onChange={(e) => handleInputChange(setBankingInfo, 'bank_branch', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            type="text"
                            id="accountNumber"
                            value={bankingInfo.account_number}
                            onChange={(e) => handleInputChange(setBankingInfo, 'account_number', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="mpesaNumber">M-Pesa Number</Label>
                          <PhoneInput
                            id="mpesaNumber"
                            value={bankingInfo.mpesa_number}
                            onChange={(value) => handleInputChange(setBankingInfo, 'mpesa_number', value)}
                            placeholder="+254 7XX XXX XXX"
                          />
                        </div>
                        <div>
                          <Label htmlFor="preferredDisbursement">Preferred Disbursement Method</Label>
                          <Select 
                            value={bankingInfo.preferred_disbursement}
                            onValueChange={(value) => handleInputChange(setBankingInfo, 'preferred_disbursement', value)}
                          >
                            <SelectTrigger id="preferredDisbursement">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mpesa">M-Pesa</SelectItem>
                              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                              <SelectItem value="airtel_money">Airtel Money</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </StaggeredItems>

                      <div>
                        <Label htmlFor="statementsDocument" className="mb-2 block">
                          Transaction Statements (last 3-6 months) <span className="text-red-500">*</span>
                        </Label>
                        <FileUpload
                          accept=".jpg,.jpeg,.png,.pdf"
                          maxSize={10 * 1024 * 1024}
                          onFileSelected={(file) => handleFileChange(setBankingInfo, 'statements_document', file)}
                          currentFile={bankingInfo.statements_document}
                          helperText="Upload bank or M-Pesa statements for the last 3-6 months"
                        />
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Next of Kin Details</h3>
                      <StaggeredItems className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="kinName">Full Name</Label>
                          <Input
                            type="text"
                            id="kinName"
                            value={kinInfo.kin_name}
                            onChange={(e) => handleInputChange(setKinInfo, 'kin_name', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="kinRelationship">Relationship to You</Label>
                          <Select 
                            value={kinInfo.kin_relationship}
                            onValueChange={(value) => handleInputChange(setKinInfo, 'kin_relationship', value)}
                          >
                            <SelectTrigger id="kinRelationship">
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="kinPhone">Phone Number</Label>
                          <PhoneInput
                            id="kinPhone"
                            value={kinInfo.kin_phone}
                            onChange={(value) => handleInputChange(setKinInfo, 'kin_phone', value)}
                            placeholder="+254 7XX XXX XXX"
                          />
                        </div>
                        <div>
                          <Label htmlFor="kinIdNumber">ID Number</Label>
                          <Input
                            type="text"
                            id="kinIdNumber"
                            value={kinInfo.kin_id_number}
                            onChange={(e) => handleInputChange(setKinInfo, 'kin_id_number', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="kinAddress">Residential Address</Label>
                          <Input
                            type="text"
                            id="kinAddress"
                            value={kinInfo.kin_address}
                            onChange={(e) => handleInputChange(setKinInfo, 'kin_address', e.target.value)}
                          />
                        </div>
                      </StaggeredItems>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button
                        className="bg-lending-primary hover:bg-lending-primary/90"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : 'Save Financial Information'}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </FadeIn>
          <div className="fixed bottom-4 left-4 text-4xl hidden md:block animate-bounce">
            🇰🇪
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default UserProfile;
