
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Plus, Minus, Search, Filter, CreditCard, Trash2 } from 'lucide-react';
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
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { user } = useApp();
  const { toast } = useToast();

  const categories = ['all', 'Seeds', 'Fertilizers', 'Tools', 'Testing', 'IoT', 'Materials', 'Irrigation'];

  useEffect(() => {
    fetchProducts();
    if (user) {
      loadCartFromStorage();
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

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem(`cart-${user?.name}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCartToStorage = (items: CartItem[]) => {
    if (user?.name) {
      localStorage.setItem(`cart-${user.name}`, JSON.stringify(items));
    }
  };

  const addToCart = (product: Product) => {
    if (!user?.name) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to cart',
        variant: 'destructive',
      });
      return;
    }

    const existingItem = cartItems.find(item => item.product_id === product.id);
    let updatedCart: CartItem[];

    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        product_id: product.id,
        quantity: 1,
        product: product
      };
      updatedCart = [...cartItems, newItem];
    }

    setCartItems(updatedCart);
    saveCartToStorage(updatedCart);

    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
    });
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.id === cartItemId
        ? { ...item, quantity: newQuantity }
        : item
    );

    setCartItems(updatedCart);
    saveCartToStorage(updatedCart);
  };

  const removeFromCart = (cartItemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== cartItemId);
    setCartItems(updatedCart);
    saveCartToStorage(updatedCart);

    toast({
      title: 'Removed from cart',
      description: 'Item has been removed from your cart',
    });
  };

  const clearCart = () => {
    setCartItems([]);
    saveCartToStorage([]);
  };

  const processPayment = async () => {
    if (!user?.name || cartItems.length === 0) return;

    setPaymentLoading(true);
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate payment success
      const isSuccess = Math.random() > 0.1; // 90% success rate

      if (isSuccess) {
        toast({
          title: 'Payment Successful!',
          description: `Order placed successfully! Amount: ₹${totalAmount.toFixed(2)}`,
        });

        // Clear cart after successful payment
        clearCart();
        setShowCart(false);
      } else {
        toast({
          title: 'Payment Failed',
          description: 'Payment could not be processed. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: 'An error occurred during payment processing.',
        variant: 'destructive',
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header with Cart */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">🛒 Shopping</h2>
        <Button
          onClick={() => setShowCart(!showCart)}
          className="relative"
          variant="outline"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Cart ({cartItemsCount})
          {cartItemsCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 text-xs">
              {cartItemsCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
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
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">₹{item.product.price} each</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
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
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Total: ₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      className="flex-1"
                    >
                      Clear Cart
                    </Button>
                    <Button
                      onClick={processPayment}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="lg"
                      disabled={paymentLoading}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {paymentLoading ? 'Processing...' : `Pay ₹${cartTotal.toFixed(2)}`}
                    </Button>
                  </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-3 md:p-4">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-32 md:h-48 object-cover rounded-lg mb-3 md:mb-4"
              />
              <Badge className="mb-2 text-xs">{product.category}</Badge>
              <h3 className="font-semibold text-sm md:text-lg mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-gray-600 text-xs md:text-sm mb-3 line-clamp-2">{product.description}</p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-lg md:text-2xl font-bold text-green-600">₹{product.price}</span>
                <Button
                  onClick={() => addToCart(product)}
                  className="bg-green-600 hover:bg-green-700 text-xs md:text-sm w-full sm:w-auto"
                >
                  <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
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
