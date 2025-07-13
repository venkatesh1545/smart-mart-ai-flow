
-- Create enum types for the application
CREATE TYPE public.user_type_enum AS ENUM ('customer', 'b2b');
CREATE TYPE public.sentiment_enum AS ENUM ('positive', 'neutral', 'negative');

-- Users table for comprehensive user management
CREATE TABLE public.users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    preferences JSONB DEFAULT '{}',
    location POINT,
    user_type user_type_enum DEFAULT 'customer',
    crm_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stores table for Walmart locations
CREATE TABLE public.stores (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    location POINT NOT NULL,
    phone VARCHAR(20),
    offers JSONB DEFAULT '[]',
    operating_hours JSONB DEFAULT '{}',
    services JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table for inventory management
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    brand VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(5, 2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    sustainability_score FLOAT DEFAULT 0,
    image_url TEXT,
    barcode VARCHAR(50),
    nutritional_info JSONB DEFAULT '{}',
    attributes JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store inventory linking products to stores
CREATE TABLE public.store_inventory (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    last_restocked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(store_id, product_id)
);

-- Transactions table for purchase tracking
CREATE TABLE public.transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
    products JSONB NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    payment_method VARCHAR(50),
    qr_code VARCHAR(255),
    status VARCHAR(20) DEFAULT 'completed',
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback table for user reviews and sentiment analysis
CREATE TABLE public.feedback (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    sentiment_score FLOAT,
    sentiment sentiment_enum,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loyalty points system
CREATE TABLE public.loyalty (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    tier VARCHAR(20) DEFAULT 'bronze',
    activity JSONB DEFAULT '[]',
    points_earned_total INTEGER DEFAULT 0,
    points_redeemed_total INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers table for B2B functionality
CREATE TABLE public.suppliers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    products JSONB DEFAULT '[]',
    delivery_time INTEGER DEFAULT 7,
    sustainability_score FLOAT DEFAULT 0,
    rating FLOAT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search history for AI improvement
CREATE TABLE public.search_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    search_type VARCHAR(50) DEFAULT 'text',
    results_count INTEGER DEFAULT 0,
    clicked_results JSONB DEFAULT '[]',
    location POINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences for personalization
CREATE TABLE public.user_preferences (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    dietary_restrictions JSONB DEFAULT '[]',
    favorite_brands JSONB DEFAULT '[]',
    favorite_categories JSONB DEFAULT '[]',
    budget_range JSONB DEFAULT '{}',
    sustainability_preference BOOLEAN DEFAULT false,
    notification_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_auth_user_id ON public.users(auth_user_id);
CREATE INDEX idx_stores_location ON public.stores USING GIST(location);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_name ON public.products USING GIN(to_tsvector('english', name));
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX idx_feedback_product_id ON public.feedback(product_id);
CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can create transactions" ON public.transactions
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can view own feedback" ON public.feedback
    FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can create feedback" ON public.feedback
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can view own loyalty" ON public.loyalty
    FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can view own search history" ON public.search_history
    FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can create search history" ON public.search_history
    FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can view own preferences" ON public.user_preferences
    FOR SELECT USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update own preferences" ON public.user_preferences
    FOR ALL USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Public read access for stores and products
CREATE POLICY "Anyone can view stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can view store inventory" ON public.store_inventory FOR SELECT USING (true);
CREATE POLICY "Anyone can view suppliers" ON public.suppliers FOR SELECT USING (true);

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (auth_user_id, name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email
    );
    
    INSERT INTO public.loyalty (user_id)
    VALUES ((SELECT id FROM public.users WHERE auth_user_id = NEW.id));
    
    INSERT INTO public.user_preferences (user_id)
    VALUES ((SELECT id FROM public.users WHERE auth_user_id = NEW.id));
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data for demo
INSERT INTO public.stores (name, address, city, state, zip_code, location, phone, offers, operating_hours, services) VALUES
('Walmart Supercenter - Downtown', '123 Main St', 'Seattle', 'WA', '98101', POINT(-122.3321, 47.6062), '(206) 123-4567', 
 '[{"type": "discount", "description": "10% off groceries", "code": "GROCERY10"}]',
 '{"monday": "6:00-23:00", "tuesday": "6:00-23:00", "wednesday": "6:00-23:00", "thursday": "6:00-23:00", "friday": "6:00-23:00", "saturday": "6:00-23:00", "sunday": "7:00-22:00"}',
 '["pharmacy", "vision_center", "grocery_pickup", "tire_service"]'),
 
('Walmart Neighborhood Market - Capitol Hill', '456 Pine St', 'Seattle', 'WA', '98102', POINT(-122.3207, 47.6205), '(206) 234-5678',
 '[{"type": "discount", "description": "15% off organic products", "code": "ORGANIC15"}]',
 '{"monday": "6:00-22:00", "tuesday": "6:00-22:00", "wednesday": "6:00-22:00", "thursday": "6:00-22:00", "friday": "6:00-22:00", "saturday": "6:00-22:00", "sunday": "7:00-21:00"}',
 '["pharmacy", "grocery_pickup"]'),
 
('Walmart Supercenter - Bellevue', '789 Bellevue Way', 'Bellevue', 'WA', '98004', POINT(-122.2015, 47.6101), '(425) 345-6789',
 '[{"type": "discount", "description": "20% off electronics", "code": "TECH20"}]',
 '{"monday": "6:00-23:00", "tuesday": "6:00-23:00", "wednesday": "6:00-23:00", "thursday": "6:00-23:00", "friday": "6:00-23:00", "saturday": "6:00-23:00", "sunday": "7:00-22:00"}',
 '["pharmacy", "vision_center", "auto_center", "grocery_pickup", "tire_service"]');

-- Insert sample products
INSERT INTO public.products (name, description, category, subcategory, brand, price, discount, stock_quantity, sustainability_score, image_url, barcode, nutritional_info, attributes) VALUES
('Organic Bananas', 'Fresh organic bananas, 2 lbs', 'Grocery', 'Produce', 'Great Value', 2.98, 0, 150, 85.5, '/api/placeholder/300/300', '1234567890123', 
 '{"calories": 105, "fiber": "3g", "potassium": "422mg"}', '{"organic": true, "gluten_free": true, "vegan": true}'),
 
('Almond Milk', 'Unsweetened almond milk, 64 fl oz', 'Grocery', 'Dairy', 'Great Value', 3.24, 10, 80, 78.2, '/api/placeholder/300/300', '2345678901234',
 '{"calories": 40, "protein": "1g", "calcium": "450mg"}', '{"organic": false, "gluten_free": true, "vegan": true, "dairy_free": true}'),
 
('Wireless Bluetooth Headphones', 'Premium sound quality with noise cancellation', 'Electronics', 'Audio', 'onn.', 49.99, 15, 25, 45.3, '/api/placeholder/300/300', '3456789012345',
 '{}', '{"wireless": true, "noise_cancelling": true, "battery_life": "20 hours"}'),
 
('Organic Quinoa', 'Pre-washed organic quinoa, 16 oz', 'Grocery', 'Pantry', 'Great Value', 5.98, 0, 60, 92.1, '/api/placeholder/300/300', '4567890123456',
 '{"calories": 222, "protein": "8g", "fiber": "5g"}', '{"organic": true, "gluten_free": true, "vegan": true, "high_protein": true}'),
 
('Eco-Friendly Cleaning Spray', 'Plant-based all-purpose cleaner, 32 fl oz', 'Household', 'Cleaning', 'Better Homes & Gardens', 4.97, 5, 40, 88.7, '/api/placeholder/300/300', '5678901234567',
 '{}', '{"eco_friendly": true, "plant_based": true, "non_toxic": true});

-- Link products to stores
INSERT INTO public.store_inventory (store_id, product_id, quantity)
SELECT s.id, p.id, (RANDOM() * 100 + 20)::INTEGER
FROM public.stores s
CROSS JOIN public.products p;

-- Insert sample suppliers
INSERT INTO public.suppliers (name, contact_email, contact_phone, address, products, delivery_time, sustainability_score, rating) VALUES
('Walmart Distribution Center', 'orders@walmart.com', '(800) 925-6278', '123 Distribution Way, Kent, WA 98032', 
 '[{"category": "grocery", "bulk_discount": 15}, {"category": "electronics", "bulk_discount": 10}]', 3, 75.5, 4.5),
 
('Green Supply Co', 'contact@greensupply.com', '(206) 555-0123', '456 Eco Drive, Seattle, WA 98103',
 '[{"category": "organic", "bulk_discount": 20}, {"category": "household", "bulk_discount": 12}]', 5, 95.2, 4.8);
