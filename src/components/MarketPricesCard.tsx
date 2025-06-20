
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketPricesCardProps {
  language: string;
}

const MarketPricesCard = ({ language }: MarketPricesCardProps) => {
  const translations = {
    en: {
      title: 'Market Prices',
      rice: 'Rice',
      wheat: 'Wheat',
      cotton: 'Cotton',
      perQuintal: '/quintal',
      updated: 'Updated 1 hour ago'
    },
    hi: {
      title: 'बाज़ार मूल्य',
      rice: 'चावल',
      wheat: 'गेहूं',
      cotton: 'कपास',
      perQuintal: '/क्विंटल',
      updated: '1 घंटे पहले अपडेट किया गया'
    },
    te: {
      title: 'మార్కెట్ ధరలు',
      rice: 'వరి',
      wheat: 'గోధుమ',
      cotton: 'పత్తి',
      perQuintal: '/క్వింటల్',
      updated: '1 గంట క్రితం నవీకరించబడింది'
    }
  };

  const t = translations[language];

  const priceData = [
    { crop: t.rice, price: '₹2,450', trend: 'up', change: '+₹50' },
    { crop: t.wheat, price: '₹2,100', trend: 'down', change: '-₹25' },
    { crop: t.cotton, price: '₹5,800', trend: 'up', change: '+₹100' }
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priceData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{item.crop}</h4>
                <p className="text-sm text-gray-500">{item.price}{t.perQuintal}</p>
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
                  {item.change}
                </Badge>
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-500 text-center pt-2">{t.updated}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketPricesCard;
