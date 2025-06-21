
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, RefreshCw, AlertTriangle, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

interface CropPrice {
  id: number;
  name: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  lastUpdated: Date;
  market: string;
}

const MarketPrices = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [cropPrices] = useState<CropPrice[]>([
    {
      id: 1,
      name: 'Rice',
      price: 2450,
      unit: 'quintal',
      trend: 'up',
      change: 50,
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
      market: 'Mandal Market'
    },
    {
      id: 2,
      name: 'Wheat',
      price: 2100,
      unit: 'quintal',
      trend: 'down',
      change: -25,
      lastUpdated: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
      market: 'District Market'
    },
    {
      id: 3,
      name: 'Tomato',
      price: 35,
      unit: 'kg',
      trend: 'up',
      change: 8,
      lastUpdated: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
      market: 'Local Market'
    },
    {
      id: 4,
      name: 'Cotton',
      price: 5800,
      unit: 'quintal',
      trend: 'stable',
      change: 0,
      lastUpdated: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      market: 'Cotton Market'
    },
    {
      id: 5,
      name: 'Onion',
      price: 28,
      unit: 'kg',
      trend: 'down',
      change: -5,
      lastUpdated: new Date(Date.now() - 20 * 60 * 1000), // 20 mins ago
      market: 'Vegetable Market'
    },
    {
      id: 6,
      name: 'Potato',
      price: 22,
      unit: 'kg',
      trend: 'up',
      change: 3,
      lastUpdated: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago
      market: 'Vegetable Market'
    }
  ]);

  const filteredCrops = cropPrices
    .filter(crop => crop.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'change':
          return Math.abs(b.change) - Math.abs(a.change);
        case 'updated':
          return b.lastUpdated.getTime() - a.lastUpdated.getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Prices Updated",
        description: "Market prices have been refreshed successfully.",
      });
    }, 1000);
  };

  const handleReportPrice = (cropName: string) => {
    toast({
      title: "Price Report Submitted",
      description: `Thank you for reporting an issue with ${cropName} pricing. We'll verify and update soon.`,
    });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 border-green-600';
      case 'down':
        return 'text-red-600 border-red-600';
      default:
        return 'text-gray-600 border-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Local Crop Market Prices</h1>
          <p className="text-gray-600">Real-time pricing information for local agricultural markets</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price">Price (High-Low)</SelectItem>
              <SelectItem value="change">Biggest Change</SelectItem>
              <SelectItem value="updated">Recently Updated</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleRefresh} disabled={isRefreshing} className="w-full sm:w-auto">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Price Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <Card key={crop.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{crop.name}</CardTitle>
                  {getTrendIcon(crop.trend)}
                </div>
                <p className="text-sm text-gray-500">{crop.market}</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Price Display */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{crop.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">per {crop.unit}</div>
                  </div>

                  {/* Trend Badge */}
                  {crop.change !== 0 && (
                    <div className="flex justify-center">
                      <Badge variant="outline" className={getTrendColor(crop.trend)}>
                        {crop.trend === 'up' ? '+' : ''}₹{Math.abs(crop.change)}
                      </Badge>
                    </div>
                  )}

                  {/* Last Updated */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Updated: {formatTime(crop.lastUpdated)}
                    </p>
                  </div>

                  {/* Report Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReportPrice(crop.name)}
                    className="w-full flex items-center gap-2"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    Report Wrong Price
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCrops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No crops found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200 mt-12">
          <p className="text-sm text-gray-500">
            Built for Smart Villages | Powered by AI & Innovation 🇮🇳
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketPrices;
