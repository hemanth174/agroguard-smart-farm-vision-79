
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  MapPin, 
  CheckCircle, 
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  Lock
} from 'lucide-react';

interface PaymentItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
  };
}

interface PaymentData {
  method: string;
  amount: number;
  items: PaymentItem[];
  user: {
    name: string;
    phone?: string;
    email?: string;
  };
}

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    address: ''
  });

  const paymentMethod = searchParams.get('method') || 'bank';

  useEffect(() => {
    const storedData = localStorage.getItem('paymentData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setPaymentData(data);
      setFormData(prev => ({
        ...prev,
        fullName: data.user.name || '',
        phone: data.user.phone || '',
        email: data.user.email || ''
      }));
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const processPayment = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate payment success (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setPaymentSuccess(true);
        setCurrentStep(4);
        
        // Clear payment data from localStorage
        localStorage.removeItem('paymentData');
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case 'bank':
        return <CreditCard className="h-6 w-6" />;
      case 'upi':
        return <Smartphone className="h-6 w-6" />;
      case 'cash':
        return <MapPin className="h-6 w-6" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  const getPaymentMethodName = () => {
    switch (paymentMethod) {
      case 'bank':
        return 'Bank Transfer';
      case 'upi':
        return 'UPI Payment';
      case 'cash':
        return 'Cash at VillageEye Center';
      default:
        return 'Payment';
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center animate-fade-in">
          <h2 className="text-xl font-bold mb-4">No payment data found</h2>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </Card>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full animate-scale-in">
          <CardContent className="p-8 text-center">
            <div className="animate-bounce mb-6">
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-4 animate-fade-in">
              Payment Successful! 🎉
            </h1>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 animate-fade-in">
              <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium">{getPaymentMethodName()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-medium text-green-600">₹{paymentData.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-medium">{formData.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-medium">TXN{Date.now()}</p>
                </div>
                {paymentMethod === 'upi' && formData.upiId && (
                  <div>
                    <p className="text-sm text-gray-600">UPI ID</p>
                    <p className="font-medium">{formData.upiId}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium">{new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 animate-fade-in">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                {paymentData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs">{item.product.category}</Badge>
                      <span className="text-sm">{item.product.name}</span>
                      <span className="text-xs text-gray-500">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span className="text-green-600">₹{paymentData.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')}
                className="bg-green-600 hover:bg-green-700"
              >
                Continue Shopping
              </Button>
              <Button 
                onClick={() => window.print()}
                variant="outline"
              >
                Print Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 animate-fade-in">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.close()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {getPaymentMethodIcon()}
            <h1 className="text-2xl font-bold">{getPaymentMethodName()}</h1>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 animate-fade-in">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-green-600 text-white scale-110' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 transition-all duration-300 ${
                    currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Form */}
          <Card className="animate-slide-in-right">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="transition-all duration-200 focus:scale-105"
                  />
                </div>
              </div>

              {/* Payment Method Specific Fields */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">UPI Details</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">UPI ID</label>
                    <Input
                      value={formData.upiId}
                      onChange={(e) => handleInputChange('upiId', e.target.value)}
                      placeholder="yourname@paytm / yourname@gpay"
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Bank Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Card Number</label>
                      <Input
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date</label>
                      <Input
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CVV</label>
                      <Input
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        placeholder="123"
                        type="password"
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cash' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Pickup Address</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your address for pickup"
                      className="transition-all duration-200 focus:scale-105"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={processPayment}
                disabled={processing}
                className="w-full bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105"
                size="lg"
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing Payment...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Pay ₹{paymentData.amount.toFixed(2)}
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="animate-slide-in-right">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">
                        ₹{item.product.price} × {item.quantity}
                      </p>
                      <Badge className="text-xs mt-1">{item.product.category}</Badge>
                    </div>
                    <span className="font-bold">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-600">₹{paymentData.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold mb-2">Secure Payment</h4>
                  <p className="text-sm text-gray-600">
                    Your payment information is encrypted and secure. We use industry-standard security measures.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
