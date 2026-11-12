import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'ibergysewvwrbfeatoul';
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;

// Default public anon key or fallback from environment
let currentSupabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(customKey?: string): SupabaseClient | null {
  const keyToUse = customKey || currentSupabaseKey;
  if (!keyToUse) {
    return null;
  }

  if (!supabaseClient || customKey) {
    supabaseClient = createClient(SUPABASE_URL, keyToUse, {
      auth: {
        persistSession: false
      }
    });
  }

  return supabaseClient;
}

export function updateSupabaseKey(newKey: string) {
  currentSupabaseKey = newKey.trim();
  if (currentSupabaseKey) {
    supabaseClient = createClient(SUPABASE_URL, currentSupabaseKey, {
      auth: { persistSession: false }
    });
  } else {
    supabaseClient = null;
  }
}

export interface SupabaseOrderRow {
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  state: string;
  pincode: string;
  items: any;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total_amount: number;
  payment_method: string;
  status: string;
  order_date: string;
}

/**
 * Transforms an application OrderDetails object into a Supabase table row
 */
export function mapOrderToSupabase(orderData: any): SupabaseOrderRow {
  return {
    order_id: orderData.orderId,
    customer_name: orderData.customer?.fullName || 'Customer',
    customer_email: orderData.customer?.email || '',
    customer_phone: orderData.customer?.phone || '',
    shipping_address: orderData.customer?.address || '',
    city: orderData.customer?.city || '',
    state: orderData.customer?.state || '',
    pincode: orderData.customer?.pincode || '',
    items: orderData.items || [],
    subtotal: Number(orderData.subtotal) || 0,
    discount: Number(orderData.discount) || 0,
    shipping_fee: Number(orderData.shipping) || 0,
    total_amount: Number(orderData.total) || 0,
    payment_method: orderData.paymentMethod || 'COD',
    status: orderData.status || 'Pending',
    order_date: orderData.orderDate || new Date().toISOString()
  };
}

export const SUPABASE_ORDERS_TABLE_SQL = `-- Run this in your Supabase SQL Editor (Project: ibergysewvwrbfeatoul)
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  pincode TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'COD',
  status TEXT DEFAULT 'Pending',
  order_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table in Supabase
CREATE TABLE IF NOT EXISTS customers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  city TEXT,
  state TEXT,
  total_orders INT DEFAULT 1,
  total_spent NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous inserts for storefront orders
CREATE POLICY "Allow public order placement" 
ON orders FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow authenticated owner to read orders
CREATE POLICY "Allow owner to view orders" 
ON orders FOR SELECT 
TO anon, authenticated 
USING (true);
`;
