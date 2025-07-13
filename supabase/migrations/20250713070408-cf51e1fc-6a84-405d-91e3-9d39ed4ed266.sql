
-- Create users table for additional user information
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  services JSONB DEFAULT '[]',
  offers JSONB DEFAULT '[]',
  latitude DECIMAL,
  longitude DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  discount DECIMAL DEFAULT 0,
  image_url TEXT,
  sustainability_score DECIMAL,
  attributes JSONB DEFAULT '{}',
  store_id UUID REFERENCES public.stores(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create search_history table
CREATE TABLE public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  query TEXT NOT NULL,
  search_type TEXT DEFAULT 'text',
  results_count INTEGER DEFAULT 0,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (auth.uid() = auth_user_id);

-- RLS Policies for stores (public read access)
CREATE POLICY "Anyone can view stores" 
  ON public.stores 
  FOR SELECT 
  USING (true);

-- RLS Policies for products (public read access)
CREATE POLICY "Anyone can view products" 
  ON public.products 
  FOR SELECT 
  USING (true);

-- RLS Policies for search_history
CREATE POLICY "Users can view their own search history" 
  ON public.search_history 
  FOR SELECT 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert their own search history" 
  ON public.search_history 
  FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Insert some sample data
INSERT INTO public.stores (name, address, city, state, zip_code, phone, services, offers) VALUES
('Walmart Supercenter', '123 Main St', 'Seattle', 'WA', '98101', '(206) 555-0123', '["grocery", "pharmacy", "auto_service"]', '[{"description": "20% off electronics", "expires": "2024-01-31"}]'),
('Walmart Neighborhood Market', '456 Pine St', 'Seattle', 'WA', '98102', '(206) 555-0456', '["grocery", "pharmacy"]', '[]'),
('Walmart Supercenter', '789 Oak Ave', 'Bellevue', 'WA', '98004', '(425) 555-0789', '["grocery", "pharmacy", "auto_service", "tire_center"]', '[{"description": "Buy 2 Get 1 Free on select items", "expires": "2024-02-15"}]');

INSERT INTO public.products (name, brand, category, description, price, discount, image_url, sustainability_score, attributes) VALUES
('Organic Bananas', 'Great Value', 'Produce', 'Fresh organic bananas', 2.98, 0, '/api/placeholder/300/300', 85, '{"organic": true, "local": false}'),
('Wireless Headphones', 'Apple', 'Electronics', 'AirPods Pro with noise cancellation', 249.99, 15, '/api/placeholder/300/300', 60, '{"wireless": true, "noise_cancelling": true}'),
('Eco-Friendly Detergent', 'Seventh Generation', 'Household', 'Plant-based laundry detergent', 12.99, 10, '/api/placeholder/300/300', 92, '{"eco_friendly": true, "plant_based": true}'),
('Greek Yogurt', 'Chobani', 'Dairy', 'Non-fat Greek yogurt', 5.99, 0, '/api/placeholder/300/300', 70, '{"protein_rich": true, "probiotic": true}'),
('Reusable Water Bottle', 'Hydro Flask', 'Sports', 'Stainless steel water bottle', 39.99, 20, '/api/placeholder/300/300', 88, '{"reusable": true, "bpa_free": true}'),
('Smart TV', 'Samsung', 'Electronics', '55-inch 4K Smart TV', 649.99, 25, '/api/placeholder/300/300', 55, '{"smart": true, "4k": true}');
