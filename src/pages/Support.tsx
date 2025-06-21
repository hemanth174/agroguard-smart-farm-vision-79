
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Send,
  FileText
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/components/BackButton';
import LanguageIndicator from '@/components/LanguageIndicator';

const Support = () => {
  const { language } = useApp();
  const { t } = useTranslation(language as Language);
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Support Request Submitted",
        description: "We'll get back to you within 24 hours. Ticket ID: #VE2024001",
      });
      setQuery('');
      setSubject('');
      setEmail('');
    }, 2000);
  };

  const supportTickets = [
    {
      id: '#VE2024001',
      subject: 'Weather data not updating',
      status: 'resolved',
      date: '2024-01-15',
      priority: 'medium'
    },
    {
      id: '#VE2024002',
      subject: 'Market prices incorrect for wheat',
      status: 'in-progress',
      date: '2024-01-18',
      priority: 'high'
    },
    {
      id: '#VE2024003',
      subject: 'Drone alert false positive',
      status: 'pending',
      date: '2024-01-20',
      priority: 'low'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <BackButton />
      <LanguageIndicator />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('support')}</h1>
        <p className="text-gray-600">Get help with your VillageEye experience</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-green-600" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="font-semibold text-red-800 mb-2">🚨 Emergency Helpline</p>
                <p className="text-xl font-bold text-red-700">6305003695</p>
                <p className="text-sm text-red-600">Available 24/7</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800 mb-2">📞 General Support</p>
                <p className="text-lg font-semibold text-blue-700">+91 98765 43210</p>
                <p className="text-sm text-blue-600">Mon-Sat, 9 AM - 6 PM</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">General Queries</p>
                  <p className="text-blue-600">support@villageeye.in</p>
                </div>
                <div>
                  <p className="font-medium">Technical Issues</p>
                  <p className="text-blue-600">tech@villageeye.in</p>
                </div>
                <div>
                  <p className="font-medium">Business Partnership</p>
                  <p className="text-blue-600">business@villageeye.in</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Form and Tickets */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submit New Query */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Submit New Query
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Describe Your Issue</label>
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Please provide detailed information about your issue or question..."
                    rows={5}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t('submit')} Query
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Previous Support Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-600" />
                Your Support Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ticket.status)}
                        <span className="font-medium">{ticket.subject}</span>
                      </div>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Ticket ID: {ticket.id}</span>
                      <div className="flex items-center gap-4">
                        <span>{ticket.date}</span>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">How do I report an emergency?</h4>
                <p className="text-sm text-gray-600">Click the Emergency Call button on the dashboard or call our 24/7 helpline at 6305003695.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Why are market prices not updating?</h4>
                <p className="text-sm text-gray-600">Market prices update every hour. Check your internet connection or refresh the page.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">How do I change my language preference?</h4>
                <p className="text-sm text-gray-600">Go to Settings → Language & Region to select your preferred language.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">What if drone alerts are incorrect?</h4>
                <p className="text-sm text-gray-600">Report false positives through the Drone Monitor section or contact our technical support.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">How do I reset my password?</h4>
                <p className="text-sm text-gray-600">Go to Settings → Security → Change Password or contact support if you're locked out.</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Is my data secure?</h4>
                <p className="text-sm text-gray-600">Yes, we use end-to-end encryption and comply with data protection regulations.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
