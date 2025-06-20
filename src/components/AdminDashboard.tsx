
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { Shield, Plus, Edit, Trash2, Eye, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const { language, addAlert } = useApp();
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  
  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setAdminAuth(true);
      addAlert({ type: 'info', message: 'Admin access granted', resolved: false });
    } else {
      addAlert({ type: 'error', message: 'Invalid admin password', resolved: false });
    }
  };

  if (!adminAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
              </div>
              <Button onClick={handleAdminLogin} className="w-full">
                Login as Admin
              </Button>
              <p className="text-sm text-gray-500">Demo password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AgroGuard Admin Dashboard</h1>
          <p className="text-gray-600">Manage all site content and monitor farm operations</p>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="iot">IoT Data</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ShoppingManager />
              <VideoManager />
              <MarketPriceManager />
              <ContractManager />
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertManager />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportManager />
          </TabsContent>

          <TabsContent value="iot" className="space-y-6">
            <IoTManager />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const ShoppingManager = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Premium Seeds', price: '₹500/kg', category: 'Seeds', stock: 'In Stock' },
    { id: 2, name: 'Organic Fertilizer', price: '₹800/bag', category: 'Fertilizers', stock: 'Low Stock' }
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Shopping Items
          <Button size="sm"><Plus className="h-4 w-4" /></Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">{item.price} - {item.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={item.stock === 'In Stock' ? 'outline' : 'destructive'}>
                  {item.stock}
                </Badge>
                <Button size="sm" variant="outline"><Edit className="h-3 w-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const VideoManager = () => {
  const videos = [
    { id: 1, title: 'Irrigation Techniques', language: 'English', url: 'https://youtube.com/watch?v=example1' },
    { id: 2, title: 'जैविक खेती', language: 'Hindi', url: 'https://youtube.com/watch?v=example2' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Video Guides
          <Button size="sm"><Plus className="h-4 w-4" /></Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {videos.map(video => (
            <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{video.title}</p>
                <p className="text-sm text-gray-600">{video.language}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline"><Eye className="h-3 w-3" /></Button>
                <Button size="sm" variant="outline"><Edit className="h-3 w-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const MarketPriceManager = () => {
  const [prices, setPrices] = useState([
    { crop: 'Rice', price: '₹2,450', region: 'Telangana', trend: 'up' },
    { crop: 'Cotton', price: '₹5,800', region: 'Maharashtra', trend: 'down' }
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Prices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prices.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{item.crop}</p>
                <p className="text-sm text-gray-600">{item.region} - {item.price}</p>
              </div>
              <Button size="sm" variant="outline"><Edit className="h-3 w-3" /></Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const ContractManager = () => {
  const contracts = [
    { id: 1, title: 'Cotton Cultivation', area: '5 acres', payment: '₹50,000', status: 'Active' },
    { id: 2, title: 'Organic Vegetables', area: '2 acres', payment: '₹25,000', status: 'Pending' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agri Contracts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {contracts.map(contract => (
            <div key={contract.id} className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium">{contract.title}</p>
                <Badge variant={contract.status === 'Active' ? 'default' : 'secondary'}>
                  {contract.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{contract.area} - {contract.payment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AlertManager = () => {
  const { addAlert } = useApp();
  const [alertMessage, setAlertMessage] = useState('');

  const sendManualAlert = () => {
    if (alertMessage.trim()) {
      addAlert({ type: 'warning', message: alertMessage, resolved: false });
      setAlertMessage('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Manual Alert</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="alert">Alert Message</Label>
            <Textarea
              id="alert"
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              placeholder="Enter alert message..."
            />
          </div>
          <Button onClick={sendManualAlert} className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Send Alert
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ReportManager = () => {
  const reports = [
    { id: 1, farmer: 'Ravi Kumar', issue: 'Pest attack on cotton', location: 'Telangana', status: 'Open' },
    { id: 2, farmer: 'Sita Devi', issue: 'Water shortage', location: 'Karnataka', status: 'Resolved' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmer Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reports.map(report => (
            <div key={report.id} className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium">{report.farmer}</p>
                <Badge variant={report.status === 'Open' ? 'destructive' : 'outline'}>
                  {report.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{report.issue}</p>
              <p className="text-xs text-gray-500">{report.location}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const IoTManager = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>IoT Sensor Control</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded">
            <p className="font-medium">Soil Moisture</p>
            <p className="text-2xl font-bold text-green-600">65%</p>
          </div>
          <div className="p-3 bg-blue-50 rounded">
            <p className="font-medium">Water Level</p>
            <p className="text-2xl font-bold text-blue-600">85%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SettingsManager = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Weather API Key</Label>
            <Input placeholder="Enter OpenWeatherMap API key" />
          </div>
          <div>
            <Label>OpenAI API Key</Label>
            <Input placeholder="Enter OpenAI API key for chatbot" />
          </div>
          <Button>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
