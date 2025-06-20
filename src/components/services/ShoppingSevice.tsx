
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Plus, Minus, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  in_stock: boolean;
}

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

const ShoppingService = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const { user } = useApp();
  const { toast } = useToast();

  const categories = ['all', 'Seeds', 'Fertilizers', 'Tools', 'Testing', 'IoT', 'Materials', 'Irrigation'];

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    if (!user?.name) return; // Using name as the user identifier from AppContext

    try {
      // For now, we'll simulate cart data since we need proper auth setup
      // In a real app, this would use user.id from proper Supabase auth
      setCartItems([]);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (product: Product) => {
    if (!user?.name) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to cart',
        variant: 'destructive',
      });
      return;
    }

    // For now, simulate adding to cart without database interaction
    // In a real app, this would require proper Supabase auth setup
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart (simulated)`,
    });
  };

  const updateCartQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    // Simulate cart update
    console.log('Updating cart quantity:', cartItemId, newQuantity);
  };

  const removeFromCart = async (cartItemId: string) => {
    // Simulate cart removal
    toast({
      title: 'Removed from cart',
      description: 'Item has been removed from your cart (simulated)',
    });
  };

  const processPayment = async () => {
    if (!user?.name || cartItems.length === 0) return;

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Simulate payment processing
    toast({
      title: 'Payment Successful',
      description: `Order placed successfully! Amount: ₹${totalAmount} (simulated)`,
    });

    setCartItems([]);
    setShowCart(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Cart */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">🛒 Shopping</h2>
        <Button
          onClick={() => setShowCart(!showCart)}
          className="relative"
          variant="outline"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Cart ({cartItems.length})
          {cartItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Shopping Cart
              <Button variant="ghost" onClick={() => setShowCart(false)}>×</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">₹{item.product.price} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Total: ₹{cartTotal}</span>
                  </div>
                  <Button
                    onClick={processPayment}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    Pay Now ₹{cartTotal}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <Badge className="mb-2">{product.category}</Badge>
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                <Button
                  onClick={() => addToCart(product)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ShoppingService;
