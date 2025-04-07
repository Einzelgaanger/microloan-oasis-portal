
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth, ProtectedRoute } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileUpload } from '@/components/ui/file-upload';
import { Loader2, Lock, Mail, Phone, User, CreditCard } from 'lucide-react';
import { PhoneInput } from '@/components/ui/phone-input';

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  city: string;
  zip_code: string;
  avatar_url?: string;
};

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changePassword, setChangePassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
        
      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error(`Error loading profile: ${error.message}`);
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handlePhoneChange = (value: string) => {
    setProfile(prev => prev ? { ...prev, phone_number: value } : null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangePassword(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (file: File | null) => {
    if (!file || !user) return;
    
    try {
      setUpdating(true);
      
      // Upload the avatar to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-avatar.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update the profile with the avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrlData.publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Update local state
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrlData.publicUrl } : null);
      
      toast.success('Profile picture updated successfully');
    } catch (error: any) {
      toast.error(`Error updating profile picture: ${error.message}`);
      console.error('Error updating avatar:', error);
    } finally {
      setUpdating(false);
    }
  };

  const updateProfile = async () => {
    if (!profile || !user) return;
    
    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone_number: profile.phone_number,
          address: profile.address,
          city: profile.city,
          zip_code: profile.zip_code
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(`Error updating profile: ${error.message}`);
      console.error('Update error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const updatePassword = async () => {
    if (!user) return;
    
    try {
      setUpdating(true);
      
      // Validate password match
      if (changePassword.newPassword !== changePassword.confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: changePassword.newPassword
      });
      
      if (error) throw error;
      
      // Clear the form
      setChangePassword({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password updated successfully');
    } catch (error: any) {
      toast.error(`Error updating password: ${error.message}`);
      console.error('Password update error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = () => {
    if (!profile) return 'U';
    return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`;
  };

  if (loading) {
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
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Sidebar */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <Card className="mb-6">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="mb-4 relative">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                      {profile?.avatar_url ? (
                        <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />
                      ) : (
                        <AvatarFallback className="text-xl bg-lending-primary text-white">
                          {getInitials()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <h2 className="text-xl font-bold mb-1">{profile?.first_name} {profile?.last_name}</h2>
                  <p className="text-gray-500 mb-4">{user?.email}</p>
                  <FileUpload 
                    accept="image/*"
                    maxSize={2 * 1024 * 1024} // 2MB
                    onFileSelected={handleAvatarChange}
                    currentFile={null}
                    helperText="Upload a new profile picture (Max 2MB)"
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{profile?.phone_number || 'Not provided'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">First Name</Label>
                          <Input 
                            id="first_name"
                            name="first_name"
                            value={profile?.first_name || ''}
                            onChange={handleProfileChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="last_name">Last Name</Label>
                          <Input 
                            id="last_name"
                            name="last_name"
                            value={profile?.last_name || ''}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <PhoneInput
                          id="phone_number"
                          value={profile?.phone_number || ''}
                          onChange={handlePhoneChange}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address"
                          name="address"
                          value={profile?.address || ''}
                          onChange={handleProfileChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city"
                            name="city"
                            value={profile?.city || ''}
                            onChange={handleProfileChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="zip_code">Zip Code</Label>
                          <Input 
                            id="zip_code"
                            name="zip_code"
                            value={profile?.zip_code || ''}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={updateProfile}
                        disabled={updating}
                        className="bg-lending-primary hover:bg-lending-primary/90"
                      >
                        {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Update your password and security preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input 
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={changePassword.currentPassword}
                            onChange={handlePasswordChange}
                            className="pr-10"
                          />
                          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input 
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={changePassword.newPassword}
                            onChange={handlePasswordChange}
                            className="pr-10"
                          />
                          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input 
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={changePassword.confirmPassword}
                            onChange={handlePasswordChange}
                            className="pr-10"
                          />
                          <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={updatePassword}
                        disabled={updating || !changePassword.currentPassword || !changePassword.newPassword || !changePassword.confirmPassword}
                        className="bg-lending-primary hover:bg-lending-primary/90"
                      >
                        {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="payment">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>
                        Manage your payment methods for loan repayments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                        <div className="text-center">
                          <CreditCard className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          <h3 className="text-lg font-medium mb-1">No payment methods yet</h3>
                          <p className="text-gray-500">Add a payment method to easily repay your loans</p>
                          <Button className="mt-4 bg-lending-primary hover:bg-lending-primary/90">
                            Add Payment Method
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default UserProfile;
