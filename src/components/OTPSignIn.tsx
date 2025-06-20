
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';
import { Phone, MessageSquare, ArrowLeft, CheckCircle, Timer, Send } from 'lucide-react';

interface CountryCode {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const OTPSignIn = () => {
  const { language, signIn } = useApp();
  const { t } = useTranslation(language as Language);
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>({
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    dialCode: '+91'
  });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState(''); // Store the generated OTP
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');

  // Country codes data
  const countryCodes: CountryCode[] = [
    { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
    { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
    { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
    { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' }
  ];

  // Timer effect for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0 && step === 'otp') {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  const validatePhoneNumber = (phone: string) => {
    // Basic phone number validation (adjust regex as needed)
    const phoneRegex = /^[0-9]{6,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTPToPhone = async (phoneNumber: string, otp: string) => {
    // Simulate real-time OTP sending (in real app, this would call your SMS service)
    console.log(`📱 Sending OTP ${otp} to ${selectedCountry.dialCode} ${phoneNumber}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you would integrate with services like:
    // - Twilio: https://www.twilio.com/docs/sms
    // - AWS SNS: https://docs.aws.amazon.com/sns/latest/dg/sms_publish-to-phone.html
    // - Firebase Auth: https://firebase.google.com/docs/auth/web/phone-auth
    
    return { success: true, message: 'OTP sent successfully' };
  };

  const sendOTP = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Generate new OTP
      const newOTP = generateOTP();
      setGeneratedOTP(newOTP);
      
      // Send OTP to phone number (simulated)
      const result = await sendOTPToPhone(phoneNumber, newOTP);
      
      if (result.success) {
        setStep('otp');
        setTimer(60); // 60 second timer
        setCanResend(false);
        setError('');
        
        // Show the OTP in console for demo (remove in production)
        console.log('🔐 Generated OTP for demo:', newOTP);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP sending error:', error);
      setError('Failed to send OTP. Please check your phone number and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate OTP verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verify OTP against generated OTP
      if (otpCode === generatedOTP) {
        setStep('profile');
        setError('');
      } else {
        setError('Invalid OTP. Please check and try again.');
        setOtpCode(''); // Clear the OTP input
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const completeSignIn = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate account creation/sign in
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fullPhoneNumber = `${selectedCountry.dialCode} ${phoneNumber}`;
      signIn(name, fullPhoneNumber);
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setCanResend(false);
    setTimer(60);
    setOtpCode('');
    setError('');
    
    // Generate new OTP
    const newOTP = generateOTP();
    setGeneratedOTP(newOTP);
    
    try {
      setIsLoading(true);
      const result = await sendOTPToPhone(phoneNumber, newOTP);
      
      if (result.success) {
        console.log('🔐 New OTP for demo:', newOTP);
        setError('');
      } else {
        setError('Failed to resend OTP. Please try again.');
        setCanResend(true);
        setTimer(0);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Failed to resend OTP. Please try again.');
      setCanResend(true);
      setTimer(0);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">VE</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">VillageEye</CardTitle>
          <p className="text-gray-600">
            {step === 'phone' && 'Enter your phone number'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'profile' && 'Complete your profile'}
          </p>
        </CardHeader>
        
        <CardContent>
          {/* Phone Number Step */}
          {step === 'phone' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={selectedCountry.code}
                  onValueChange={(value) => {
                    const country = countryCodes.find(c => c.code === value);
                    if (country) setSelectedCountry(country);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span>{selectedCountry.name}</span>
                        <span className="text-gray-500">{selectedCountry.dialCode}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="text-gray-500">{country.dialCode}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 py-2 bg-gray-50 border rounded-md">
                    <span className="text-lg mr-2">{selectedCountry.flag}</span>
                    <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={sendOTP}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading || !phoneNumber}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send OTP
                  </>
                )}
              </Button>

              {/* Demo Note */}
              <div className="text-center text-xs text-gray-500 bg-yellow-50 p-2 rounded">
                📝 Demo Mode: Check console for generated OTP
              </div>
            </div>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">
                    OTP sent to {selectedCountry.dialCode} {phoneNumber}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('phone')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Change number
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Enter 6-digit OTP</Label>
                <div className="flex justify-center">
                  <InputOTP 
                    value={otpCode} 
                    onChange={setOtpCode}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Demo OTP Display */}
              <div className="text-center text-xs text-gray-500 bg-blue-50 p-2 rounded">
                💡 Demo OTP: {generatedOTP}
              </div>

              {timer > 0 && (
                <div className="text-center">
                  <Badge variant="outline" className="gap-1">
                    <Timer className="w-3 h-3" />
                    Resend in {formatTime(timer)}
                  </Badge>
                </div>
              )}

              {canResend && (
                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resendOTP}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full mr-1"></div>
                        Resending...
                      </>
                    ) : (
                      'Resend OTP'
                    )}
                  </Button>
                </div>
              )}

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={verifyOTP}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading || otpCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify OTP
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Profile Completion Step */}
          {step === 'profile' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">Phone verified successfully!</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={completeSignIn}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading || !name.trim()}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Completing...
                  </>
                ) : (
                  'Complete Sign In'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPSignIn;
