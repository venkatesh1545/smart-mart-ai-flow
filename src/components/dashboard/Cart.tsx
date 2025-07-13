
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote,
  QrCode,
  Check
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  location: string;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onProcessPayment: (method: 'online' | 'cash') => void;
  onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProcessPayment,
  onClose
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash' | null>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        onUpdateQuantity(id, newQuantity);
      }
    }
  };

  const handleCheckout = () => {
    setShowPaymentOptions(true);
  };

  const handlePayment = (method: 'online' | 'cash') => {
    setPaymentMethod(method);
    onProcessPayment(method);
  };

  if (items.length === 0) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">Your cart is empty</p>
          <Button onClick={onClose} className="mt-4">
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart ({items.length})
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            Continue Shopping
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{item.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>📍 {item.location}</p>
                  <p className="font-medium">${item.price.toFixed(2)} each</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="text-right mt-2">
                <p className="font-semibold">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="border-t p-4 space-y-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total: ${totalAmount.toFixed(2)}</span>
          </div>

          {!showPaymentOptions ? (
            <Button onClick={handleCheckout} className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold">Choose Payment Method:</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-20"
                  onClick={() => handlePayment('online')}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-xs">Online Payment</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-20"
                  onClick={() => handlePayment('cash')}
                >
                  <Banknote className="w-6 h-6" />
                  <span className="text-xs">Pay at Store</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
