
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, CheckCircle, Clock, FileText, CreditCard, CalendarRange, ChevronRight } from 'lucide-react';
import { ProtectedRoute } from '@/lib/auth';

const Dashboard = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        setProfile(profileData);
        
        // Fetch user loans
        const { data: loansData, error: loansError } = await supabase
          .from('loans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (loansError) throw loansError;
        setLoans(loansData || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const getLoanStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return { icon: <CheckCircle className="text-green-500 h-5 w-5" />, color: 'bg-green-100 text-green-800' };
      case 'pending':
        return { icon: <Clock className="text-amber-500 h-5 w-5" />, color: 'bg-amber-100 text-amber-800' };
      case 'rejected':
        return { icon: <AlertTriangle className="text-red-500 h-5 w-5" />, color: 'bg-red-100 text-red-800' };
      default:
        return { icon: <FileText className="text-blue-500 h-5 w-5" />, color: 'bg-blue-100 text-blue-800' };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.first_name || 'User'}!</h1>
            <p className="text-gray-600">Manage your loans and applications in one place.</p>
          </div>

          {/* Action Button */}
          <div className="mb-8">
            <Link to="/apply">
              <Button size="lg" className="bg-lending-primary hover:bg-lending-primary/90">
                Apply for a New Loan
              </Button>
            </Link>
          </div>

          {/* Loan Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Loans
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loans.filter(loan => loan.status === 'approved' && !loan.is_repaid).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Loaned
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(loans.filter(loan => loan.status === 'approved').reduce((acc, loan) => acc + (loan.amount || 0), 0))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Next Payment
                </CardTitle>
                <CalendarRange className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loans.some(loan => loan.status === 'approved' && !loan.is_repaid) 
                    ? new Date().toLocaleDateString() 
                    : 'No payments due'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Loans */}
          <h2 className="text-2xl font-bold mb-4">Your Loans</h2>
          
          {loans.length > 0 ? (
            <div className="grid gap-6">
              {loans.map(loan => {
                const statusStyle = getLoanStatusStyle(loan.status);
                
                return (
                  <Card key={loan.id} className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/40">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Loan #{loan.id.slice(-5)}</CardTitle>
                          <CardDescription>Applied on {new Date(loan.created_at).toLocaleDateString()}</CardDescription>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${statusStyle.color}`}>
                          {statusStyle.icon}
                          <span className="capitalize">{loan.status}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Loan Amount</p>
                          <p className="text-xl font-bold">{formatCurrency(loan.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Purpose</p>
                          <p className="text-lg">{loan.purpose}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Duration</p>
                          <p className="text-lg">{loan.duration} months</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                          <p className="text-lg">{loan.interest_rate}%</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/40 border-t flex justify-between">
                      <p className="text-sm text-gray-500">
                        {loan.status === 'approved' 
                          ? loan.is_repaid 
                            ? 'Fully repaid'
                            : `Next payment: ${formatCurrency(loan.monthly_payment)} due on ${new Date().toLocaleDateString()}`
                          : loan.status === 'pending'
                            ? 'Your application is being reviewed'
                            : 'Application closed'
                        }
                      </p>
                      <Button variant="ghost" size="sm" className="text-lending-primary hover:bg-lending-primary/10 hover:text-lending-primary">
                        View Details <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center p-8">
              <CardContent className="pt-6 px-8 flex flex-col items-center">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Loan Applications</h3>
                <p className="text-gray-500 mb-4">You haven't applied for any loans yet.</p>
                <Link to="/apply">
                  <Button className="bg-lending-primary hover:bg-lending-primary/90">
                    Apply for a Loan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;
