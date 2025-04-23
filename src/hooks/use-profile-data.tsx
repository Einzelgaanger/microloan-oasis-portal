
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { dataService } from '@/services/dataService';

// Updated Profile interface with all necessary fields
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  username?: string;
  created_at: string;
  updated_at?: string;
  id_number?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  nationality?: string;
  phone_number?: string;
  alternative_phone?: string;
  address?: string;
  county?: string;
  sub_county?: string;
  village?: string;
  landmark?: string;
  residence_duration?: string;
  employment_status?: string;
  occupation?: string;
  employer_name?: string;
  employer_contact?: string;
  monthly_income?: number;
  secondary_income?: number;
  pay_frequency?: string;
  work_location?: string;
  bank_name?: string;
  bank_branch?: string;
  account_number?: string;
  mpesa_number?: string;
  kin_name?: string;
  kin_relationship?: string;
  kin_phone?: string;
  kin_id_number?: string;
  kin_address?: string;
  id_document_url?: string;
  selfie_url?: string;
  payslip_url?: string;
  statement_url?: string;
}

// This hook helps share data between LoanApplication and UserProfile
export const useProfileData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileComplete, setProfileComplete] = useState(false);
  
  // Required fields for loan application
  const requiredFields = [
    'first_name',
    'last_name', 
    'id_number',
    'phone_number',
    'address',
    'county',
    'employment_status',
    'monthly_income',
    'mpesa_number',
    'kin_name',
    'kin_phone',
    'kin_relationship'
  ];

  useEffect(() => {
    // Fetch user profile
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const profileData = await dataService.profiles.getProfile(user.id);
        
        // Make sure profileData has all required fields with defaults
        const safeProfile: Profile = {
          id: profileData?.id || user.id,
          first_name: profileData?.first_name || '',
          last_name: profileData?.last_name || '',
          created_at: profileData?.created_at || new Date().toISOString(),
        };
        
        // Set the profile with all the fields from profileData
        setProfile(profileData ? { ...safeProfile, ...profileData } : safeProfile);
        
        // Check if all required fields are filled
        const isComplete = requiredFields.every(field => 
          profileData && profileData[field as keyof typeof profileData]
        );
        setProfileComplete(isComplete);
        
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  // Update profile with new data
  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) return false;
    
    try {
      // Ensure monthly_income is a number if provided
      if (profileData.monthly_income !== undefined && typeof profileData.monthly_income === 'string') {
        profileData.monthly_income = parseFloat(profileData.monthly_income as unknown as string);
      }
      
      const updatedProfile = await dataService.profiles.updateProfile(user.id, profileData);
      
      if (updatedProfile) {
        // Ensure created_at exists
        const safeUpdatedProfile = {
          ...updatedProfile,
          created_at: updatedProfile.created_at || new Date().toISOString()
        } as Profile;
        
        // Update the profile state with all fields merged
        setProfile(prev => (prev ? { ...prev, ...safeUpdatedProfile } : safeUpdatedProfile));
        
        // Re-check if profile is complete after update
        const isComplete = requiredFields.every(field => 
          safeUpdatedProfile[field as keyof Profile]
        );
        setProfileComplete(isComplete);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };
  
  return {
    profile,
    loading,
    profileComplete,
    updateProfile
  };
};
