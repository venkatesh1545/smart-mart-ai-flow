
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
  Star,
  Phone,
  Calendar,
  Building
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
    actionButtons?: Array<{
      label: string;
      action: string;
      data?: any;
    }>;
  };
}

interface AIAssistantProps {
  sector: SectorType;
  onAddToCart?: (item: any) => void;
  onViewCart?: () => void;
  onGetDirections?: (location: string) => void;
  onBookAppointment?: (facility: string) => void;
  onApplyToInstitution?: (institution: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  sector,
  onAddToCart,
  onViewCart,
  onGetDirections,
  onBookAppointment,
  onApplyToInstitution
}) => {
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
        return "Hi! I'm your shopping assistant 🛍️\n\nI can help you:\n• Find products with exact locations (like '2nd floor, column 3, line 2')\n• Add items to your cart\n• Process payments (online or cash at store)\n• Generate QR codes for checkout\n• Get store directions\n\nWhat are you looking for today?";
      case 'education':
        return "Hello! I'm your education assistant 🎓\n\nI can help you:\n• Find schools and colleges\n• Compare admission fees and requirements\n• Process application payments\n• Generate student QR codes\n• Get directions to institutions\n\nWhat educational service do you need?";
      case 'healthcare':
        return "Hi there! I'm your healthcare assistant 🏥\n\nI can help you:\n• Find hospitals and clinics\n• Book appointments\n• Locate medicines\n• Process medical payments\n• Generate medical QR codes\n• Get directions to facilities\n\nWhat healthcare service are you looking for?";
      default:
        return "Hello! I'm your AI assistant 🤖\n\nI can help you find various services and facilities in your area. How can I assist you today?";
    }
  };

  const generateAIResponse = (userQuery: string, sector: SectorType): Message => {
    const query = userQuery.toLowerCase();
    let response = "";
    let metadata: any = {};

    if (sector === 'retail') {
      if (query.includes('shirt') || query.includes('clothing') || query.includes('wear')) {
        if (query.includes('party') || query.includes('formal')) {
          response = "🎯 **Found party wear shirts for you!**\n\n📍 **Location:** 2nd floor, Column 3, Line 3\n🏷️ **Section:** Party Wear & Formal Shirts\n💰 **Price Range:** $45 - $85\n⭐ **Top Brands:** Available\n📦 **Stock:** 15+ items in stock\n\n✨ **Featured Items:**\n• Premium Formal Shirt - $65.99 (10% off)\n• Designer Party Wear - $79.99\n• Cotton Blend Formal - $52.99\n\n🛒 Would you like me to add any specific shirts to your cart?";
          metadata = { 
            location: "2nd floor, Column 3, Line 3", 
            products: ["party wear shirts", "formal shirts"],
            actionButtons: [
              { label: "Add Premium Shirt", action: "add_to_cart", data: { name: "Premium Formal Shirt", price: 65.99, location: "2nd floor, Column 3, Line 3" }},
              { label: "Get Directions", action: "directions", data: "2nd floor, Column 3, Line 3" },
              { label: "View All Shirts", action: "browse_category", data: "formal_shirts" }
            ]
          };
        } else {
          response = "👔 **Found shirts section!**\n\n📍 **Location:** 2nd floor, Column 3, Line 2\n🏷️ **Section:** Casual & Regular Shirts\n💰 **Price Range:** $25 - $60\n📦 **Stock:** Well stocked (25+ items)\n\n✨ **Popular Items:**\n• Casual Cotton Shirt - $29.99\n• Business Casual - $45.99\n• Polo Shirt - $32.99\n\n🛒 Ready to add items to cart or need directions?";
          metadata = { 
            location: "2nd floor, Column 3, Line 2", 
            products: ["casual shirts", "regular shirts"],
            actionButtons: [
              { label: "Add Cotton Shirt", action: "add_to_cart", data: { name: "Casual Cotton Shirt", price: 29.99, location: "2nd floor, Column 3, Line 2" }},
              { label: "Get Directions", action: "directions", data: "2nd floor, Column 3, Line 2" },
              { label: "Browse All Shirts", action: "browse_category", data: "shirts" }
            ]
          };
        }
      } else if (query.includes('pants') || query.includes('trouser') || query.includes('jeans')) {
        response = "👖 **Found pants section!**\n\n📍 **Location:** 2nd floor, Column 2, Line 1\n🏷️ **Section:** Pants & Trousers\n💰 **Price Range:** $35 - $70\n📏 **Sizes:** All sizes available (28-42)\n\n✨ **Best Sellers:**\n• Denim Jeans - $45.99\n• Chino Pants - $39.99\n• Dress Trousers - $55.99\n\n🛒 Ready to add to cart or get directions?";
        metadata = { 
          location: "2nd floor, Column 2, Line 1", 
          products: ["pants", "jeans", "trousers"],
          actionButtons: [
            { label: "Add Denim Jeans", action: "add_to_cart", data: { name: "Denim Jeans", price: 45.99, location: "2nd floor, Column 2, Line 1" }},
            { label: "Get Directions", action: "directions", data: "2nd floor, Column 2, Line 1" },
            { label: "Browse All Pants", action: "browse_category", data: "pants" }
          ]
        };
      } else if (query.includes('grocery') || query.includes('food')) {
        response = "🛒 **Grocery section found!**\n\n📍 **Main Location:** Ground floor, Section A\n🥬 **Fresh Produce:** Aisle 1-3\n🥫 **Packaged Foods:** Aisle 4-8\n🥛 **Dairy:** Aisle 9\n🍞 **Bakery:** Aisle 10\n\n💳 **Payment:** Card, Cash, Digital wallets available\n🚚 **Special:** Free home delivery on orders $50+";
        metadata = {
          location: "Ground floor, Section A",
          actionButtons: [
            { label: "Get Directions", action: "directions", data: "Ground floor, Section A" },
            { label: "Browse Groceries", action: "browse_category", data: "groceries" }
          ]
        };
      } else if (query.includes('cart') || query.includes('checkout')) {
        response = "🛒 **Cart & Checkout Information**\n\n✅ **Your options:**\n• View current cart items\n• Proceed to checkout\n• Choose payment method (Online/Cash)\n• Generate QR code after payment\n\n💳 **Payment Methods:**\n• Online: Card, Digital wallets\n• Cash: Pay at store counter\n\n📱 **After checkout, you'll get a unique QR code for:**\n• Store exit verification\n• Purchase tracking\n• Product authenticity\n• Future reference";
        metadata = {
          actionButtons: [
            { label: "View Cart", action: "view_cart" },
            { label: "Continue Shopping", action: "browse_all" }
          ]
        };
      } else {
        response = "I can help you find products in our store! 🏪\n\n🔍 **Try searching for:**\n• Clothing items (shirts, pants, dresses)\n• Electronics & gadgets\n• Groceries & fresh produce\n• Home goods & furniture\n• Makeup & beauty products\n\n📍 I'll provide exact locations like '2nd floor, column 3, line 2' for easy navigation!\n\n🛒 I can also help you add items to cart and process payments. What are you looking for?";
      }
    } else if (sector === 'education') {
      if (query.includes('school') || query.includes('college') || query.includes('university')) {
        response = "🎓 **Top Educational Institutions Found!**\n\n⭐ **Top 5 Recommended:**\n1. **Seattle University** - $45,000/year\n   • 120+ programs • Rating: 4.8/5\n2. **University of Washington** - $38,000/year\n   • 180+ programs • Rating: 4.7/5\n3. **Seattle Pacific University** - $42,000/year\n   • 65+ programs • Rating: 4.6/5\n4. **Cornish College** - $35,000/year\n   • 40+ programs • Rating: 4.5/5\n5. **Seattle Central College** - $15,000/year\n   • 80+ programs • Rating: 4.4/5\n\n📚 **10+ more institutions available**\n\n💰 Need help with admission or payment processing?";
        metadata = { 
          recommendations: ["Seattle University", "UW", "SPU"],
          actionButtons: [
            { label: "View Details", action: "view_details", data: "seattle_university" },
            { label: "Apply Now", action: "apply", data: "seattle_university" },
            { label: "Compare Fees", action: "compare_fees" },
            { label: "Get Directions", action: "directions", data: "Seattle University" }
          ]
        };
      } else if (query.includes('admission') || query.includes('apply')) {
        response = "📋 **Application Process & Requirements**\n\n✅ **Required Documents:**\n• High school transcripts\n• SAT/ACT scores\n• Letters of recommendation\n• Personal essay\n• Application fee payment\n\n💳 **Application Fees:**\n• Most universities: $50-100\n• Community colleges: $25-50\n\n📅 **Deadlines:**\n• Fall semester: March 1st\n• Spring semester: October 1st\n\n🎯 Ready to start your application?";
        metadata = {
          actionButtons: [
            { label: "Start Application", action: "apply", data: "general" },
            { label: "Pay Application Fee", action: "payment", data: "application_fee" },
            { label: "View Requirements", action: "requirements" }
          ]
        };
      } else {
        response = "I can help you with education services! 📚\n\n🔍 **Available Services:**\n• Find schools & colleges\n• Compare tuition fees\n• Application requirements\n• Admission processing\n• Payment assistance\n• Student QR code generation\n\n🎓 What type of education are you looking for? (Elementary, High School, College, University, Trade School)";
      }
    } else if (sector === 'healthcare') {
      if (query.includes('hospital') || query.includes('doctor') || query.includes('medical')) {
        response = "🏥 **Top Healthcare Facilities Found!**\n\n⭐ **Top 5 Recommended:**\n1. **Seattle Children's Hospital**\n   • Specialty: Pediatric Care • Rating: 4.9/5\n2. **UW Medical Center**\n   • Specialty: Multi-specialty • Rating: 4.8/5\n3. **Swedish Medical Center**\n   • Specialty: Cardiology • Rating: 4.7/5\n4. **Virginia Mason Medical**\n   • Specialty: Surgery • Rating: 4.6/5\n5. **Harborview Medical Center**\n   • Specialty: Emergency Care • Rating: 4.5/5\n\n💊 **Services:** Diagnostics, medicines, consultations\n💳 **Payment:** Insurance, cash, online payments\n\n🏥 Need appointment booking or directions?";
        metadata = {
          actionButtons: [
            { label: "Book Appointment", action: "book_appointment", data: "seattle_childrens" },
            { label: "Get Directions", action: "directions", data: "Seattle Children's Hospital" },
            { label: "View Services", action: "view_services" },
            { label: "Emergency Info", action: "emergency_info" }
          ]
        };
      } else if (query.includes('appointment') || query.includes('book')) {
        response = "📅 **Appointment Booking**\n\n🔍 **Available Slots:**\n• Today: 2:00 PM, 4:30 PM\n• Tomorrow: 9:00 AM, 11:30 AM, 3:00 PM\n• This Week: Multiple slots available\n\n💰 **Consultation Fees:**\n• General Physician: $150-200\n• Specialist: $250-400\n• Emergency: $500+\n\n💳 **Payment Options:**\n• Insurance coverage\n• Online payment\n• Cash payment\n\n📱 QR code will be generated after booking confirmation.";
        metadata = {
          actionButtons: [
            { label: "Book Today 2PM", action: "book_appointment", data: "today_2pm" },
            { label: "Book Tomorrow 9AM", action: "book_appointment", data: "tomorrow_9am" },
            { label: "View All Slots", action: "view_slots" },
            { label: "Pay Now", action: "payment", data: "appointment_fee" }
          ]
        };
      } else {
        response = "I can help with healthcare services! 🏥\n\n🔍 **Available Services:**\n• Find nearby hospitals\n• Recommend top medical centers\n• Medicine availability\n• Appointment booking\n• Payment processing\n• Medical QR codes\n\n💊 What healthcare service do you need? (General checkup, Specialist, Emergency, Medicine, etc.)";
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

  const handleActionButton = (action: string, data?: any) => {
    switch (action) {
      case 'add_to_cart':
        if (onAddToCart && data) {
          onAddToCart({
            id: Date.now().toString(),
            name: data.name,
            price: data.price,
            quantity: 1,
            location: data.location
          });
          
          const confirmMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: `✅ **${data.name}** added to cart!\n\n💰 **Price:** $${data.price}\n📍 **Location:** ${data.location}\n\n🛒 **Next Steps:**\n• Continue shopping\n• View cart to checkout\n• Choose payment method\n\nWhat else can I help you find?`,
            timestamp: new Date(),
            metadata: {
              actionButtons: [
                { label: "View Cart", action: "view_cart" },
                { label: "Continue Shopping", action: "continue_shopping" }
              ]
            }
          };
          setMessages(prev => [...prev, confirmMessage]);
        }
        break;
        
      case 'view_cart':
        if (onViewCart) {
          onViewCart();
        }
        break;
        
      case 'directions':
        if (onGetDirections && data) {
          onGetDirections(data);
          const directionsMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: `🧭 **Getting directions to:** ${data}\n\nOpening navigation... You'll be guided step by step to reach your destination!\n\n📱 **Pro tip:** Save this location for future visits.`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, directionsMessage]);
        }
        break;
        
      case 'book_appointment':
        if (onBookAppointment && data) {
          onBookAppointment(data);
          const appointmentMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: `📅 **Appointment booking initiated!**\n\n✅ **Details:**\n• Facility: ${data}\n• Status: Confirming availability\n• QR code will be generated after confirmation\n\n💳 **Payment:** Required after confirmation\n📱 **Reminder:** You'll receive SMS/email confirmation`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, appointmentMessage]);
        }
        break;
        
      case 'apply':
        if (onApplyToInstitution && data) {
          onApplyToInstitution(data);
          const applicationMessage: Message = {
            id: Date.now().toString(),
            type: 'ai',
            content: `📋 **Application process started!**\n\n✅ **Institution:** ${data}\n• Application fee payment required\n• Documents upload portal will open\n• QR code for tracking will be generated\n\n💳 **Next:** Complete payment to proceed`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, applicationMessage]);
        }
        break;
        
      default:
        console.log('Action not implemented:', action, data);
    }
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg ${
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
                
                {message.type === 'ai' && message.metadata?.actionButtons && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.metadata.actionButtons.map((button: any, index: number) => (
                      <Button 
                        key={index}
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleActionButton(button.action, button.data)}
                      >
                        {button.label}
                      </Button>
                    ))}
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
