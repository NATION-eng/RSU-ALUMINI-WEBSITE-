-- ==============================================================================
-- ASF RSU 45TH JUBILEE HOMECOMING: COMPENDIUM AD BOOKINGS TABLE
-- Table to collect, track, review, and print-manage compendium advertisements
-- ==============================================================================

CREATE TABLE IF NOT EXISTS compendium_ad_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_reference TEXT UNIQUE NOT NULL,
  advertiser_name TEXT NOT NULL,
  company_name TEXT,
  brand_headline TEXT,
  ad_tier_key TEXT NOT NULL,
  ad_tier_name TEXT NOT NULL,
  ad_dimensions TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'NGN',
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  alumni_set TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  artwork_option TEXT DEFAULT 'UPLOAD_READY', -- 'UPLOAD_READY' | 'DESIGN_ASSISTANCE' | 'PENDING_FILE'
  artwork_url TEXT,
  artwork_file_name TEXT,
  artwork_file_size NUMERIC,
  message_note TEXT,
  payment_method TEXT NOT NULL, -- 'Paystack Online Gateway' | 'Direct Bank Transfer (Ecobank)'
  payment_status TEXT DEFAULT 'VERIFIED', -- 'VERIFIED' | 'PENDING_BANK_RECONCILIATION'
  editorial_status TEXT DEFAULT 'RECEIVED', -- 'RECEIVED' | 'IN_REVIEW' | 'PROOF_READY' | 'APPROVED_FOR_PRINT' | 'PRINTED'
  assigned_page_number TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE compendium_ad_bookings ENABLE ROW LEVEL SECURITY;

-- Security Policies for public frontend booking and Secretariat management
CREATE POLICY "Allow public insert to compendium_ad_bookings" 
  ON compendium_ad_bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read to compendium_ad_bookings" 
  ON compendium_ad_bookings FOR SELECT USING (true);

CREATE POLICY "Allow public update to compendium_ad_bookings" 
  ON compendium_ad_bookings FOR UPDATE USING (true);

CREATE POLICY "Allow public delete to compendium_ad_bookings" 
  ON compendium_ad_bookings FOR DELETE USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_compendium_ads_ref ON compendium_ad_bookings (booking_reference);
CREATE INDEX IF NOT EXISTS idx_compendium_ads_tier ON compendium_ad_bookings (ad_tier_key);
CREATE INDEX IF NOT EXISTS idx_compendium_ads_status ON compendium_ad_bookings (editorial_status);
CREATE INDEX IF NOT EXISTS idx_compendium_ads_created ON compendium_ad_bookings (created_at DESC);
