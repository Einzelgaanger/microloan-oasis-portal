
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { ProtectedRoute } from '@/lib/auth';
import MainLayout from '@/components/layout/MainLayout';
import { dataService } from '@/services/dataService';

const kycSchema = z.object({
  nationalIdNumber: z.string().min(1, { message: "National ID number is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(1, { message: "ZIP code is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  employmentStatus: z.enum(['employed', 'self-employed', 'unemployed', 'student', 'retired']),
  employerName: z.string().optional(),
  monthlyIncome: z.string().min(1, { message: "Monthly income is required" }),
  purposeOfLoan: z.string().min(1, { message: "Purpose of loan is required" }),
});

type KYCFormValues = z.infer<typeof kycSchema>;

const KYC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<KYCFormValues>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      nationalIdNumber: '',
      dateOfBirth: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: '',
      employmentStatus: 'employed',
      employerName: '',
      monthlyIncome: '',
      purposeOfLoan: '',
    },
  });
  
  const onSubmit = async (data: KYCFormValues) => {
    if (!user) {
      toast.error('You must be logged in to submit KYC information');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Update user profile with KYC information
      await dataService.profiles.updateProfile(user.id, {
        id_number: data.nationalIdNumber,
        date_of_birth: data.dateOfBirth,
        phone_number: data.phoneNumber,
        employment_status: data.employmentStatus,
        employer_name: data.employerName || '',
        monthly_income: data.monthlyIncome,
        county: data.city,
        nationality: data.state,
      });
      
      toast.success('KYC information submitted successfully');
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('KYC submission error:', error);
      toast.error(error.message || 'Failed to submit KYC information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Identity Verification</h1>
            <p className="text-gray-600">Please provide your personal information for verification</p>
          </div>
          
          <Card className="shadow-md">
            <CardHeader className="bg-gold-50">
              <CardTitle>KYC Information</CardTitle>
              <CardDescription>
                We need this information to verify your identity and comply with regulations.
                All information is securely stored and protected.
              </CardDescription>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nationalIdNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>National ID Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your national ID number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter your full address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input placeholder="State/Province" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="ZIP Code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="text-lg font-medium">Financial Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="employmentStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select employment status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="employed">Employed</SelectItem>
                              <SelectItem value="self-employed">Self-Employed</SelectItem>
                              <SelectItem value="unemployed">Unemployed</SelectItem>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="retired">Retired</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {(form.watch('employmentStatus') === 'employed' || form.watch('employmentStatus') === 'self-employed') && (
                      <FormField
                        control={form.control}
                        name="employerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {form.watch('employmentStatus') === 'self-employed' ? 'Business Name' : 'Employer Name'}
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="monthlyIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Income (USD)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              {...field} 
                              onChange={(e) => {
                                const value = e.target.value;
                                if (!value || parseFloat(value) >= 0) {
                                  field.onChange(value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Please provide your average monthly income
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="purposeOfLoan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purpose of Loan</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe what you plan to use the loan for" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Document Upload Section - In a real app, this would include file upload components */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="text-lg font-medium">Document Upload</h3>
                    <p className="text-sm text-gray-500">
                      Please upload clear photos or scans of the following documents:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">ID Document</h4>
                        <p className="text-sm text-gray-500 mb-2">
                          Upload your national ID, passport, or driver's license
                        </p>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                          <p className="text-sm text-gray-500">
                            Click to upload or drag and drop
                          </p>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <h4 className="font-medium mb-2">Proof of Income</h4>
                        <p className="text-sm text-gray-500 mb-2">
                          Upload a recent pay stub, bank statement, or tax return
                        </p>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                          <p className="text-sm text-gray-500">
                            Click to upload or drag and drop
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Note: In a real application, we would implement secure file upload functionality. 
                      For this demo, we're just showing the UI without actual file uploads.
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="border-t bg-gray-50 flex flex-col">
                  <p className="text-sm text-gray-500 mb-4">
                    By submitting this form, you confirm that all information provided is accurate
                    and you consent to our verification process.
                  </p>
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto bg-gradient-to-r from-gold-600 to-gold-500 text-black hover:from-gold-700 hover:to-gold-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Information'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default KYC;
