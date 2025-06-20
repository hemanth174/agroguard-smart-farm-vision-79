
-- Create products table for shopping functionality
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart table for shopping cart functionality
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id UUID REFERENCES public.products NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table for payment tracking
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, cancelled
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table for order details
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders NOT NULL,
  product_id UUID REFERENCES public.products NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video_guides table for multilingual tutorials
CREATE TABLE public.video_guides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  language TEXT NOT NULL,
  category TEXT,
  duration TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plant_diseases table for plant health detection
CREATE TABLE public.plant_diseases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  disease_name TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  symptoms TEXT[] NOT NULL,
  solutions TEXT[] NOT NULL,
  severity TEXT NOT NULL, -- low, medium, high
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agri_contracts table for farming contracts
CREATE TABLE public.agri_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  posted_by UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  payment_amount DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'open', -- open, assigned, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contract_applications table
CREATE TABLE public.contract_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES public.agri_contracts NOT NULL,
  applicant_id UUID REFERENCES auth.users NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(contract_id, applicant_id)
);

-- Create emergency_reports table
CREATE TABLE public.emergency_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  report_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  status TEXT NOT NULL DEFAULT 'open', -- open, in_progress, resolved
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create soil_test_results table for IoT soil testing
CREATE TABLE public.soil_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  field_location TEXT,
  moisture_level DECIMAL(5,2),
  ph_level DECIMAL(4,2),
  nitrogen_level DECIMAL(6,2),
  phosphorus_level DECIMAL(6,2),
  potassium_level DECIMAL(6,2),
  recommendations TEXT[],
  test_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agri_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_test_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products (public read)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- Create RLS policies for cart_items
CREATE POLICY "Users can view their own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert to their own cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from their own cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for order_items
CREATE POLICY "Users can view their order items" ON public.order_items 
FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Create RLS policies for video_guides (public read)
CREATE POLICY "Anyone can view video guides" ON public.video_guides FOR SELECT USING (true);

-- Create RLS policies for plant_diseases (public read)
CREATE POLICY "Anyone can view plant diseases" ON public.plant_diseases FOR SELECT USING (true);

-- Create RLS policies for agri_contracts
CREATE POLICY "Anyone can view contracts" ON public.agri_contracts FOR SELECT USING (true);
CREATE POLICY "Users can create contracts" ON public.agri_contracts FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Contract owners can update" ON public.agri_contracts FOR UPDATE USING (auth.uid() = posted_by);

-- Create RLS policies for contract_applications
CREATE POLICY "Users can view applications for their contracts" ON public.contract_applications 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.agri_contracts WHERE agri_contracts.id = contract_applications.contract_id AND agri_contracts.posted_by = auth.uid())
  OR auth.uid() = applicant_id
);
CREATE POLICY "Users can apply to contracts" ON public.contract_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);

-- Create RLS policies for emergency_reports
CREATE POLICY "Users can view their own reports" ON public.emergency_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reports" ON public.emergency_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for soil_test_results
CREATE POLICY "Users can view their own soil tests" ON public.soil_test_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create soil tests" ON public.soil_test_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample data for products
INSERT INTO public.products (name, description, price, category, image_url) VALUES
('Premium Seeds', 'High-quality hybrid seeds for maximum yield', 500.00, 'Seeds', '/placeholder.svg'),
('Organic Fertilizer', 'Natural fertilizer for healthy crop growth', 800.00, 'Fertilizers', '/placeholder.svg'),
('Electric Sprayer', 'Battery-powered sprayer for pesticides', 3500.00, 'Tools', '/placeholder.svg'),
('Soil Testing Kit', 'Complete kit for soil analysis', 2200.00, 'Testing', '/placeholder.svg'),
('Rain Sensors', 'IoT sensors for rainfall monitoring', 1800.00, 'IoT', '/placeholder.svg'),
('Vermicompost', 'Organic compost for soil enrichment', 400.00, 'Fertilizers', '/placeholder.svg'),
('Mulching Sheets', 'Protective sheets for moisture retention', 150.00, 'Materials', '/placeholder.svg'),
('Drip Irrigation Kit', 'Complete irrigation system', 5000.00, 'Irrigation', '/placeholder.svg');

-- Insert sample video guides
INSERT INTO public.video_guides (title, description, video_url, language, category, duration, thumbnail_url) VALUES
('Modern Irrigation Techniques', 'Learn efficient water management', 'https://youtube.com/watch?v=example1', 'en', 'Irrigation', '15:30', '/placeholder.svg'),
('आधुनिक सिंचाई तकनीक', 'पानी का कुशल प्रबंधन सीखें', 'https://youtube.com/watch?v=example2', 'hi', 'Irrigation', '15:30', '/placeholder.svg'),
('ఆధునిక నీటిపారుదల పద్ధతులు', 'సమర్థవంతమైన నీటి నిర్వహణ నేర్చుకోండి', 'https://youtube.com/watch?v=example3', 'te', 'Irrigation', '15:30', '/placeholder.svg'),
('Organic Farming Methods', 'Sustainable farming practices', 'https://youtube.com/watch?v=example4', 'en', 'Organic', '12:45', '/placeholder.svg'),
('Crop Disease Prevention', 'Protect your crops from diseases', 'https://youtube.com/watch?v=example5', 'en', 'Health', '18:20', '/placeholder.svg'),
('फसल रोग की रोकथाम', 'अपनी फसलों को बीमारियों से बचाएं', 'https://youtube.com/watch?v=example6', 'hi', 'Health', '18:20', '/placeholder.svg'),
('Pest Control Strategies', 'Effective pest management', 'https://youtube.com/watch?v=example7', 'en', 'Pest Control', '16:50', '/placeholder.svg'),
('How to Use Drone for Sowing', 'Modern sowing with drone technology', 'https://youtube.com/watch?v=example8', 'en', 'Technology', '19:45', '/placeholder.svg');

-- Insert sample plant diseases
INSERT INTO public.plant_diseases (disease_name, crop_type, symptoms, solutions, severity, image_url) VALUES
('Leaf Blight', 'Rice', ARRAY['Brown spots on leaves', 'Yellowing of leaves', 'Reduced grain filling'], ARRAY['Apply fungicide', 'Improve drainage', 'Remove infected plants'], 'high', '/placeholder.svg'),
('Powdery Mildew', 'Wheat', ARRAY['White powdery coating on leaves', 'Stunted growth', 'Reduced yield'], ARRAY['Apply sulfur-based fungicide', 'Ensure proper air circulation', 'Use resistant varieties'], 'medium', '/placeholder.svg'),
('Root Rot', 'Cotton', ARRAY['Wilting plants', 'Brown roots', 'Poor growth'], ARRAY['Improve soil drainage', 'Use disease-free seeds', 'Apply fungicide treatment'], 'high', '/placeholder.svg'),
('Aphid Infestation', 'Sugarcane', ARRAY['Curled leaves', 'Sticky honeydew', 'Yellowing plants'], ARRAY['Use insecticidal soap', 'Introduce beneficial insects', 'Regular monitoring'], 'low', '/placeholder.svg');
