
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, Clock, Users, DollarSign, FileText, Search, Eye, CreditCard, AlertCircle, Phone, MapPin, Briefcase } from 'lucide-react';
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
  disbursedLoans: number;
  totalDisbursed: number;
  pendingDisbursement: number;
}

const AdminDashboard = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loanStats, setLoanStats] = useState<LoanStats>({
    totalLoans: 0,
    approvedLoans: 0,
    pendingLoans: 0,
    rejectedLoans: 0,
    disbursedLoans: 0,
    totalDisbursed: 0,
    pendingDisbursement: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Profile | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const loansData = await dataService.loans.getAllLoans();
        const usersData: Profile[] = [];

        setLoans(loansData || []);
        setUsers(usersData || []);

        // Calculate loan statistics
        const approvedLoans = loansData ? loansData.filter(loan => loan.status === 'approved').length : 0;
        const pendingLoans = loansData ? loansData.filter(loan => loan.status === 'pending').length : 0;
        const rejectedLoans = loansData ? loansData.filter(loan => loan.status === 'rejected').length : 0;
        const disbursedLoans = loansData ? loansData.filter(loan => loan.status === 'disbursed').length : 0;
        const totalDisbursed = loansData ? loansData.filter(loan => loan.status === 'disbursed').reduce((sum, loan) => sum + loan.amount, 0) : 0;
        const pendingDisbursement = loansData ? loansData.filter(loan => loan.status === 'approved').reduce((sum, loan) => sum + loan.amount, 0) : 0;

        setLoanStats({
          totalLoans: loansData ? loansData.length : 0,
          approvedLoans,
          pendingLoans,
          rejectedLoans,
          disbursedLoans,
          totalDisbursed,
          pendingDisbursement,
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
        updateData.rejected_reason = rejectedReason;
      } else if (newStatus === 'disbursed') {
        updateData.disbursed_at = new Date().toISOString();
      }

      const updatedLoan = await dataService.loans.updateLoan(loanId, updateData);
      
      if (updatedLoan) {
        setLoans(prev => prev.map(loan => 
          loan.id === loanId ? { ...loan, ...updateData } : loan
        ));
        
        // Update stats
        const updatedLoans = loans.map(loan => 
          loan.id === loanId ? { ...loan, ...updateData } : loan
        );
        updateStats(updatedLoans);
        
        toast.success(`Loan ${newStatus} successfully`);
        setSelectedLoan(null);
      }
    } catch (error: any) {
      toast.error(error.message || `Failed to ${newStatus} loan`);
    }
  };

  const updateStats = (loansData: Loan[]) => {
    const approvedLoans = loansData.filter(loan => loan.status === 'approved').length;
    const pendingLoans = loansData.filter(loan => loan.status === 'pending').length;
    const rejectedLoans = loansData.filter(loan => loan.status === 'rejected').length;
    const disbursedLoans = loansData.filter(loan => loan.status === 'disbursed').length;
    const totalDisbursed = loansData.filter(loan => loan.status === 'disbursed').reduce((sum, loan) => sum + loan.amount, 0);
    const pendingDisbursement = loansData.filter(loan => loan.status === 'approved').reduce((sum, loan) => sum + loan.amount, 0);

    setLoanStats({
      totalLoans: loansData.length,
      approvedLoans,
      pendingLoans,
      rejectedLoans,
      disbursedLoans,
      totalDisbursed,
      pendingDisbursement,
    });
  };

  const handleRejectLoan = async (loanId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      await updateLoanStatus(loanId, 'rejected', reason);
    }
  };

  const handleDisburseLoan = async (loanId: string) => {
    const confirmed = confirm('Are you sure you want to disburse this loan? This action cannot be undone.');
    if (confirmed) {
      await updateLoanStatus(loanId, 'disbursed');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'disbursed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'disbursed': return <CreditCard className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${loan.user_id}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.phone_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage loans, approve disbursements, and review applicant information.</p>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loanStats.totalLoans}</div>
                <p className="text-sm text-muted-foreground">All loan applications</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{loanStats.pendingLoans}</div>
                <p className="text-sm text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Disbursement</CardTitle>
                <CreditCard className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{loanStats.approvedLoans}</div>
                <div className="text-sm font-medium">{formatCurrency(loanStats.pendingDisbursement)}</div>
                <p className="text-sm text-muted-foreground">Ready to disburse</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{loanStats.disbursedLoans}</div>
                <div className="text-sm font-medium">{formatCurrency(loanStats.totalDisbursed)}</div>
                <p className="text-sm text-muted-foreground">Successfully disbursed</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="loans" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="loans">Loan Management</TabsTrigger>
              <TabsTrigger value="disbursement">Disbursement Queue</TabsTrigger>
              <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="loans" className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Search by Loan ID, User ID, or Phone"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 max-w-md"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="disbursed">Disbursed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loan ID</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Applied</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLoans.map(loan => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">#{loan.id.slice(-8)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">User #{loan.user_id.slice(-8)}</div>
                            <div className="text-sm text-gray-500">{loan.phone_number}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(loan.amount)}</TableCell>
                        <TableCell>{loan.purpose}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(loan.status)} flex items-center gap-1`}>
                            {getStatusIcon(loan.status)}
                            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(loan.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Loan Application Details</DialogTitle>
                                  <DialogDescription>
                                    Complete information for Loan #{loan.id.slice(-8)}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                  {/* Loan Information */}
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-lg">Loan Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Amount Requested</label>
                                        <p className="font-medium">{formatCurrency(loan.amount)}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Purpose</label>
                                        <p className="font-medium">{loan.purpose}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Duration</label>
                                        <p className="font-medium">{loan.duration} months</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Monthly Payment</label>
                                        <p className="font-medium">{formatCurrency(loan.monthly_payment)}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Total Amount</label>
                                        <p className="font-medium">{formatCurrency(loan.total_amount)}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Interest Rate</label>
                                        <p className="font-medium">{loan.interest_rate}%</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Applicant Information */}
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-lg flex items-center gap-2">
                                      <Users className="h-5 w-5" />
                                      Applicant Information
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                        <p className="font-medium flex items-center gap-2">
                                          <Phone className="h-4 w-4" />
                                          {loan.phone_number}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">M-Pesa Number</label>
                                        <p className="font-medium">{loan.mpesa_number}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">County</label>
                                        <p className="font-medium flex items-center gap-2">
                                          <MapPin className="h-4 w-4" />
                                          {loan.county}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Employment Status</label>
                                        <p className="font-medium flex items-center gap-2">
                                          <Briefcase className="h-4 w-4" />
                                          {loan.employment_status}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Employer</label>
                                        <p className="font-medium">{loan.employer_name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Monthly Income</label>
                                        <p className="font-medium">{formatCurrency(loan.monthly_income)}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Next of Kin Information */}
                                  <div className="space-y-4">
                                    <h4 className="font-semibold text-lg">Next of Kin</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Name</label>
                                        <p className="font-medium">{loan.kin_name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Phone</label>
                                        <p className="font-medium">{loan.kin_phone}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-500">Relationship</label>
                                        <p className="font-medium">{loan.kin_relationship}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {loan.rejected_reason && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                      <h4 className="font-medium text-red-800 mb-2">Rejection Reason:</h4>
                                      <p className="text-red-700">{loan.rejected_reason}</p>
                                    </div>
                                  )}

                                  {/* Action Buttons */}
                                  {loan.status === 'pending' && (
                                    <div className="flex justify-end gap-2 pt-4 border-t">
                                      <Button
                                        onClick={() => updateLoanStatus(loan.id, 'approved')}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Approve Loan
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleRejectLoan(loan.id)}
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Reject Loan
                                      </Button>
                                    </div>
                                  )}

                                  {loan.status === 'approved' && (
                                    <div className="flex justify-end gap-2 pt-4 border-t">
                                      <Button
                                        onClick={() => handleDisburseLoan(loan.id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                      >
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Disburse Loan
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>

                            {loan.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateLoanStatus(loan.id, 'approved')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectLoan(loan.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}

                            {loan.status === 'approved' && (
                              <Button
                                size="sm"
                                onClick={() => handleDisburseLoan(loan.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="disbursement" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Disbursement Queue</h2>
                <p className="text-gray-600">Approved loans ready for disbursement</p>
                
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loan ID</TableHead>
                        <TableHead>Applicant</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>M-Pesa Number</TableHead>
                        <TableHead>Approved Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loans.filter(loan => loan.status === 'approved').map(loan => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium">#{loan.id.slice(-8)}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">User #{loan.user_id.slice(-8)}</div>
                              <div className="text-sm text-gray-500">{loan.phone_number}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-green-600">{formatCurrency(loan.amount)}</TableCell>
                          <TableCell className="font-medium">{loan.mpesa_number}</TableCell>
                          <TableCell>{loan.approved_at ? new Date(loan.approved_at).toLocaleDateString() : 'N/A'}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleDisburseLoan(loan.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              Disburse Now
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div>
                <h2 className="text-2xl font-bold mb-4">Reports & Analytics</h2>
                <p className="text-gray-600 mb-6">System performance and loan statistics</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Loan Status Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Pending Applications:</span>
                          <span className="font-medium">{loanStats.pendingLoans}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Approved Loans:</span>
                          <span className="font-medium text-green-600">{loanStats.approvedLoans}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Disbursed Loans:</span>
                          <span className="font-medium text-blue-600">{loanStats.disbursedLoans}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rejected Applications:</span>
                          <span className="font-medium text-red-600">{loanStats.rejectedLoans}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Disbursed:</span>
                          <span className="font-medium text-blue-600">{formatCurrency(loanStats.totalDisbursed)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pending Disbursement:</span>
                          <span className="font-medium text-green-600">{formatCurrency(loanStats.pendingDisbursement)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Loan Amount:</span>
                          <span className="font-medium">
                            {loanStats.totalLoans > 0 
                              ? formatCurrency((loanStats.totalDisbursed + loanStats.pendingDisbursement) / loanStats.totalLoans)
                              : formatCurrency(0)
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </AdminRoute>
  );
};

export default AdminDashboard;
