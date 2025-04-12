
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/lib/auth';
import { AdminRoute } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle, Clock, Download, Eye, FileText, Search, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { toast } from 'sonner';
import { dataService } from '@/services/dataService';
import { Loan } from '@/services/mockDataService';

const AdminDashboard = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingLoanId, setProcessingLoanId] = useState<string | null>(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { user } = useAuth();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const loansData = await dataService.loans.getAllLoans();
        setLoans(loansData);
        setFilteredLoans(loansData);
      } catch (error) {
        console.error('Error fetching loans:', error);
        toast.error('Failed to load loans data');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  useEffect(() => {
    // Filter loans based on search query and active tab
    let filtered = [...loans];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(loan => 
        loan.purpose.toLowerCase().includes(query) || 
        loan.id.toLowerCase().includes(query) ||
        loan.employment_status.toLowerCase().includes(query)
      );
    }
    
    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(loan => loan.status === activeTab);
    }
    
    setFilteredLoans(filtered);
  }, [searchQuery, loans, activeTab]);

  const handleApproveLoan = async (loanId: string) => {
    if (selectedLoan) {
      try {
        setProcessingLoanId(loanId);
        
        await dataService.loans.updateLoan(loanId, {
          status: 'approved',
          approved_at: new Date().toISOString()
        });
        
        // Update local state - ensure we maintain the correct typing
        setLoans(prevLoans => prevLoans.map(loan => 
          loan.id === loanId 
            ? { ...loan, status: 'approved', approved_at: new Date().toISOString() }
            : loan
        ));
        
        setFilteredLoans(prevFiltered => prevFiltered.map(loan => 
          loan.id === loanId 
            ? { ...loan, status: 'approved', approved_at: new Date().toISOString() }
            : loan
        ));
        
        if (selectedLoan?.id === loanId) {
          setSelectedLoan({ ...selectedLoan, status: 'approved', approved_at: new Date().toISOString() });
        }
        
        toast.success('Loan approved successfully');
      } catch (error) {
        console.error('Error approving loan:', error);
        toast.error('Failed to approve loan');
      } finally {
        setProcessingLoanId(null);
      }
    }
  };
  
  const handleRejectLoan = async (loanId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    try {
      setProcessingLoanId(loanId);
      
      await dataService.loans.updateLoan(loanId, {
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejected_reason: rejectionReason
      });
      
      // Update local state with proper typing
      setLoans(prevLoans => prevLoans.map(loan => 
        loan.id === loanId 
          ? { 
              ...loan, 
              status: 'rejected', 
              rejected_at: new Date().toISOString(),
              rejected_reason: rejectionReason
            }
          : loan
      ));
      
      setFilteredLoans(prevFiltered => prevFiltered.map(loan => 
        loan.id === loanId 
          ? { 
              ...loan, 
              status: 'rejected', 
              rejected_at: new Date().toISOString(),
              rejected_reason: rejectionReason
            }
          : loan
      ));
      
      if (selectedLoan?.id === loanId) {
        setSelectedLoan({ 
          ...selectedLoan, 
          status: 'rejected', 
          rejected_at: new Date().toISOString(),
          rejected_reason: rejectionReason
        });
      }
      
      setRejectionReason('');
      toast.success('Loan rejected successfully');
    } catch (error) {
      console.error('Error rejecting loan:', error);
      toast.error('Failed to reject loan');
    } finally {
      setProcessingLoanId(null);
    }
  };

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
    <AdminRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage loan applications and user accounts.</p>
            </div>
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                placeholder="Search loans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="md:w-64"
              />
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Loan Application Tabs */}
          <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Applications</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Loan Applications List */}
          <div className="grid grid-cols-1 gap-6">
            {filteredLoans.length > 0 ? (
              filteredLoans.map(loan => {
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
                          <p className="text-sm font-medium text-gray-500">Applicant</p>
                          <p className="text-lg">User #{loan.user_id.slice(-5)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Employment Status</p>
                          <p className="text-lg">{loan.employment_status}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/40 border-t flex justify-between items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-lending-primary hover:bg-lending-primary/10 hover:text-lending-primary"
                        onClick={() => {
                          setSelectedLoan(loan);
                          setViewingDetails(true);
                        }}
                      >
                        View Details <Eye className="ml-1 h-4 w-4" />
                      </Button>
                      {loan.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={processingLoanId === loan.id}
                            onClick={() => handleApproveLoan(loan.id)}
                          >
                            {processingLoanId === loan.id ? (
                              <>Approving...</>
                            ) : (
                              <>
                                Approve <ThumbsUp className="ml-1 h-4 w-4" />
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={processingLoanId === loan.id}
                            onClick={() => {
                              setSelectedLoan(loan);
                              setViewingDetails(true);
                            }}
                          >
                            {processingLoanId === loan.id ? (
                              <>Rejecting...</>
                            ) : (
                              <>
                                Reject <ThumbsDown className="ml-1 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <Card className="text-center p-8">
                <CardContent className="pt-6 px-8 flex flex-col items-center">
                  <FileText className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Loan Applications Found</h3>
                  <p className="text-gray-500 mb-4">There are no loan applications matching your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Loan Details Modal */}
          {viewingDetails && selectedLoan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>Loan Details #{selectedLoan.id.slice(-5)}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setViewingDetails(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Loan Amount</p>
                    <p className="text-xl font-bold">{formatCurrency(selectedLoan.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Purpose</p>
                    <p className="text-lg">{selectedLoan.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p className="text-lg">{selectedLoan.duration} months</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                    <p className="text-lg">{selectedLoan.interest_rate}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Payment</p>
                    <p className="text-lg">{formatCurrency(selectedLoan.monthly_payment)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employment Status</p>
                    <p className="text-lg">{selectedLoan.employment_status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employer Name</p>
                    <p className="text-lg">{selectedLoan.employer_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Income</p>
                    <p className="text-lg">{formatCurrency(selectedLoan.monthly_income)}</p>
                  </div>
                  
                  {/* Additional Documents */}
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500 mb-2">KYC Documents</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border p-3 rounded-md">
                        <p className="font-medium mb-1">ID Document</p>
                        <a href={selectedLoan.id_document_url} target="_blank" rel="noopener noreferrer" className="text-lending-primary hover:underline flex items-center">
                          <FileText className="h-4 w-4 mr-1" /> View Document
                        </a>
                      </div>
                      <div className="border p-3 rounded-md">
                        <p className="font-medium mb-1">Proof of Income</p>
                        <a href={selectedLoan.proof_of_income_url} target="_blank" rel="noopener noreferrer" className="text-lending-primary hover:underline flex items-center">
                          <FileText className="h-4 w-4 mr-1" /> View Document
                        </a>
                      </div>
                      <div className="border p-3 rounded-md">
                        <p className="font-medium mb-1">Selfie Verification</p>
                        <a href={selectedLoan.selfie_url} target="_blank" rel="noopener noreferrer" className="text-lending-primary hover:underline flex items-center">
                          <FileText className="h-4 w-4 mr-1" /> View Selfie
                        </a>
                      </div>
                      <div className="border p-3 rounded-md">
                        <p className="font-medium mb-1">Other Documents</p>
                        <a href={selectedLoan.other_documents_url} target="_blank" rel="noopener noreferrer" className="text-lending-primary hover:underline flex items-center">
                          <FileText className="h-4 w-4 mr-1" /> View Documents
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {selectedLoan.status === 'rejected' && (
                    <div className="col-span-2 bg-red-50 p-3 rounded-md border border-red-200">
                      <p className="text-sm font-medium text-gray-700">Rejection Reason</p>
                      <p className="text-red-600">{selectedLoan.rejected_reason}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  {selectedLoan.status === 'pending' && (
                    <>
                      <Input
                        type="text"
                        placeholder="Rejection Reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full md:w-auto"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={processingLoanId === selectedLoan.id}
                        onClick={() => handleRejectLoan(selectedLoan.id)}
                      >
                        {processingLoanId === selectedLoan.id ? (
                          <>Rejecting...</>
                        ) : (
                          <>
                            Reject <ThumbsDown className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={processingLoanId === selectedLoan.id}
                        onClick={() => handleApproveLoan(selectedLoan.id)}
                      >
                        {processingLoanId === selectedLoan.id ? (
                          <>Approving...</>
                        ) : (
                          <>
                            Approve <ThumbsUp className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => setViewingDetails(false)}>
                    Close
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </MainLayout>
    </AdminRoute>
  );
};

// Add these functions back to fix errors
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

export default AdminDashboard;
