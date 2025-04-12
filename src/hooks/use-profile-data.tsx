
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { dataService } from '@/services/dataService';
import { Profile } from '@/services/mockDataService';

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
        setProfile(profileData);
        
        // Check if all required fields are filled
        const isComplete = requiredFields.every(field => 
          profileData && profileData[field as keyof Profile]
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
      const updatedProfile = await dataService.profiles.updateProfile(user.id, profileData);
      setProfile(prev => ({...prev, ...updatedProfile} as Profile));
      
      // Re-check if profile is complete after update
      const isComplete = requiredFields.every(field => 
        updatedProfile && updatedProfile[field as keyof Profile]
      );
      setProfileComplete(isComplete);
      
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
