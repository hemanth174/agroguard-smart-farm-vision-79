
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, RefreshCw, ExternalLink } from 'lucide-react';
import { useTranslation, Language } from '@/utils/i18n';
import { useNavigate } from 'react-router-dom';

interface MarketPricesCardProps {
  language: string;
}

const MarketPricesCard = ({ language }: MarketPricesCardProps) => {
  const { t } = useTranslation(language as Language);
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [priceData, setPriceData] = useState([
    { crop: 'rice', price: 2450, trend: 'up', change: 50 },
    { crop: 'wheat', price: 2100, trend: 'down', change: -25 },
    { crop: 'cotton', price: 5800, trend: 'up', change: 100 }
  ]);

  const generateRandomPriceUpdate = () => {
    return priceData.map(item => {
      const changeAmount = (Math.random() - 0.5) * 200; // Random change between -100 to +100
      const newPrice = Math.max(100, item.price + changeAmount);
      const trend = changeAmount >= 0 ? 'up' : 'down';
      
      return {
        ...item,
        price: Math.round(newPrice),
        trend,
        change: Math.round(Math.abs(changeAmount))
      };
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setPriceData(generateRandomPriceUpdate());
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceData(generateRandomPriceUpdate());
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{t('marketPrices')}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/market-prices')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priceData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{t(item.crop)}</h4>
                <p className="text-sm text-gray-500">₹{item.price.toLocaleString()}/quintal</p>
              </div>
              <div className="flex items-center gap-2">
                {item.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <Badge 
                  variant="outline" 
                  className={item.trend === 'up' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}
                >
                  {item.trend === 'up' ? '+' : '-'}₹{item.change}
                </Badge>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2 border-t">
            <p className="text-xs text-gray-500">
              Last updated: {formatTime(lastUpdated)}
            </p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">Live</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketPricesCard;
