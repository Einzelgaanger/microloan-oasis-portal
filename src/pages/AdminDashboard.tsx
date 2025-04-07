
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { AdminRoute } from '@/lib/auth';
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
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DownloadCloud, 
  Eye, 
  Filter, 
  RefreshCcw, 
  Search, 
  UserCheck 
} from 'lucide-react';

type Loan = {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  purpose: string;
  duration: number;
  interest_rate: number;
  monthly_payment: number;
  created_at: string;
  identification_doc_path: string | null;
  income_doc_path: string | null;
  selfie_path: string | null;
  is_repaid: boolean;
};

type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
};

const AdminDashboard = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("loans");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all loans
      const { data: loansData, error: loansError } = await supabase
        .from('loans')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (loansError) throw loansError;
      setLoans(loansData || []);
      
      // Fetch all users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) throw profilesError;
      setUsers(profilesData || []);
    } catch (error: any) {
      toast.error(`Error loading data: ${error.message}`);
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (status: string | null) => {
    setStatusFilter(status);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getLoanStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return { icon: <CheckCircle className="text-green-500 h-5 w-5" />, color: 'text-green-800 bg-green-100' };
      case 'pending':
        return { icon: <Clock className="text-amber-500 h-5 w-5" />, color: 'text-amber-800 bg-amber-100' };
      case 'rejected':
        return { icon: <AlertTriangle className="text-red-500 h-5 w-5" />, color: 'text-red-800 bg-red-100' };
      default:
        return { icon: null, color: 'text-gray-800 bg-gray-100' };
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return 'Unknown User';
    return `${user.first_name} ${user.last_name}`;
  };

  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.email || 'No email';
  };

  const getUserPhone = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.phone_number || 'No phone';
  };

  const filteredLoans = loans.filter(loan => {
    const searchMatch = searchTerm.trim() === '' || 
      getUserName(loan.user_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserEmail(loan.user_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const statusMatch = statusFilter === null || loan.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  const downloadFile = async (path: string, fileName: string) => {
    if (!path) {
      toast.error('File path not available');
      return;
    }
    
    try {
      const { data, error } = await supabase.storage
        .from('loan-documents')
        .download(path);
        
      if (error) throw error;
      
      // Create a download link and trigger download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully');
    } catch (error: any) {
      toast.error(`Error downloading file: ${error.message}`);
      console.error('Download error:', error);
    }
  };

  const updateLoanStatus = async (loanId: string, status: 'approved' | 'rejected') => {
    try {
      setLoadingAction(true);
      
      const { error } = await supabase
        .from('loans')
        .update({ status })
        .eq('id', loanId);
        
      if (error) throw error;
      
      // Update the local state
      setLoans(loans.map(loan => 
        loan.id === loanId ? { ...loan, status } : loan
      ));
      
      // If we have a selected loan, update it too
      if (selectedLoan && selectedLoan.id === loanId) {
        setSelectedLoan({ ...selectedLoan, status });
      }
      
      toast.success(`Loan ${status.toLowerCase()} successfully`);
    } catch (error: any) {
      toast.error(`Error updating loan status: ${error.message}`);
      console.error('Update error:', error);
    } finally {
      setLoadingAction(false);
    }
  };

  const renderLoanDetails = (loan: Loan) => {
    const userName = getUserName(loan.user_id);
    const userEmail = getUserEmail(loan.user_id);
    const userPhone = getUserPhone(loan.user_id);
    const statusStyle = getLoanStatusStyle(loan.status);
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-1">Loan #{loan.id.slice(-5)}</h2>
            <p className="text-gray-500">Applied on {formatDate(loan.created_at)}</p>
          </div>
          <div className={`px-4 py-2 rounded-full ${statusStyle.color} flex items-center gap-2`}>
            {statusStyle.icon}
            <span className="capitalize font-medium">{loan.status}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Borrower Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="font-medium">{userName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p>{userEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p>{userPhone}</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {/* Implement view full profile */}}
              >
                <UserCheck className="h-4 w-4" /> 
                View Full Profile
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Loan Amount</p>
                <p className="font-bold text-xl">{formatCurrency(loan.amount)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Purpose</p>
                <p className="capitalize">{loan.purpose.replace('_', ' ')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p>{loan.duration} months</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                  <p>{loan.interest_rate}%</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Monthly Payment</p>
                <p className="font-medium text-lending-primary">{formatCurrency(loan.monthly_payment)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Verification Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <p className="font-medium mb-2">Government ID</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {loan.identification_doc_path ? 'Document uploaded' : 'No document'}
                  </p>
                  {loan.identification_doc_path && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadFile(
                          loan.identification_doc_path!, 
                          `ID_${getUserName(loan.user_id).replace(' ', '_')}.pdf`
                        )}
                      >
                        <DownloadCloud className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <p className="font-medium mb-2">Proof of Income</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {loan.income_doc_path ? 'Document uploaded' : 'No document'}
                  </p>
                  {loan.income_doc_path && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadFile(
                          loan.income_doc_path!, 
                          `Income_${getUserName(loan.user_id).replace(' ', '_')}.pdf`
                        )}
                      >
                        <DownloadCloud className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <p className="font-medium mb-2">Selfie Photo</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {loan.selfie_path ? 'Photo uploaded' : 'No photo'}
                  </p>
                  {loan.selfie_path && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadFile(
                          loan.selfie_path!, 
                          `Selfie_${getUserName(loan.user_id).replace(' ', '_')}.jpg`
                        )}
                      >
                        <DownloadCloud className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {loan.status === 'pending' && (
          <div className="flex space-x-4 justify-center pt-4">
            <Button 
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              disabled={loadingAction}
              onClick={() => updateLoanStatus(loan.id, 'approved')}
            >
              <CheckCircle className="h-4 w-4" />
              Approve Loan
            </Button>
            <Button 
              variant="destructive"
              className="flex items-center gap-2"
              disabled={loadingAction}
              onClick={() => updateLoanStatus(loan.id, 'rejected')}
            >
              <AlertTriangle className="h-4 w-4" />
              Reject Loan
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button 
              variant="outline" 
              onClick={fetchData}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" /> Refresh
            </Button>
          </div>
          
          <Tabs defaultValue="loans" className="mb-6" onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="loans">Loan Applications</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>
            
            {/* Loans Tab */}
            <TabsContent value="loans">
              {selectedLoan ? (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedLoan(null)}
                    className="mb-4"
                  >
                    ← Back to Applications
                  </Button>
                  {renderLoanDetails(selectedLoan)}
                </>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search by name or email" 
                        className="pl-10"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Filter:</span>
                      <div className="flex space-x-2">
                        <Button 
                          variant={statusFilter === null ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusFilterChange(null)}
                        >
                          All
                        </Button>
                        <Button 
                          variant={statusFilter === "pending" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusFilterChange("pending")}
                          className={statusFilter === "pending" ? "bg-amber-500 hover:bg-amber-600" : ""}
                        >
                          Pending
                        </Button>
                        <Button 
                          variant={statusFilter === "approved" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusFilterChange("approved")}
                          className={statusFilter === "approved" ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          Approved
                        </Button>
                        <Button 
                          variant={statusFilter === "rejected" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusFilterChange("rejected")}
                          className={statusFilter === "rejected" ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                          Rejected
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lending-primary"></div>
                    </div>
                  ) : filteredLoans.length > 0 ? (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Borrower</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Applied Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredLoans.map((loan) => {
                            const statusStyle = getLoanStatusStyle(loan.status);
                            return (
                              <TableRow key={loan.id} className="hover:bg-muted/50">
                                <TableCell className="font-medium">#{loan.id.slice(-5)}</TableCell>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{getUserName(loan.user_id)}</p>
                                    <p className="text-sm text-gray-500">{getUserEmail(loan.user_id)}</p>
                                  </div>
                                </TableCell>
                                <TableCell>{formatCurrency(loan.amount)}</TableCell>
                                <TableCell>{formatDate(loan.created_at)}</TableCell>
                                <TableCell>
                                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.color}`}>
                                    {statusStyle.icon && <span className="mr-1">{statusStyle.icon}</span>}
                                    <span className="capitalize">{loan.status}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedLoan(loan)}
                                    className="flex items-center gap-1"
                                  >
                                    <Eye className="h-4 w-4" />
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center p-8 border rounded-lg">
                      <p className="text-gray-500">No loan applications found</p>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
            
            {/* Users Tab */}
            <TabsContent value="users">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lending-primary"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.first_name} {user.last_name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone_number}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            {/* Statistics Tab */}
            <TabsContent value="statistics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Loans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {loans.length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All time
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pending Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {loans.filter(loan => loan.status === 'pending').length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Awaiting review
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {users.length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Registered accounts
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Statistics</CardTitle>
                    <CardDescription>
                      Summary of all loans in the system
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Approved Loans</span>
                        <span className="font-medium">{loans.filter(loan => loan.status === 'approved').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Rejected Loans</span>
                        <span className="font-medium">{loans.filter(loan => loan.status === 'rejected').length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Total Amount Loaned</span>
                        <span className="font-medium">
                          {formatCurrency(
                            loans
                              .filter(loan => loan.status === 'approved')
                              .reduce((sum, loan) => sum + loan.amount, 0)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Average Loan Amount</span>
                        <span className="font-medium">
                          {formatCurrency(
                            loans.length > 0 
                              ? loans.reduce((sum, loan) => sum + loan.amount, 0) / loans.length
                              : 0
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest actions and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loans.slice(0, 5).map((loan) => (
                        <div key={loan.id} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <p className="font-medium">
                              Loan #{loan.id.slice(-5)} - {getUserName(loan.user_id)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(loan.created_at)} - {formatCurrency(loan.amount)}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getLoanStatusStyle(loan.status).color}`}>
                            {loan.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Activity
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </AdminRoute>
  );
};

export default AdminDashboard;
