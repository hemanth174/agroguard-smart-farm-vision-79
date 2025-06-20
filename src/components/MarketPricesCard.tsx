import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useTranslation, Language } from '@/utils/i18n';
interface MarketPricesCardProps {
  language: string;
}
const MarketPricesCard = ({
  language
}: MarketPricesCardProps) => {
  const {
    t
  } = useTranslation(language as Language);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [priceData, setPriceData] = useState([{
    crop: 'rice',
    price: 2450,
    trend: 'up',
    change: 50
  }, {
    crop: 'wheat',
    price: 2100,
    trend: 'down',
    change: -25
  }, {
    crop: 'cotton',
    price: 5800,
    trend: 'up',
    change: 100
  }]);
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
  return <Card className="hover:shadow-lg transition-shadow">
      
      
    </Card>;
};
export default MarketPricesCard;