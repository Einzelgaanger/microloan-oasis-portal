import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, Users, DollarSign, FileText, Search, Eye } from 'lucide-react';
import { useAuth, AdminRoute } from '@/lib/auth';
import { dataService } from '@/services/dataService';
import { toast } from 'sonner';
import MainLayout from '@/components/layout/MainLayout';
import { Loan, Profile } from '@/types/loan';

interface LoanStats {
  totalLoans: number;
  approvedLoans: number;
  pendingLoans: number;
  rejectedLoans: number;
  totalDisbursed: number;
}

const AdminDashboard = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loanStats, setLoanStats] = useState<LoanStats>({
    totalLoans: 0,
    approvedLoans: 0,
    pendingLoans: 0,
    rejectedLoans: 0,
    totalDisbursed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const loansData = await dataService.loans.getAllLoans();
        const usersData = await dataService.profiles.getAllProfiles();

        setLoans(loansData || []);
        setUsers(usersData || []);

        // Calculate loan statistics
        const approvedLoans = loansData ? loansData.filter(loan => loan.status === 'approved').length : 0;
        const pendingLoans = loansData ? loansData.filter(loan => loan.status === 'pending').length : 0;
        const rejectedLoans = loansData ? loansData.filter(loan => loan.status === 'rejected').length : 0;
        const totalDisbursed = loansData ? loansData.filter(loan => loan.status === 'approved').reduce((sum, loan) => sum + loan.amount, 0) : 0;

        setLoanStats({
          totalLoans: loansData ? loansData.length : 0,
          approvedLoans,
          pendingLoans,
          rejectedLoans,
          totalDisbursed,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateLoanStatus = async (loanId: string, newStatus: string, rejectedReason?: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'approved') {
        updateData.approved_at = new Date().toISOString();
      } else if (newStatus === 'rejected' && rejectedReason) {
        updateData.rejected_at = new Date().toISOString();
        updateData.rejected_reason = rejectedReason; // Keep as string, not array
      }

      const updatedLoan = await dataService.loans.updateLoanStatus(loanId, updateData);
      
      if (updatedLoan) {
        setLoans(prev => prev.map(loan => 
          loan.id === loanId ? { ...loan, ...updateData } : loan
        ));
        toast.success(`Loan ${newStatus} successfully`);
        setSelectedLoan(null);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${newStatus} loan`);
    }
  };

  const handleRejectLoan = async (loanId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      await updateLoanStatus(loanId, 'rejected', reason);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${loan.user_id}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage loans, users, and track payments.</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loanStats.totalLoans}</div>
                <p className="text-sm text-muted-foreground">All loan applications</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Approved Loans</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loanStats.approvedLoans}</div>
                <p className="text-sm text-muted-foreground">Loans successfully approved</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(loanStats.totalDisbursed)}</div>
                <p className="text-sm text-muted-foreground">Total amount disbursed</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="loans" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="loans">Loan Management</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="payments">Payment Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="loans" className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Search className="w-5 h-5 mr-2 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search by Loan ID or User ID"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="max-w-md"
                  />
                </div>
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4">
                {filteredLoans.map(loan => (
                  <Card key={loan.id} className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <CardTitle>Loan #{loan.id.slice(-5)}</CardTitle>
                      <Badge variant="secondary">{loan.status}</Badge>
                    </div>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">User ID</p>
                        <p>{loan.user_id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Amount</p>
                        <p>{formatCurrency(loan.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Purpose</p>
                        <p>{loan.purpose}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Duration</p>
                        <p>{loan.duration} months</p>
                      </div>
                    </CardContent>
                    
                    {selectedLoan?.id === loan.id && loan.rejected_reason && (
                      <div className="mt-4 p-4 bg-red-50 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2">Rejection Reason:</h4>
                        <p className="text-red-700">{loan.rejected_reason}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-end gap-2 mt-4">
                      {loan.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => updateLoanStatus(loan.id, 'approved')}
                            className="bg-green-500 hover:bg-green-700 text-white"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleRejectLoan(loan.id)}
                            className="bg-red-500 hover:bg-red-700 text-white"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost">
                            View Details <Eye className="ml-2" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Loan Details</DialogTitle>
                            <DialogDescription>
                              Detailed information about Loan #{loan.id.slice(-5)}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="loanId" className="text-right">
                                Loan ID
                              </label>
                              <Input type="text" id="loanId" value={loan.id} readOnly className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="userId" className="text-right">
                                User ID
                              </label>
                              <Input type="text" id="userId" value={loan.user_id} readOnly className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="amount" className="text-right">
                                Amount
                              </label>
                              <Input type="text" id="amount" value={formatCurrency(loan.amount)} readOnly className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="purpose" className="text-right">
                                Purpose
                              </label>
                              <Input type="text" id="purpose" value={loan.purpose} readOnly className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="duration" className="text-right">
                                Duration
                              </label>
                              <Input type="text" id="duration" value={`${loan.duration} months`} readOnly className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label htmlFor="status" className="text-right">
                                Status
                              </label>
                              <Input type="text" id="status" value={loan.status} readOnly className="col-span-3" />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div>
                <h2 className="text-2xl font-bold mb-4">User Management</h2>
                <p>Manage user accounts and roles.</p>
                {/* Implement user management features here */}
              </div>
            </TabsContent>

            <TabsContent value="payments">
              <div>
                <h2 className="text-2xl font-bold mb-4">Payment Tracking</h2>
                <p>Track loan payments and manage transactions.</p>
                {/* Implement payment tracking features here */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </AdminRoute>
  );
};

export default AdminDashboard;
