
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Phone, Mail, MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';
import { useToast } from '@/hooks/use-toast';

const Support = () => {
  const { language } = useApp();
  const { t } = useTranslation(language as Language);
  const { toast } = useToast();
  const [supportForm, setSupportForm] = useState({
    subject: '',
    category: 'general',
    description: '',
    priority: 'medium'
  });

  const handleSubmit = () => {
    if (!supportForm.subject || !supportForm.description) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Support Request Submitted',
      description: 'We will get back to you within 24 hours',
    });

    setSupportForm({
      subject: '',
      category: 'general',
      description: '',
      priority: 'medium'
    });
  };

  const supportTopics = [
    {
      title: 'Emergency Services',
      description: 'Issues with emergency reporting or alerts',
      icon: '🚨',
      status: 'Available 24/7'
    },
    {
      title: 'Drone Monitoring',
      description: 'Problems with AI video detection or alerts',
      icon: '🛸',
      status: 'Technical Support'
    },
    {
      title: 'Market Prices',
      description: 'Questions about crop prices or reporting',
      icon: '📊',
      status: 'Updated Daily'
    },
    {
      title: 'Shopping & Orders',
      description: 'Help with products, cart, or payments',
      icon: '🛒',
      status: 'Business Hours'
    }
  ];

  const recentTickets = [
    {
      id: '#SP-2024-001',
      subject: 'Unable to upload video for AI detection',
      status: 'resolved',
      date: '2 days ago'
    },
    {
      id: '#SP-2024-002',
      subject: 'Market price update request',
      status: 'in-progress',
      date: '1 week ago'
    },
    {
      id: '#SP-2024-003',
      subject: 'Emergency alert not working',
      status: 'resolved',
      date: '2 weeks ago'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('support')}</h1>
        <p className="text-gray-600">Get help with VillageEye platform and services</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Support Form */}
        <Card className="lg:col-span-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-600" />
              Submit Support Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject *</label>
              <Input
                value={supportForm.subject}
                onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of your issue"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={supportForm.category}
                  onChange={(e) => setSupportForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="emergency">Emergency Services</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="feature">Feature Request</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={supportForm.priority}
                  onChange={(e) => setSupportForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <Textarea
                value={supportForm.description}
                onChange={(e) => setSupportForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Please describe your issue in detail..."
                rows={6}
              />
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
          </CardContent>
        </Card>

        {/* Quick Help & Contact */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-600" />
                <div>
                  <p className="font-medium">Emergency Helpline</p>
                  <p className="text-sm text-gray-600">6305003695</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-medium">Support Email</p>
                  <p className="text-sm text-gray-600">support@villageeye.in</p>
                </div>
              </div>

              <Button className="w-full mt-4" variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Call Support
              </Button>
            </CardContent>
          </Card>

          {/* Recent Tickets */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                Recent Tickets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{ticket.id}</span>
                    <Badge 
                      variant={ticket.status === 'resolved' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {ticket.status === 'resolved' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {ticket.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{ticket.subject}</p>
                  <p className="text-xs text-gray-500">{ticket.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Support Topics */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Common Help Topics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportTopics.map((topic, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{topic.icon}</div>
                <h4 className="font-medium mb-1">{topic.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                <Badge variant="outline" className="text-xs">{topic.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
