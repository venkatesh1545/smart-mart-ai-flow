
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  GraduationCap, 
  Heart, 
  Building, 
  Store,
  MessageCircle,
  Bot,
  ArrowLeft,
  ShoppingCart as CartIcon
} from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { SectorContent } from './SectorContent';
import { ProductBrowser } from './ProductBrowser';
import { Cart } from './Cart';
import { QRCodeDisplay } from './QRCodeDisplay';

export type SectorType = 'retail' | 'education' | 'healthcare' | 'general' | null;

interface Sector {
  id: SectorType;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  location: string;
}

const sectors: Sector[] = [
  {
    id: 'retail',
    name: 'Shopping & Retail',
    icon: ShoppingBag,
    description: 'Malls, stores, groceries, and shopping centers',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    description: 'Schools, colleges, and educational institutions',
    color: 'bg-green-100 text-green-700'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Heart,
    description: 'Hospitals, clinics, and medical services',
    color: 'bg-red-100 text-red-700'
  },
  {
    id: 'general',
    name: 'General Services',
    icon: Building,
    description: 'Other services and facilities',
    color: 'bg-purple-100 text-purple-700'
  }
];

export const SectorDashboard = () => {
  const [selectedSector, setSelectedSector] = useState<SectorType>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'products' | 'cart' | 'qr'>('main');
  const [selectedStore, setSelectedStore] = useState<{id: string, name: string} | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [qrData, setQrData] = useState<any>(null);

  const handleSectorSelect = (sectorId: SectorType) => {
    setSelectedSector(sectorId);
    setShowAIAssistant(true);
    setCurrentView('main');
  };

  const handleBackToSectors = () => {
    setSelectedSector(null);
    setShowAIAssistant(false);
    setCurrentView('main');
    setSelectedStore(null);
    setCartItems([]);
    setQrData(null);
  };

  const handleProductBrowse = (storeId: string, storeName: string) => {
    setSelectedStore({ id: storeId, name: storeName });
    setCurrentView('products');
  };

  const handleAddToCart = (item: any) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, {
        id: item.id || Date.now().toString(),
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        location: item.location
      }]);
    }
  };

  const handleViewCart = () => {
    setCurrentView('cart');
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleProcessPayment = (method: 'online' | 'cash') => {
    const qrCode = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newQrData = {
      id: qrCode,
      items: cartItems,
      totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      paymentMethod: method,
      paymentStatus: method === 'online' ? 'completed' : 'pending',
      timestamp: new Date(),
      sector: selectedSector || 'general'
    };
    
    setQrData(newQrData);
    setCurrentView('qr');
    
    // Clear cart after successful payment
    if (method === 'online') {
      setCartItems([]);
    }
  };

  const handleGetDirections = (location: string) => {
    alert(`Getting directions to: ${location}\n\nIn a real app, this would open your preferred navigation app.`);
  };

  const handleBookAppointment = (facility: string) => {
    alert(`Booking appointment at: ${facility}\n\nIn a real app, this would open the appointment booking system.`);
  };

  const handleApplyToInstitution = (institution: string) => {
    alert(`Starting application for: ${institution}\n\nIn a real app, this would open the application portal.`);
  };

  const handleViewDetails = (institutionId: string) => {
    alert(`Viewing details for institution ID: ${institutionId}\n\nIn a real app, this would show detailed information about the institution.`);
  };

  const handleApplyNow = (institutionId: string) => {
    alert(`Starting application for institution ID: ${institutionId}\n\nIn a real app, this would start the application process.`);
  };

  const handleDirections = (location: string) => {
    handleGetDirections(location);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'products':
        return selectedStore ? (
          <ProductBrowser
            storeName={selectedStore.name}
            onAddToCart={handleAddToCart}
            onBack={() => setCurrentView('main')}
          />
        ) : null;
        
      case 'cart':
        return (
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onProcessPayment={handleProcessPayment}
            onClose={() => setCurrentView('main')}
          />
        );
        
      case 'qr':
        return qrData ? (
          <QRCodeDisplay
            qrData={qrData}
            onClose={() => {
              setCurrentView('main');
              setQrData(null);
            }}
          />
        ) : null;
        
      default:
        return (
          <SectorContent
            sector={selectedSector}
            onProductBrowse={handleProductBrowse}
            onDirections={handleDirections}
            onViewDetails={handleViewDetails}
            onApplyNow={handleApplyNow}
          />
        );
    }
  };

  if (selectedSector) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="outline" onClick={handleBackToSectors} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sectors
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {sectors.find(s => s.id === selectedSector)?.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {cartItems.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleViewCart}
                className="flex items-center gap-2"
              >
                <CartIcon className="w-4 h-4" />
                Cart ({cartItems.length})
              </Button>
            )}
            <Badge variant="secondary" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Assistant Active
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {renderCurrentView()}
          </div>
          <div className="lg:col-span-1">
            {showAIAssistant && currentView !== 'qr' && (
              <AIAssistant 
                sector={selectedSector}
                onAddToCart={handleAddToCart}
                onViewCart={handleViewCart}
                onGetDirections={handleGetDirections}
                onBookAppointment={handleBookAppointment}
                onApplyToInstitution={handleApplyToInstitution}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Welcome to OmniSmart Assistant! 🚀
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Your AI-powered companion for shopping, education, healthcare, and more
          </p>
          <div className="flex items-center gap-2 text-blue-100">
            <MessageCircle className="w-5 h-5" />
            <span>Select a sector below to start your AI-assisted journey</span>
          </div>
        </div>
      </div>

      {/* Sector Selection */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Sector</h2>
          <p className="text-gray-600">Select the type of service you're looking for and get personalized AI assistance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((sector) => {
            const IconComponent = sector.icon;
            return (
              <Card 
                key={sector.id} 
                className="hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                onClick={() => handleSectorSelect(sector.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${sector.color}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{sector.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {sector.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button className="w-full" variant="outline">
                    <Bot className="w-4 h-4 mr-2" />
                    Start AI Assistant
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features Overview */}
      <section className="bg-gray-50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">What You Can Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <Store className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold">Find & Navigate</h3>
            <p className="text-sm text-gray-600">Get directions to stores, schools, hospitals</p>
          </div>
          <div className="text-center p-4">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold">AI Search</h3>
            <p className="text-sm text-gray-600">Ask AI to find specific products, courses, services</p>
          </div>
          <div className="text-center p-4">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold">Smart Shopping</h3>
            <p className="text-sm text-gray-600">Get product locations, cart management, payments</p>
          </div>
          <div className="text-center p-4">
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <h3 className="font-semibold">QR Tracking</h3>
            <p className="text-sm text-gray-600">Generate QR codes for tracking and verification</p>
          </div>
        </div>
      </section>
    </div>
  );
};
