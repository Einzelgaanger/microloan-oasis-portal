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

const UserProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  const [formState, setFormState] = useState({
    avatar_url: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    city: '',
    zip_code: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const profileData = await dataService.profiles.getProfile(user.id);
        
        if (profileData) {
          setProfile(profileData);
          setFormState({
            avatar_url: profileData.avatar_url || '',
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            phone_number: profileData.phone_number || '',
            address: profileData.address || '',
            city: profileData.city || '',
            zip_code: profileData.zip_code || ''
          });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePhoneChange = (value: string) => {
    setFormState(prev => ({ ...prev, phone_number: value }));
  };
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    try {
      // For the mock implementation, we'll just use a fake URL
      // In a real app, this would upload to storage
      const fakeUrl = URL.createObjectURL(e.target.files[0]);
      
      setFormState(prev => ({ ...prev, avatar_url: fakeUrl }));
      
      if (user) {
        await dataService.profiles.updateProfile(user.id, {
          avatar_url: fakeUrl
        });
        
        toast.success('Profile picture updated');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update profile picture');
    }
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      await dataService.profiles.updateProfile(user.id, {
        first_name: formState.first_name,
        last_name: formState.last_name,
        phone_number: formState.phone_number,
        address: formState.address,
        city: formState.city,
        zip_code: formState.zip_code
      });
      
      toast.success('Profile updated successfully');
      
      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...formState } : null);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    if (!formState.first_name || !formState.last_name) return 'U';
    return `${formState.first_name[0]}${formState.last_name[0]}`.toUpperCase();
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
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="profile">
                    <FileText className="mr-2 h-4 w-4" />
                    Profile Information
                  </TabsTrigger>
                  <TabsTrigger value="security">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Security
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="space-y-4">
                  <div className="grid gap-4">
                    {/* Avatar Section */}
                    <div>
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          {formState.avatar_url ? (
                            <AvatarImage src={formState.avatar_url} alt="Avatar" />
                          ) : (
                            <AvatarFallback className="bg-lending-primary text-white">
                              {getInitials()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {formState.first_name} {formState.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user?.email}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              id="avatar-upload"
                              className="hidden"
                              onChange={handleAvatarUpload}
                            />
                            <Label
                              htmlFor="avatar-upload"
                              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary hover:bg-secondary bg-muted text-muted-foreground hover:text-muted-foreground h-9 px-4 py-2"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Avatar
                            </Label>
                            {formState.avatar_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setFormState(prev => ({ ...prev, avatar_url: '' }))}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          type="text"
                          id="firstName"
                          name="first_name"
                          value={formState.first_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          type="text"
                          id="lastName"
                          name="last_name"
                          value={formState.last_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <PhoneInput
                          id="phoneNumber"
                          value={formState.phone_number}
                          onChange={handlePhoneChange}
                          placeholder="+1 555 123 4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          type="text"
                          id="address"
                          name="address"
                          value={formState.address}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          type="text"
                          id="city"
                          name="city"
                          value={formState.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          type="text"
                          id="zipCode"
                          name="zip_code"
                          value={formState.zip_code}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    className="bg-lending-primary hover:bg-lending-primary/90"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        Saving...
                      </>
                    ) : (
                      <>
                        Save Profile
                        <Check className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </TabsContent>
                <TabsContent value="security">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="password">Change Password</Label>
                      <Input
                        type="password"
                        id="password"
                        placeholder="Enter new password"
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm new password"
                        disabled
                      />
                    </div>
                    <Button disabled>Update Password</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default UserProfile;
