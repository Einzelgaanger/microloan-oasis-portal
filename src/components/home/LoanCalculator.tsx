
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LoanCalculator = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [amount, setAmount] = useState(50000);
  const [term, setTerm] = useState(3);
  const [interestRate, setInterestRate] = useState(15);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [processingFee, setProcessingFee] = useState(2500);

  useEffect(() => {
    // Update interest rate based on amount (Kenyan rates)
    let rate = 15; // Default rate
    if (amount > 50000 && amount <= 100000) {
      rate = 12;
    } else if (amount > 100000) {
      rate = 10;
    }
    setInterestRate(rate);

    // Update processing fee (5% of loan amount)
    const fee = amount * 0.05;
    setProcessingFee(fee);

    // Calculate monthly payment
    const monthlyInterestRate = rate / 100 / 12;
    const totalPayments = term;
    const principal = amount;

    // Monthly payment formula
    const monthly = (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));
    const total = monthly * totalPayments;

    setMonthlyPayment(isNaN(monthly) ? 0 : Math.round(monthly));
    setTotalPayment(isNaN(total) ? 0 : Math.round(total));
  }, [amount, term]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-md mx-auto lg:mx-0"
    >
      <Card className="border-2 border-blue-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 py-4 cursor-pointer flex flex-row items-center justify-between" onClick={() => setIsOpen(!isOpen)}>
          <CardTitle className="text-xl flex items-center text-blue-800">
            <Calculator className="mr-2 h-5 w-5" /> Loan Calculator
          </CardTitle>
          {isOpen ? <ChevronUp className="h-5 w-5 text-blue-800" /> : <ChevronDown className="h-5 w-5 text-blue-800" />}
        </CardHeader>
        
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: "hidden" }}
        >
          <CardContent className="pt-5 pb-6 px-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Loan Amount: KES {amount.toLocaleString()}</Label>
                  <span className="text-xs text-gray-500">Min: 10,000 - Max: 500,000</span>
                </div>
                <Slider
                  value={[amount]}
                  min={10000}
                  max={500000}
                  step={5000}
                  onValueChange={values => setAmount(values[0])}
                  className="py-4"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="term">Loan Term (Months)</Label>
                <Select value={term.toString()} onValueChange={(value) => setTerm(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Month</SelectItem>
                    <SelectItem value="2">2 Months</SelectItem>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="9">9 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="rounded-lg bg-blue-50 p-4 mt-4 space-y-2">
                <h4 className="text-sm font-medium text-blue-800">Payment Summary</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Interest Rate</p>
                    <p className="font-semibold">{interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Monthly Payment</p>
                    <p className="font-semibold text-blue-700">KES {monthlyPayment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Processing Fee</p>
                    <p className="font-semibold">KES {processingFee.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Payment</p>
                    <p className="font-semibold">KES {totalPayment.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <Link to="/apply" className="block w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                Loan applications processed within 24 hours!
              </p>
            </div>
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default LoanCalculator;
