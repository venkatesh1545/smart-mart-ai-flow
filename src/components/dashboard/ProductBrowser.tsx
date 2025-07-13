
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ShoppingCart, 
  Star, 
  Filter,
  Grid3X3,
  List,
  ArrowLeft
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discount?: number;
  rating: number;
  image: string;
  location: string;
  inStock: boolean;
}

interface ProductBrowserProps {
  storeName: string;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
}

const sampleProducts: Product[] = [
  // Clothing
  { id: "1", name: "Casual Cotton Shirt", category: "Clothing", price: 29.99, rating: 4.5, image: "/api/placeholder/200/200", location: "2nd floor, Column 3, Line 2", inStock: true },
  { id: "2", name: "Party Wear Formal Shirt", category: "Clothing", price: 65.99, discount: 10, rating: 4.7, image: "/api/placeholder/200/200", location: "2nd floor, Column 3, Line 3", inStock: true },
  { id: "3", name: "Denim Jeans", category: "Clothing", price: 45.99, rating: 4.3, image: "/api/placeholder/200/200", location: "2nd floor, Column 2, Line 1", inStock: true },
  { id: "4", name: "Summer Dress", category: "Clothing", price: 39.99, rating: 4.6, image: "/api/placeholder/200/200", location: "2nd floor, Column 4, Line 1", inStock: true },
  
  // Groceries
  { id: "5", name: "Fresh Bananas", category: "Groceries", price: 2.99, rating: 4.4, image: "/api/placeholder/200/200", location: "Ground floor, Section A, Aisle 1", inStock: true },
  { id: "6", name: "Whole Milk", category: "Groceries", price: 3.49, rating: 4.2, image: "/api/placeholder/200/200", location: "Ground floor, Section A, Aisle 9", inStock: true },
  { id: "7", name: "Bread Loaf", category: "Groceries", price: 2.79, rating: 4.1, image: "/api/placeholder/200/200", location: "Ground floor, Section A, Aisle 5", inStock: true },
  
  // Electronics
  { id: "8", name: "Wireless Headphones", category: "Electronics", price: 89.99, discount: 15, rating: 4.8, image: "/api/placeholder/200/200", location: "1st floor, Section B, Display 3", inStock: true },
  { id: "9", name: "Smartphone Charger", category: "Electronics", price: 19.99, rating: 4.3, image: "/api/placeholder/200/200", location: "1st floor, Section B, Display 1", inStock: true },
  
  // Home Items
  { id: "10", name: "Coffee Maker", category: "Home Items", price: 129.99, discount: 20, rating: 4.6, image: "/api/placeholder/200/200", location: "3rd floor, Section C, Row 2", inStock: true },
  { id: "11", name: "Bed Sheets Set", category: "Home Items", price: 49.99, rating: 4.4, image: "/api/placeholder/200/200", location: "3rd floor, Section C, Row 5", inStock: true },
  
  // Makeup Products
  { id: "12", name: "Foundation", category: "Makeup", price: 34.99, rating: 4.5, image: "/api/placeholder/200/200", location: "Ground floor, Beauty Counter", inStock: true },
  { id: "13", name: "Lipstick Set", category: "Makeup", price: 24.99, rating: 4.7, image: "/api/placeholder/200/200", location: "Ground floor, Beauty Counter", inStock: true }
];

export const ProductBrowser: React.FC<ProductBrowserProps> = ({ 
  storeName, 
  onAddToCart, 
  onBack 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', ...Array.from(new Set(sampleProducts.map(p => p.category)))];
  
  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
  };

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Browse Products - {storeName}</h2>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {filteredProducts.map((product) => {
          const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
          
          return (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{product.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600">📍 {product.location}</p>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    {product.discount ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">
                          ${discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-sm line-through text-gray-500">
                          ${product.price.toFixed(2)}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {product.discount}% OFF
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  <Badge variant={product.inStock ? 'default' : 'secondary'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className="w-full"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No products found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
