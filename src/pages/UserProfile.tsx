import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dataService } from '@/services/dataService';
import { Profile } from '@/services/mockDataService';
import { CheckCircle, Upload, User } from 'lucide-react';
import { useProfileData } from '@/hooks/use-profile-data';
import { useNavigate } from 'react-router-dom';
import { FadeIn, StaggeredItems } from '@/components/ui/animations';
import { FileUpload } from '@/components/ui/file-upload';

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { profile, loading: profileLoading, updateProfile } = useProfileData();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    first_name: '',
    last_name: '',
    id_number: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    nationality: 'Kenyan',
    id_document: null as File | null,
    selfie: null as File | null,
  });

  // Contact Information
  const [contactInfo, setContactInfo] = useState({
    phone_number: '',
    alternative_phone: '',
    email: '',
    address: '',
    county: '',
    subcounty: '',
    village: '',
    landmark: '',
    residence_duration: '',
  });

  // Employment Information
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

  // Banking Information
  const [bankingInfo, setBankingInfo] = useState({
    bank_name: '',
    bank_branch: '',
    account_number: '',
    mpesa_number: '',
    statement_document: null as File | null,
  });

  // Next of Kin Information
  const [kinInfo, setKinInfo] = useState({
    kin_name: '',
    kin_relationship: '',
    kin_phone: '',
    kin_id_number: '',
    kin_address: '',
  });

  // Check if profile is complete
  useEffect(() => {
    if (profile) {
      // Update form state with profile data
      setPersonalInfo({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        id_number: profile.id_number || '',
        date_of_birth: profile.date_of_birth || '',
        gender: profile.gender || '',
        marital_status: profile.marital_status || '',
        nationality: profile.nationality || 'Kenyan',
        id_document: null,
        selfie: null,
      });
      
      setContactInfo({
        phone_number: profile.phone_number || '',
        alternative_phone: profile.alternative_phone || '',
        email: profile.email || user?.email || '',
        address: profile.address || '',
        county: profile.county || '',
        subcounty: profile.sub_county || '',  // Fixed property name
        village: profile.village || '',
        landmark: profile.landmark || '',
        residence_duration: profile.residence_duration || '',  // This now exists in the Profile type
      });
      
      setEmploymentInfo({
        employment_status: profile.employment_status || '',
        occupation: profile.occupation || '',
        employer_name: profile.employer_name || '',
        employer_contact: profile.employer_contact || '',
        monthly_income: profile.monthly_income || 0,
        secondary_income: profile.secondary_income || '',
        pay_frequency: profile.pay_frequency || '',
        work_location: profile.work_location || '',
        payslip_document: null,
      });
      
      setBankingInfo({
        bank_name: profile.bank_name || '',
        bank_branch: profile.bank_branch || '',
        account_number: profile.account_number || '',
        mpesa_number: profile.mpesa_number || '',
        statement_document: null,
      });
      
      setKinInfo({
        kin_name: profile.kin_name || '',
        kin_relationship: profile.kin_relationship || '',
        kin_phone: profile.kin_phone || '',
        kin_id_number: profile.kin_id_number || '',
        kin_address: profile.kin_address || '',
      });
      
      // Check if required fields are filled
      const requiredFields = [
        'first_name', 'last_name', 'id_number', 'phone_number',
        'address', 'county', 'employment_status', 'monthly_income',
        'mpesa_number', 'kin_name', 'kin_phone', 'kin_relationship'
      ];
      
      const isComplete = requiredFields.every(field => 
        profile && profile[field as keyof Profile]
      );
      
      setIsProfileComplete(isComplete);
    }
  }, [profile, user]);

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleEmploymentInfoChange = (field: string, value: string | number) => {
    setEmploymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleBankingInfoChange = (field: string, value: string) => {
    setBankingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleKinInfoChange = (field: string, value: string) => {
    setKinInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile({
        ...profile,
        first_name: personalInfo.first_name,
        last_name: personalInfo.last_name,
        id_number: personalInfo.id_number,
        date_of_birth: personalInfo.date_of_birth,
        gender: personalInfo.gender,
        marital_status: personalInfo.marital_status,
        nationality: personalInfo.nationality,
        // Handle file upload for ID document and selfie here in a real app
        id_document_url: personalInfo.id_document ? URL.createObjectURL(personalInfo.id_document) : profile?.id_document_url,
        selfie_url: personalInfo.selfie ? URL.createObjectURL(personalInfo.selfie) : profile?.selfie_url,
      });
      
      toast.success('Personal information saved successfully');
      setActiveTab('contact');
    } catch (error) {
      console.error('Error saving personal information:', error);
      toast.error('Failed to save personal information');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile({
        ...profile,
        phone_number: contactInfo.phone_number,
        alternative_phone: contactInfo.alternative_phone,
        email: contactInfo.email,
        address: contactInfo.address,
        county: contactInfo.county,
        sub_county: contactInfo.subcounty,  // Fixed property name
        village: contactInfo.village,
        landmark: contactInfo.landmark,
        residence_duration: contactInfo.residence_duration,
      });
      
      toast.success('Contact information saved successfully');
      setActiveTab('employment');
    } catch (error) {
      console.error('Error saving contact information:', error);
      toast.error('Failed to save contact information');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmployment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile({
        ...profile,
        employment_status: employmentInfo.employment_status,
        occupation: employmentInfo.occupation,
        employer_name: employmentInfo.employer_name,
        employer_contact: employmentInfo.employer_contact,
        monthly_income: Number(employmentInfo.monthly_income),
        secondary_income: employmentInfo.secondary_income,
        pay_frequency: employmentInfo.pay_frequency,
        work_location: employmentInfo.work_location,
        // Handle file upload for payslip here in a real app
        payslip_url: employmentInfo.payslip_document ? URL.createObjectURL(employmentInfo.payslip_document) : profile?.payslip_url,
      });
      
      toast.success('Employment information saved successfully');
      setActiveTab('banking');
    } catch (error) {
      console.error('Error saving employment information:', error);
      toast.error('Failed to save employment information');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBanking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile({
        ...profile,
        bank_name: bankingInfo.bank_name,
        bank_branch: bankingInfo.bank_branch,
        account_number: bankingInfo.account_number,
        mpesa_number: bankingInfo.mpesa_number,
        // Handle file upload for statement here in a real app
        statement_url: bankingInfo.statement_document ? URL.createObjectURL(bankingInfo.statement_document) : profile?.statement_url,
      });
      
      toast.success('Banking information saved successfully');
      setActiveTab('kin');
    } catch (error) {
      console.error('Error saving banking information:', error);
      toast.error('Failed to save banking information');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveKin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile({
        ...profile,
        kin_name: kinInfo.kin_name,
        kin_relationship: kinInfo.kin_relationship,
        kin_phone: kinInfo.kin_phone,
        kin_id_number: kinInfo.kin_id_number,
        kin_address: kinInfo.kin_address,
      });
      
      toast.success('Next of kin information saved successfully');
      
      // Check if profile is now complete and offer to navigate to loan application
      const completeProfile = await dataService.profiles.getProfile(user?.id || '');
      const requiredFields = [
        'first_name', 'last_name', 'id_number', 'phone_number',
        'address', 'county', 'employment_status', 'monthly_income',
        'mpesa_number', 'kin_name', 'kin_phone', 'kin_relationship'
      ];
      
      const isComplete = requiredFields.every(field => 
        completeProfile && completeProfile[field as keyof Profile]
      );
      
      setIsProfileComplete(isComplete);
      
      if (isComplete) {
        toast.success('Your profile is now complete! You can now apply for a loan.');
        setTimeout(() => {
          const confirmApply = window.confirm('Your profile is complete. Would you like to apply for a loan now?');
          if (confirmApply) {
            navigate('/apply');
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving next of kin information:', error);
      toast.error('Failed to save next of kin information');
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lending-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <FadeIn>
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
                <p className="text-gray-600">Complete your profile to apply for loans</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <div className={`flex items-center ${isProfileComplete ? 'text-green-500' : 'text-amber-500'}`}>
                  {isProfileComplete ? <CheckCircle className="h-5 w-5 mr-2" /> : <User className="h-5 w-5 mr-2" />}
                  <span className="text-sm font-medium">
                    {isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'}
                  </span>
                </div>
                {isProfileComplete && (
                  <Button className="ml-4 bg-lending-primary hover:bg-lending-primary/90" onClick={() => navigate('/apply')}>
                    Apply for a Loan
                  </Button>
                )}
              </div>
            </div>
            
            <Card className="border-2 border-lending-primary/20">
              <CardHeader className="border-b bg-gradient-to-r from-lending-primary/10 to-blue-500/10">
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>
                  Please provide accurate information for loan eligibility
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-5 mb-8">
                    <TabsTrigger value="personal" className="text-xs md:text-sm">Personal</TabsTrigger>
                    <TabsTrigger value="contact" className="text-xs md:text-sm">Contact</TabsTrigger>
                    <TabsTrigger value="employment" className="text-xs md:text-sm">Employment</TabsTrigger>
                    <TabsTrigger value="banking" className="text-xs md:text-sm">Banking</TabsTrigger>
                    <TabsTrigger value="kin" className="text-xs md:text-sm">Next of Kin</TabsTrigger>
                  </TabsList>
                  
                  <StaggeredItems className="space-y-4">
                    {/* Personal Information */}
                    <TabsContent value="personal" className="space-y-4">
                      <form onSubmit={handleSavePersonal} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="first_name">First Name *</Label>
                            <Input
                              id="first_name"
                              value={personalInfo.first_name}
                              onChange={(e) => handlePersonalInfoChange('first_name', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="last_name">Last Name *</Label>
                            <Input
                              id="last_name"
                              value={personalInfo.last_name}
                              onChange={(e) => handlePersonalInfoChange('last_name', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="id_number">National ID/Passport Number *</Label>
                            <Input
                              id="id_number"
                              value={personalInfo.id_number}
                              onChange={(e) => handlePersonalInfoChange('id_number', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="date_of_birth">Date of Birth *</Label>
                            <Input
                              id="date_of_birth"
                              type="date"
                              value={personalInfo.date_of_birth}
                              onChange={(e) => handlePersonalInfoChange('date_of_birth', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="gender">Gender *</Label>
                            <Select 
                              value={personalInfo.gender} 
                              onValueChange={(value) => handlePersonalInfoChange('gender', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="marital_status">Marital Status *</Label>
                            <Select 
                              value={personalInfo.marital_status} 
                              onValueChange={(value) => handlePersonalInfoChange('marital_status', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Marital Status" />
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
                            <Label htmlFor="nationality">Nationality *</Label>
                            <Input
                              id="nationality"
                              value={personalInfo.nationality}
                              onChange={(e) => handlePersonalInfoChange('nationality', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label htmlFor="id_document" className="mb-2 block">
                              ID/Passport Document Scan *
                            </Label>
                            <FileUpload
                              accept=".jpg,.jpeg,.png,.pdf"
                              maxSize={5 * 1024 * 1024} // 5MB
                              onFileSelected={(file) => setPersonalInfo(prev => ({ ...prev, id_document: file }))}
                              currentFile={personalInfo.id_document}
                              helperText="Upload a clear scan of your ID (both sides)"
                            />
                            {profile?.id_document_url && !personalInfo.id_document && (
                              <p className="text-xs text-green-600 mt-1">ID document already uploaded</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="selfie" className="mb-2 block">
                              Selfie with ID *
                            </Label>
                            <FileUpload
                              accept=".jpg,.jpeg,.png"
                              maxSize={5 * 1024 * 1024} // 5MB
                              onFileSelected={(file) => setPersonalInfo(prev => ({ ...prev, selfie: file }))}
                              currentFile={personalInfo.selfie}
                              helperText="Take a clear selfie holding your ID"
                            />
                            {profile?.selfie_url && !personalInfo.selfie && (
                              <p className="text-xs text-green-600 mt-1">Selfie already uploaded</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="pt-4 flex justify-end">
                          <Button 
                            type="submit" 
                            className="bg-lending-primary hover:bg-lending-primary/90"
                            disabled={saving}
                          >
                            {saving ? 'Saving...' : 'Save & Continue'}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                    
                    {/* Contact Information */}
                    <TabsContent value="contact" className="space-y-4">
                      <form onSubmit={handleSaveContact} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="phone_number">Phone Number *</Label>
                            <Input
                              id="phone_number"
                              value={contactInfo.phone_number}
                              onChange={(e) => handleContactInfoChange('phone_number', e.target.value)}
                              placeholder="+254 7XX XXX XXX"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="alternative_phone">Alternative Phone Number</Label>
                            <Input
                              id="alternative_phone"
                              value={contactInfo.alternative_phone}
                              onChange={(e) => handleContactInfoChange('alternative_phone', e.target.value)}
                              placeholder="+254 7XX XXX XXX"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={contactInfo.email}
                              onChange={(e) => handleContactInfoChange('email', e.target.value)}
                              placeholder="your@email.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="address">Physical Address *</Label>
                            <Input
                              id="address"
                              value={contactInfo.address}
                              onChange={(e) => handleContactInfoChange('address', e.target.value)}
                              placeholder="Your current address"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="county">County *</Label>
                            <Select 
                              value={contactInfo.county} 
                              onValueChange={(value) => handleContactInfoChange('county', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select County" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kiambu', 
                                  'Thika', 'Machakos', 'Kisii', 'Kakamega', 'Nyeri', 'Meru', 
                                  'Garissa', 'Malindi', 'Kitale', 'Bungoma', 'Kericho', 'Naivasha'
                                ].map(county => (
                                  <SelectItem key={county} value={county.toLowerCase()}>{county}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="subcounty">Sub-County</Label>
                            <Input
                              id="subcounty"
                              value={contactInfo.subcounty}
                              onChange={(e) => handleContactInfoChange('subcounty', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="village">Village/Estate</Label>
                            <Input
                              id="village"
                              value={contactInfo.village}
                              onChange={(e) => handleContactInfoChange('village', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="landmark">Landmark Near Home</Label>
                            <Input
                              id="landmark"
                              value={contactInfo.landmark}
                              onChange={(e) => handleContactInfoChange('landmark', e.target.value)}
                              placeholder="E.g. Near Tuskys Supermarket"
                            />
                          </div>
                          <div>
                            <Label htmlFor="residence_duration">How Long at Current Address?</Label>
                            <Select 
                              value={contactInfo.residence_duration} 
                              onValueChange={(value) => handleContactInfoChange('residence_duration', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="less_than_6_months">Less than 6 months</SelectItem>
                                <SelectItem value="6_months_to_1_year">6 months to 1 year</SelectItem>
                                <SelectItem value="1_to_3_years">1 to 3 years</SelectItem>
                                <SelectItem value="3_to_5_years">3 to 5 years</SelectItem>
                                <SelectItem value="more_than_5_years">More than 5 years</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="pt-4 flex justify-between">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setActiveTab('personal')}
                          >
                            Previous
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-lending-primary hover:bg-lending-primary/90"
                            disabled={saving}
                          >
                            {saving ? 'Saving...' : 'Save & Continue'}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                    
                    {/* Employment Information */}
                    <TabsContent value="employment" className="space-y-4">
                      <form onSubmit={handleSaveEmployment} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="employment_status">Employment Status *</Label>
                            <Select 
                              value={employmentInfo.employment_status} 
                              onValueChange={(value) => handleEmploymentInfoChange('employment_status', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="employed">Formally Employed</SelectItem>
                                <SelectItem value="self-employed">Self-Employed</SelectItem>
                                <SelectItem value="business-owner">Business Owner</SelectItem>
                                <SelectItem value="farmer">Farmer</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="unemployed">Unemployed</SelectItem>
                                <SelectItem value="retired">Retired</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="occupation">Occupation/Business Type</Label>
                            <Input
                              id="occupation"
                              value={employmentInfo.occupation}
                              onChange={(e) => handleEmploymentInfoChange('occupation', e.target.value)}
                              placeholder="Your job title or business type"
                            />
                          </div>
                          <div>
                            <Label htmlFor="employer_name">Employer Name/Business Name</Label>
                            <Input
                              id="employer_name"
                              value={employmentInfo.employer_name}
                              onChange={(e) => handleEmploymentInfoChange('employer_name', e.target.value)}
                              placeholder="Your employer or business name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="employer_contact">Employer Contact Details</Label>
                            <Input
                              id="employer_contact"
                              value={employmentInfo.employer_contact}
                              onChange={(e) => handleEmploymentInfoChange('employer_contact', e.target.value)}
                              placeholder="Employer phone number or email"
                            />
                          </div>
                          <div>
                            <Label htmlFor="monthly_income">Monthly Income (KSh) *</Label>
                            <Input
                              id="monthly_income"
                              type="number"
                              value={employmentInfo.monthly_income.toString()}
                              onChange={(e) => handleEmploymentInfoChange('monthly_income', e.target.value)}
                              placeholder="Your net monthly income"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="secondary_income">Secondary Sources of Income</Label>
                            <Input
                              id="secondary_income"
                              value={employmentInfo.secondary_income}
                              onChange={(e) => handleEmploymentInfoChange('secondary_income', e.target.value)}
                              placeholder="Additional income sources"
                            />
                          </div>
                          <div>
                            <Label htmlFor="pay_frequency">Pay Frequency</Label>
                            <Select 
                              value={employmentInfo.pay_frequency} 
                              onValueChange={(value) => handleEmploymentInfoChange('pay_frequency', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="work_location">Work Location</Label>
                            <Input
                              id="work_location"
                              value={employmentInfo.work_location}
                              onChange={(e) => handleEmploymentInfoChange('work_location', e.target.value)}
                              placeholder="Where you work from"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Label htmlFor="payslip_document" className="mb-2 block">
                            Payslip/Proof of Income
                          </Label>
                          <FileUpload
                            accept=".jpg,.jpeg,.png,.pdf"
                            maxSize={5 * 1024 * 1024} // 5MB
                            onFileSelected={(file) => setEmploymentInfo(prev => ({ ...prev, payslip_document: file }))}
                            currentFile={employmentInfo.payslip_document}
                            helperText="Upload your latest payslip or proof of income"
                          />
                          {profile?.payslip_url && !employmentInfo.payslip_document && (
                            <p className="text-xs text-green-600 mt-1">Proof of income already uploaded</p>
                          )}
                        </div>
                        
                        <div className="pt-4 flex justify-between">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setActiveTab('contact')}
                          >
                            Previous
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-lending-primary hover:bg-lending-primary/90"
                            disabled={saving}
                          >
                            {saving ? 'Saving...' : 'Save & Continue'}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                    
                    {/* Banking Information */}
                    <TabsContent value="banking" className="space-y-4">
                      <form onSubmit={handleSaveBanking} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="bank_name">Bank Name</Label>
                            <Select 
                              value={bankingInfo.bank_name} 
                              onValueChange={(value) => handleBankingInfoChange('bank_name', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Bank" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kcb">KCB Bank</SelectItem>
                                <SelectItem value="equity">Equity Bank</SelectItem>
                                <SelectItem value="cooperative">Co-operative Bank</SelectItem>
                                <SelectItem value="standard_chartered">Standard Chartered</SelectItem>
                                <SelectItem value="barclays">ABSA (Barclays)</SelectItem>
                                <SelectItem value="family">Family Bank</SelectItem>
                                <SelectItem value="dtb">Diamond Trust Bank</SelectItem>
                                <SelectItem value="ncba">NCBA Bank</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="bank_branch">Bank Branch</Label>
                            <Input
                              id="bank_branch"
                              value={bankingInfo.bank_branch}
                              onChange={(e) => handleBankingInfoChange('bank_branch', e.target.value)}
                              placeholder="Branch name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="account_number">Bank Account Number</Label>
                            <Input
                              id="account_number"
                              value={bankingInfo.account_number}
                              onChange={(e) => handleBankingInfoChange('account_number', e.target.value)}
                              placeholder="Your account number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="mpesa_number">M-Pesa Number *</Label>
                            <Input
                              id="mpesa_number"
                              value={bankingInfo.mpesa_number}
                              onChange={(e) => handleBankingInfoChange('mpesa_number', e.target.value)}
                              placeholder="+254 7XX XXX XXX"
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">Will be used for loan disbursement</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Label htmlFor="statement_document" className="mb-2 block">
                            Bank/M-Pesa Statement
                          </Label>
                          <FileUpload
                            accept=".jpg,.jpeg,.png,.pdf"
                            maxSize={5 * 1024 * 1024} // 5MB
                            onFileSelected={(file) => setBankingInfo(prev => ({ ...prev, statement_document: file }))}
                            currentFile={bankingInfo.statement_document}
                            helperText="Upload your last 3 months bank or M-Pesa statement"
                          />
                          {profile?.statement_url && !bankingInfo.statement_document && (
                            <p className="text-xs text-green-600 mt-1">Statement already uploaded</p>
                          )}
                        </div>
                        
                        <div className="
