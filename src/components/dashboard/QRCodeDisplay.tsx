
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  QrCode, 
  Check, 
  Download, 
  Share,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';

interface QRCodeData {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    location: string;
  }>;
  totalAmount: number;
  paymentMethod: 'online' | 'cash';
  paymentStatus: 'completed' | 'pending';
  timestamp: Date;
  sector: string;
}

interface QRCodeDisplayProps {
  qrData: QRCodeData;
  onClose: () => void;
}

// Simple QR code placeholder - in production, you'd use a proper QR code library
const QRCodePlaceholder: React.FC<{ data: string }> = ({ data }) => (
  <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mx-auto">
    <div className="text-center">
      <QrCode className="w-16 h-16 mx-auto mb-2 text-gray-400" />
      <p className="text-xs text-gray-500">QR Code</p>
      <p className="text-xs text-gray-400 mt-1">{data}</p>
    </div>
  </div>
);

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrData, onClose }) => {
  const handleDownload = () => {
    // In a real implementation, this would download the QR code image
    console.log('Downloading QR code:', qrData.id);
  };

  const handleShare = () => {
    // In a real implementation, this would share the QR code
    console.log('Sharing QR code:', qrData.id);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Check className="w-5 h-5 text-green-500" />
          Payment Successful!
        </CardTitle>
        <p className="text-sm text-gray-600">Your unique QR code has been generated</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <QRCodePlaceholder data={qrData.id} />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">QR Code ID:</span>
            <Badge variant="secondary">{qrData.id}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Amount:</span>
            <span className="font-semibold">${qrData.totalAmount.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Payment Method:</span>
            <Badge variant={qrData.paymentMethod === 'online' ? 'default' : 'outline'}>
              {qrData.paymentMethod === 'online' ? 'Online' : 'Cash at Store'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <Badge variant={qrData.paymentStatus === 'completed' ? 'default' : 'secondary'}>
              {qrData.paymentStatus === 'completed' ? 'Completed' : 'Pending'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Date & Time:</span>
            <span className="text-sm">{qrData.timestamp.toLocaleString()}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Items Purchased:</h4>
          <div className="space-y-2">
            {qrData.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.name} (x{item.quantity})</p>
                  <p className="text-gray-600 text-xs">📍 {item.location}</p>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-1">✨ QR Code Uses:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Store exit verification</li>
              <li>• Purchase history tracking</li>
              <li>• Product authenticity check</li>
              <li>• Customer support reference</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleShare}>
            <Share className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>

        <Button onClick={onClose} className="w-full">
          Continue Shopping
        </Button>
      </CardContent>
    </Card>
  );
};
