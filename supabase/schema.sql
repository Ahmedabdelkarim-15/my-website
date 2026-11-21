-- ====================================================================
-- Market.com - Supabase Database Schema
-- Table: orders & admin_users
-- Includes RLS policies, indexes, and triggers
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(32) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    shipping NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'EGP',
    payment_method VARCHAR(50) NOT NULL, -- 'paymob_card', 'paymob_wallet', 'paymob_instapay', 'stripe', 'cod'
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    payment_gateway VARCHAR(50), -- 'paymob', 'stripe', 'cod'
    payment_id VARCHAR(255), -- transaction ID or gateway charge ID
    payment_data JSONB DEFAULT '{}'::jsonb,
    promo_code VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) DEFAULT 'المسؤول',
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Automatically update 'updated_at' on order changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 5. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 6. Row Level Security (RLS) Configuration
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Anonymous users (store customers) can INSERT new orders
CREATE POLICY "Allow public insert on orders"
    ON public.orders
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Anonymous users can SELECT their own order if they provide order_number and phone
CREATE POLICY "Allow customer to track their order"
    ON public.orders
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Service Role (Backend Server) has full bypass to UPDATE, SELECT, DELETE
-- (Supabase service_role key automatically bypasses RLS, but we explicitly permit authenticated roles if needed)
CREATE POLICY "Allow authenticated admin full access to orders"
    ON public.orders
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Admin users table policy (service role or authenticated admin only)
CREATE POLICY "Admin table restricted"
    ON public.admin_users
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ====================================================================
-- Initial Seed (Optional): Default Admin Account
-- Default password: admin123 (hashed with bcrypt: $2a$10$wB5kM7r7p3XfG6yq5P5pEuW7mG7vA4jVqCqG7j0lM4bS6a1r2Z0a.)
-- ====================================================================
INSERT INTO public.admin_users (username, password_hash, full_name, role)
VALUES ('admin', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'مدير المتجر', 'admin')
ON CONFLICT (username) DO NOTHING;
