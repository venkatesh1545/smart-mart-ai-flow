
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  MapPin, 
  ShoppingCart, 
  QrCode,
  Navigation,
  Star
} from 'lucide-react';
import { SectorType } from './SectorDashboard';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: {
    location?: string;
    products?: string[];
    recommendations?: any[];
  };
}

interface AIAssistantProps {
  sector: SectorType;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ sector }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message based on sector
    const welcomeMessage = getWelcomeMessage(sector);
    setMessages([{
      id: '1',
      type: 'ai',
      content: welcomeMessage,
      timestamp: new Date()
    }]);
  }, [sector]);

  const getWelcomeMessage = (sector: SectorType): string => {
    switch (sector) {
      case 'retail':
        return "Hi! I'm your shopping assistant. I can help you find products, get store directions, locate items within stores (like '2nd floor, column 3, line 2'), and assist with cart management and payments. What are you looking for today?";
      case 'education':
        return "Hello! I'm your education assistant. I can help you find schools, colleges, admission requirements, fees, and application processes. I'll recommend top institutions and help with admissions. What educational service do you need?";
      case 'healthcare':
        return "Hi there! I'm your healthcare assistant. I can help you find hospitals, clinics, medicines, book appointments, and assist with medical payments. What healthcare service are you looking for?";
      default:
        return "Hello! I'm your AI assistant. I can help you find various services and facilities in your area. How can I assist you today?";
    }
  };

  const generateAIResponse = (userQuery: string, sector: SectorType): Message => {
    const query = userQuery.toLowerCase();
    let response = "";
    let metadata = {};

    if (sector === 'retail') {
      if (query.includes('shirt') || query.includes('clothing') || query.includes('wear')) {
        if (query.includes('party') || query.includes('formal')) {
          response = "🎯 Found party wear shirts for you!\n\n📍 **Location:** 2nd floor, Column 3, Line 3\n🏷️ **Section:** Party Wear & Formal Shirts\n💰 **Price Range:** $25 - $85\n⭐ **Top Brands:** Available\n\n🛒 Would you like me to add any specific shirts to your cart or show you directions to this section?";
        } else {
          response = "👔 Found shirts section!\n\n📍 **Location:** 2nd floor, Column 3, Line 2\n🏷️ **Section:** Casual & Regular Shirts\n💰 **Price Range:** $15 - $60\n📦 **Stock:** Well stocked\n\n🛒 Would you like me to help you add items to cart or get directions?";
        }
        metadata = { 
          location: "2nd floor, Column 3", 
          products: ["shirts", "party wear"], 
        };
      } else if (query.includes('pants') || query.includes('trouser')) {
        response = "👖 Found pants section!\n\n📍 **Location:** 2nd floor, Column 2, Line 1\n🏷️ **Section:** Pants & Trousers\n💰 **Price Range:** $20 - $70\n📏 **Sizes:** All sizes available\n\n🛒 Ready to add to cart or need directions?";
        metadata = { location: "2nd floor, Column 2", products: ["pants"] };
      } else if (query.includes('grocery') || query.includes('food')) {
        response = "🛒 Grocery section found!\n\n📍 **Location:** Ground floor, Section A\n🥬 **Fresh Produce:** Aisle 1-3\n🥫 **Packaged Foods:** Aisle 4-8\n🥛 **Dairy:** Aisle 9\n\n💳 Payment options: Card, Cash, Digital wallets available!";
      } else {
        response = "I can help you find products in our store! Try searching for:\n• Clothing items (shirts, pants, dresses)\n• Electronics\n• Groceries\n• Home goods\n\nI'll provide exact locations like '2nd floor, column 3, line 2' for easy navigation! 🧭";
      }
    } else if (sector === 'education') {
      if (query.includes('school') || query.includes('college') || query.includes('university')) {
        response = "🎓 **Top 5 Recommended Institutions:**\n\n⭐ **Premium Recommendations:**\n1. Seattle University - $45,000/year\n2. University of Washington - $38,000/year\n3. Seattle Pacific University - $42,000/year\n4. Cornish College - $35,000/year\n5. Seattle Central College - $15,000/year\n\n📚 **Other Options:** 10 more institutions available\n\n💰 Would you like admission details or payment processing for any of these?";
        metadata = { recommendations: ["Seattle University", "UW", "SPU"] };
      } else {
        response = "I can help you find educational institutions! I provide:\n• Top 5 recommended schools/colleges\n• Admission requirements & fees\n• Application processes\n• Payment assistance\n\nWhat type of education are you looking for? 📚";
      }
    } else if (sector === 'healthcare') {
      if (query.includes('hospital') || query.includes('doctor') || query.includes('medical')) {
        response = "🏥 **Top 5 Recommended Hospitals:**\n\n⭐ **Premium Care:**\n1. Seattle Children's Hospital\n2. UW Medical Center\n3. Swedish Medical Center\n4. Virginia Mason Medical\n5. Harborview Medical Center\n\n💊 **Services:** Diagnostics, medicines, consultations\n💳 **Payment:** Insurance, cash, online payments\n\n🏥 Need appointment booking or medicine information?";
      } else {
        response = "I can help with healthcare services:\n• Find nearby hospitals\n• Recommend top medical centers\n• Medicine availability\n• Appointment booking\n• Payment processing\n\nWhat healthcare service do you need? 🏥";
      }
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      metadata
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue, sector);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddToCart = () => {
    const cartMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: "🛒 **Item added to cart!**\n\n✅ **Payment Options:**\n• 💳 **Online Payment** - Card/Digital wallet\n• 💵 **Pay at Store** - Hand cash to cashier\n\n🎯 **Next Steps:**\n1. Continue shopping or proceed to checkout\n2. I'll generate your unique QR code after payment\n3. Use QR for store exit verification\n\nWhich payment method would you prefer?",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, cartMessage]);
  };

  const handleGenerateQR = () => {
    const qrCode = `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const qrMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: `🎉 **Payment Successful!**\n\n📱 **Your QR Code:** ${qrCode}\n\n✅ **QR Code Features:**\n• Product verification\n• Payment confirmation\n• Store exit pass\n• Purchase history\n\n💡 **CRM Recommendation:** After checkout, I'll show you better deals at other stores for future visits!\n\nSave this QR code for store exit! 📲`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, qrMessage]);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          AI Assistant
          <Badge variant="secondary" className="ml-auto">
            {sector || 'General'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start gap-2 mb-1">
                  {message.type === 'ai' ? (
                    <Bot className="w-4 h-4 mt-1 text-blue-600" />
                  ) : (
                    <User className="w-4 h-4 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="whitespace-pre-line text-sm">{message.content}</div>
                    <div className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                {/* Action buttons for AI messages */}
                {message.type === 'ai' && message.metadata && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.metadata.location && (
                      <Button size="sm" variant="outline" className="text-xs">
                        <Navigation className="w-3 h-3 mr-1" />
                        Directions
                      </Button>
                    )}
                    {message.metadata.products && (
                      <Button size="sm" variant="outline" className="text-xs" onClick={handleAddToCart}>
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Add to Cart
                      </Button>
                    )}
                    {message.content.includes('Payment Options') && (
                      <Button size="sm" variant="outline" className="text-xs" onClick={handleGenerateQR}>
                        <QrCode className="w-3 h-3 mr-1" />
                        Generate QR
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
