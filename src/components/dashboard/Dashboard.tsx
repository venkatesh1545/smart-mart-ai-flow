
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AISearchBar } from '@/components/search/AISearchBar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MapPin, 
  Star, 
  Clock, 
  Truck, 
  ShoppingBag, 
  Leaf, 
  Percent,
  Navigation,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  services: any[] | null;
  offers: any[] | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
  relevanceScore?: number;
}

interface Product {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  description: string | null;
  price: number;
  discount: number | null;
  image_url: string | null;
  sustainability_score: number | null;
  attributes: any;
  store_id: string | null;
  created_at: string;
  updated_at: string;
  relevanceScore?: number;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<{stores: Store[]; products: Product[]}>({
    stores: [],
    products: []
  });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [storesResponse, productsResponse] = await Promise.all([
        supabase.from('stores').select('*').limit(6),
        supabase.from('products').select('*').limit(12)
      ]);

      if (storesResponse.data) setStores(storesResponse.data as Store[]);
      if (productsResponse.data) setProducts(productsResponse.data as Product[]);
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string, location?: { lat: number; lon: number }) => {
    setLoading(true);
    setIsSearchActive(true);
    
    try {
      console.log('AI Search Query:', query);
      console.log('User Location:', location);

      // Save search history if user is authenticated
      if (user) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('auth_user_id', user.id)
            .maybeSingle();

          if (userData) {
            await supabase.from('search_history').insert({
              user_id: userData.id,
              query: query,
              search_type: 'text',
              results_count: 0
            });
          }
        } catch (searchHistoryError) {
          console.log('Search history save failed:', searchHistoryError);
          // Don't block search if history save fails
        }
      }

      // Search stores and products
      const [storesResponse, productsResponse] = await Promise.all([
        supabase
          .from('stores')
          .select('*')
          .or(`name.ilike.%${query}%,city.ilike.%${query}%`),
        supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${query}%,category.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
      ]);

      const searchStores = (storesResponse.data || []) as Store[];
      const searchProducts = (productsResponse.data || []) as Product[];

      // AI-enhanced search results (simulate intelligent ranking)
      const enhancedStores = searchStores
        .map(store => ({
          ...store,
          relevanceScore: calculateStoreRelevance(store, query, location)
        }))
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

      const enhancedProducts = searchProducts
        .map(product => ({
          ...product,
          relevanceScore: calculateProductRelevance(product, query)
        }))
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

      setSearchResults({
        stores: enhancedStores,
        products: enhancedProducts
      });

      toast.success(`Found ${enhancedStores.length} stores and ${enhancedProducts.length} products`);
    } catch (error) {
      toast.error('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStoreRelevance = (store: Store, query: string, location?: { lat: number; lon: number }) => {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    // Name match
    if (store.name.toLowerCase().includes(queryLower)) score += 10;
    
    // Services match
    if (store.services && Array.isArray(store.services) && store.services.some((service: any) => 
      typeof service === 'string' && service.toLowerCase().includes(queryLower))) {
      score += 8;
    }
    
    // Has offers
    if (store.offers && Array.isArray(store.offers) && store.offers.length > 0) score += 3;
    
    // Location bonus (simulate proximity)
    if (location) score += 5;
    
    return score;
  };

  const calculateProductRelevance = (product: Product, query: string) => {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    // Exact name match
    if (product.name.toLowerCase().includes(queryLower)) score += 10;
    
    // Category match
    if (product.category.toLowerCase().includes(queryLower)) score += 7;
    
    // Brand match
    if (product.brand && product.brand.toLowerCase().includes(queryLower)) score += 5;
    
    // Sustainability bonus
    if (product.sustainability_score && product.sustainability_score > 80) score += 3;
    
    // Discount bonus
    if (product.discount && product.discount > 0) score += 2;
    
    return score;
  };

  const clearSearch = () => {
    setIsSearchActive(false);
    setSearchResults({ stores: [], products: [] });
  };

  const formatPrice = (price: number, discount: number = 0) => {
    const discountedPrice = price * (1 - discount / 100);
    return {
      original: price.toFixed(2),
      final: discountedPrice.toFixed(2),
      hasDiscount: discount > 0
    };
  };

  if (loading && !isSearchActive) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading your personalized experience...</p>
        </div>
      </div>
    );
  }

  const displayStores = isSearchActive ? searchResults.stores : stores;
  const displayProducts = isSearchActive ? searchResults.products : products;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Valued Customer'}! 👋
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Discover personalized products, find nearby stores, and enjoy AI-powered shopping
          </p>
          <AISearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Search Results Header */}
      {isSearchActive && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
            <p className="text-gray-600">
              Found {displayStores.length} stores and {displayProducts.length} products
            </p>
          </div>
          <Button variant="outline" onClick={clearSearch}>
            View All Products
          </Button>
        </div>
      )}

      {/* Stores Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isSearchActive ? 'Matching Stores' : 'Nearby Walmart Stores'}
          </h2>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <MapPin className="w-3 h-3 mr-1" />
            Seattle Area
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStores.map((store) => (
            <Card key={store.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{store.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {store.address}, {store.city}
                    </CardDescription>
                  </div>
                  {store.offers && Array.isArray(store.offers) && store.offers.length > 0 && (
                    <Badge className="bg-red-100 text-red-700">
                      <Percent className="w-3 h-3 mr-1" />
                      Offers
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {store.phone}
                </div>
                
                {store.services && Array.isArray(store.services) && store.services.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {store.services.slice(0, 3).map((service: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {typeof service === 'string' ? service.replace('_', ' ') : String(service)}
                      </Badge>
                    ))}
                    {store.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{store.services.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {store.offers && Array.isArray(store.offers) && store.offers.length > 0 && (
                  <div className="bg-yellow-50 p-2 rounded-lg">
                    <p className="text-xs text-yellow-800 font-medium">
                      🎯 {(store.offers[0] as any)?.description || 'Special offer available'}
                    </p>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Navigation className="w-4 h-4 mr-1" />
                    Directions
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Clock className="w-4 h-4 mr-1" />
                    Hours
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isSearchActive ? 'Matching Products' : 'Recommended for You'}
          </h2>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Leaf className="w-3 h-3 mr-1" />
            Eco-Friendly Options
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => {
            const pricing = formatPrice(product.price, product.discount || 0);
            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow group">
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={product.image_url || '/api/placeholder/300/300'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${pricing.final}
                        </span>
                        {pricing.hasDiscount && (
                          <span className="text-sm text-gray-500 line-through">
                            ${pricing.original}
                          </span>
                        )}
                      </div>
                      {pricing.hasDiscount && (
                        <Badge className="bg-red-100 text-red-700 text-xs">
                          {product.discount}% OFF
                        </Badge>
                      )}
                    </div>
                    
                    {product.sustainability_score && product.sustainability_score > 70 && (
                      <div className="flex items-center">
                        <Leaf className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600 ml-1">
                          {product.sustainability_score.toFixed(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {product.attributes && typeof product.attributes === 'object' && 
                      Object.entries(product.attributes as Record<string, any>)
                        .filter(([_, value]) => value === true)
                        .slice(0, 2)
                        .map(([key, _]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key.replace('_', ' ')}
                          </Badge>
                        ))}
                  </div>

                  <Button className="w-full" size="sm">
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-gray-50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <Truck className="w-6 h-6" />
            <span className="text-sm">Track Order</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <Star className="w-6 h-6" />
            <span className="text-sm">My Reviews</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <MapPin className="w-6 h-6" />
            <span className="text-sm">Store Locator</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <Percent className="w-6 h-6" />
            <span className="text-sm">My Offers</span>
          </Button>
        </div>
      </section>
    </div>
  );
};
