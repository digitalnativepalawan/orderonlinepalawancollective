
-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Others',
  price NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'pack',
  inventory INTEGER NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT '',
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete products" ON public.products FOR DELETE USING (true);

-- Orders table
CREATE TABLE public.orders (
  id TEXT NOT NULL PRIMARY KEY,
  date TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  customer TEXT NOT NULL DEFAULT 'Guest',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  country_code TEXT NOT NULL DEFAULT '+63',
  delivery_type TEXT NOT NULL DEFAULT 'pickup',
  notes TEXT NOT NULL DEFAULT '',
  contact TEXT NOT NULL DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders are publicly readable" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete orders" ON public.orders FOR DELETE USING (true);

-- Business settings table (single row)
CREATE TABLE public.business_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL DEFAULT 'Jaycee''s Pantry',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  facebook TEXT NOT NULL DEFAULT '',
  instagram TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  logo_base64 TEXT NOT NULL DEFAULT '',
  whatsapp_template TEXT NOT NULL DEFAULT 'Hello {name}, your order #{id} is {status}. Total: ₱{total}. Thank you!',
  invoice_footer TEXT NOT NULL DEFAULT 'Thank you for your order! For inquiries, contact us.',
  tax_rate NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are publicly readable" ON public.business_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert settings" ON public.business_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update settings" ON public.business_settings FOR UPDATE USING (true);

-- Insert default business settings row
INSERT INTO public.business_settings (business_name, phone, email, facebook, instagram, address, whatsapp_template, invoice_footer, tax_rate)
VALUES ('Jaycee''s Pantry', '09917093792', 'jayceepantry@gmail.com', 'Jaycee Trading And Services', '@jaycee.tradingservices', 'For orders and inquiries', 'Hello {name}, your order #{id} is {status}. Total: ₱{total}. Thank you!', 'Thank you for your order! For inquiries, contact us.', 0);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_business_settings_updated_at BEFORE UPDATE ON public.business_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
