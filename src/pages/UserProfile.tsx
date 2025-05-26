import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/ui/file-upload';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/lib/auth';
import { dataService } from '@/services/dataService';
import { Profile } from '@/types/loan';
import { toast } from 'sonner';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    id_number: '',
    date_of_birth: '',
    gender: '',
    marital_status: '',
    nationality: '',
  });

  const [contactInfo, setContactInfo] = useState({
    address: '',
    county: '',
    sub_county: '',
    village: '',
    landmark: '',
    residence_duration: '',
    alternative_phone: '',
  });

  const [employmentInfo, setEmploymentInfo] = useState({
    employment_status: '',
    occupation: '',
    employer_name: '',
    employer_contact: '',
    monthly_income: '',
    secondary_income: '',
    pay_frequency: '',
    work_location: '',
  });

  const [bankingInfo, setBankingInfo] = useState({
    bank_name: '',
    bank_branch: '',
    account_number: '',
    mpesa_number: '',
  });

  const [kinInfo, setKinInfo] = useState({
    kin_name: '',
    kin_relationship: '',
    kin_phone: '',
    kin_id_number: '',
    kin_address: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const fetchedProfile = await dataService.profiles.getProfile(user.id);
        setProfile(fetchedProfile);

        // Initialize form states with profile data
        setPersonalInfo({
          first_name: fetchedProfile?.first_name || '',
          last_name: fetchedProfile?.last_name || '',
          email: fetchedProfile?.email || '',
          phone_number: fetchedProfile?.phone_number || '',
          id_number: fetchedProfile?.id_number || '',
          date_of_birth: fetchedProfile?.date_of_birth || '',
          gender: fetchedProfile?.gender || '',
          marital_status: fetchedProfile?.marital_status || '',
          nationality: fetchedProfile?.nationality || '',
        });

        setContactInfo({
          address: fetchedProfile?.address || '',
          county: fetchedProfile?.county || '',
          sub_county: fetchedProfile?.sub_county || '',
          village: fetchedProfile?.village || '',
          landmark: fetchedProfile?.landmark || '',
          residence_duration: fetchedProfile?.residence_duration || '',
          alternative_phone: fetchedProfile?.alternative_phone || '',
        });

        setEmploymentInfo({
          employment_status: fetchedProfile?.employment_status || '',
          occupation: fetchedProfile?.occupation || '',
          employer_name: fetchedProfile?.employer_name || '',
          employer_contact: fetchedProfile?.employer_contact || '',
          monthly_income: fetchedProfile?.monthly_income?.toString() || '',
          secondary_income: fetchedProfile?.secondary_income?.toString() || '',
          pay_frequency: fetchedProfile?.pay_frequency || '',
          work_location: fetchedProfile?.work_location || '',
        });

        setBankingInfo({
          bank_name: fetchedProfile?.bank_name || '',
          bank_branch: fetchedProfile?.bank_branch || '',
          account_number: fetchedProfile?.account_number || '',
          mpesa_number: fetchedProfile?.mpesa_number || '',
        });

        setKinInfo({
          kin_name: fetchedProfile?.kin_name || '',
          kin_relationship: fetchedProfile?.kin_relationship || '',
          kin_phone: fetchedProfile?.kin_phone || '',
          kin_id_number: fetchedProfile?.kin_id_number || '',
          kin_address: fetchedProfile?.kin_address || '',
        });

      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleEmploymentInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmploymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleBankingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBankingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleKinInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setKinInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!user) return;
      
      await dataService.profiles.updateProfile(user.id, {
        ...personalInfo,
        monthly_income: personalInfo.monthly_income ? Number(personalInfo.monthly_income) : undefined,
      });
      
      toast.success('Personal information updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update personal information');
    } finally {
      setSaving(false);
    }
  };

  const handleContactInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!user) return;
      
      await dataService.profiles.updateProfile(user.id, contactInfo);
      toast.success('Contact information updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update contact information');
    } finally {
      setSaving(false);
    }
  };

  const handleEmploymentInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!user) return;
      
      await dataService.profiles.updateProfile(user.id, {
        ...employmentInfo,
        monthly_income: employmentInfo.monthly_income ? Number(employmentInfo.monthly_income) : undefined,
        secondary_income: employmentInfo.secondary_income ? Number(employmentInfo.secondary_income) : undefined,
      });
      
      toast.success('Employment information updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update employment information');
    } finally {
      setSaving(false);
    }
  };

  const handleBankingInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!user) return;
      
      await dataService.profiles.updateProfile(user.id, bankingInfo);
      toast.success('Banking information updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update banking information');
    } finally {
      setSaving(false);
    }
  };

  const handleKinInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!user) return;
      
      await dataService.profiles.updateProfile(user.id, kinInfo);
      toast.success('Next of Kin information updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update Next of Kin information');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile Management</CardTitle>
            <CardDescription>
              Complete your profile to access all features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="space-y-4">
              <TabsList>
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="contact">Contact Info</TabsTrigger>
                <TabsTrigger value="employment">Employment Info</TabsTrigger>
                <TabsTrigger value="banking">Banking Info</TabsTrigger>
                <TabsTrigger value="kin">Next of Kin Info</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="space-y-2">
                <form onSubmit={handlePersonalInfoSubmit}>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input id="first_name" name="first_name" value={personalInfo.first_name} onChange={handlePersonalInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input id="last_name" name="last_name" value={personalInfo.last_name} onChange={handlePersonalInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={personalInfo.email} onChange={handlePersonalInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="phone_number">Phone Number</Label>
                      <Input id="phone_number" name="phone_number" value={personalInfo.phone_number} onChange={handlePersonalInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="id_number">ID Number</Label>
                      <Input id="id_number" name="id_number" value={personalInfo.id_number} onChange={handlePersonalInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      <Input id="date_of_birth" name="date_of_birth" type="date" value={personalInfo.date_of_birth} onChange={handlePersonalInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select onValueChange={(value) => handlePersonalInfoChange({ target: { name: 'gender', value } } as any)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select gender" defaultValue={personalInfo.gender} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="marital_status">Marital Status</Label>
                      <Select onValueChange={(value) => handlePersonalInfoChange({ target: { name: 'marital_status', value } } as any)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select marital status" defaultValue={personalInfo.marital_status} />
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
                      <Input id="nationality" name="nationality" value={personalInfo.nationality} onChange={handlePersonalInfoChange} />
                    </div>
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Personal Info'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="contact" className="space-y-2">
                <form onSubmit={handleContactInfoSubmit}>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" name="address" value={contactInfo.address} onChange={handleContactInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="county">County</Label>
                      <Input id="county" name="county" value={contactInfo.county} onChange={handleContactInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="sub_county">Sub County</Label>
                      <Input id="sub_county" name="sub_county" value={contactInfo.sub_county} onChange={handleContactInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="village">Village</Label>
                      <Input id="village" name="village" value={contactInfo.village} onChange={handleContactInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input id="landmark" name="landmark" value={contactInfo.landmark} onChange={handleContactInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="residence_duration">Residence Duration</Label>
                      <Input id="residence_duration" name="residence_duration" value={contactInfo.residence_duration} onChange={handleContactInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="alternative_phone">Alternative Phone</Label>
                      <Input id="alternative_phone" name="alternative_phone" value={contactInfo.alternative_phone} onChange={handleContactInfoChange} />
                    </div>
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Contact Info'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="employment" className="space-y-2">
                <form onSubmit={handleEmploymentInfoSubmit}>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="employment_status">Employment Status</Label>
                      <Select onValueChange={(value) => handleEmploymentInfoChange({ target: { name: 'employment_status', value } } as any)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select employment status" defaultValue={employmentInfo.employment_status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="self-employed">Self-Employed</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Input id="occupation" name="occupation" value={employmentInfo.occupation} onChange={handleEmploymentInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="employer_name">Employer Name</Label>
                      <Input id="employer_name" name="employer_name" value={employmentInfo.employer_name} onChange={handleEmploymentInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="employer_contact">Employer Contact</Label>
                      <Input id="employer_contact" name="employer_contact" value={employmentInfo.employer_contact} onChange={handleEmploymentInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="monthly_income">Monthly Income</Label>
                      <Input id="monthly_income" name="monthly_income" value={employmentInfo.monthly_income} onChange={handleEmploymentInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="secondary_income">Secondary Income</Label>
                      <Input id="secondary_income" name="secondary_income" value={employmentInfo.secondary_income} onChange={handleEmploymentInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="pay_frequency">Pay Frequency</Label>
                      <Input id="pay_frequency" name="pay_frequency" value={employmentInfo.pay_frequency} onChange={handleEmploymentInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="work_location">Work Location</Label>
                      <Input id="work_location" name="work_location" value={employmentInfo.work_location} onChange={handleEmploymentInfoChange} />
                    </div>
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Employment Info'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="banking" className="space-y-2">
                <form onSubmit={handleBankingInfoSubmit}>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="bank_name">Bank Name</Label>
                      <Input id="bank_name" name="bank_name" value={bankingInfo.bank_name} onChange={handleBankingInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="bank_branch">Bank Branch</Label>
                      <Input id="bank_branch" name="bank_branch" value={bankingInfo.bank_branch} onChange={handleBankingInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="account_number">Account Number</Label>
                      <Input id="account_number" name="account_number" value={bankingInfo.account_number} onChange={handleBankingInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="mpesa_number">M-Pesa Number</Label>
                      <Input id="mpesa_number" name="mpesa_number" value={bankingInfo.mpesa_number} onChange={handleBankingInfoChange} />
                    </div>
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Banking Info'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="kin" className="space-y-2">
                <form onSubmit={handleKinInfoSubmit}>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="kin_name">Kin Name</Label>
                      <Input id="kin_name" name="kin_name" value={kinInfo.kin_name} onChange={handleKinInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="kin_relationship">Kin Relationship</Label>
                      <Input id="kin_relationship" name="kin_relationship" value={kinInfo.kin_relationship} onChange={handleKinInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="kin_phone">Kin Phone</Label>
                      <Input id="kin_phone" name="kin_phone" value={kinInfo.kin_phone} onChange={handleKinInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="kin_id_number">Kin ID Number</Label>
                      <Input id="kin_id_number" name="kin_id_number" value={kinInfo.kin_id_number} onChange={handleKinInfoChange} />
                    </div>
                    <div>
                      <Label htmlFor="kin_address">Kin Address</Label>
                      <Input id="kin_address" name="kin_address" value={kinInfo.kin_address} onChange={handleKinInfoChange} />
                    </div>
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Kin Info'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="documents" className="space-y-2">
                <div className="grid gap-4 py-4">
                  <div>
                    <Label>ID Document</Label>
                    <FileUpload />
                  </div>
                  <div>
                    <Label>Proof of Income</Label>
                    <FileUpload />
                  </div>
                  <div>
                    <Label>Selfie</Label>
                    <FileUpload />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
