-- ==============================================================================
-- ASF RSU 45TH JUBILEE HOMECOMING: SPONSORSHIP PAYMENTS & DONATIONS TABLE
-- Stores contributions across the 4 distinct fundraising pillars and corporate tiers
-- ==============================================================================

CREATE TABLE IF NOT EXISTS sponsorship_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'NGN',
  pillar_key TEXT NOT NULL, -- 'celebration' | 'homecoming' | 'trust_fund' | 'centre_of_influence' | 'corporate_tiers'
  pillar_name TEXT,
  tier_key TEXT,
  tier_name TEXT,
  donor_name TEXT NOT NULL,
  organization TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  alumni_set TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  message_note TEXT,
  payment_method TEXT NOT NULL, -- 'Paystack Online Gateway' | 'Direct Bank Transfer (Ecobank)'
  status TEXT DEFAULT 'VERIFIED', -- 'VERIFIED' | 'PENDING_BANK_RECONCILIATION'
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE sponsorship_payments ENABLE ROW LEVEL SECURITY;

-- Security Policies for public donation checkout and Secretariat admin management
CREATE POLICY "Allow public insert to sponsorship_payments" 
  ON sponsorship_payments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read to sponsorship_payments" 
  ON sponsorship_payments FOR SELECT USING (true);

CREATE POLICY "Allow public update to sponsorship_payments" 
  ON sponsorship_payments FOR UPDATE USING (true);

CREATE POLICY "Allow public delete to sponsorship_payments" 
  ON sponsorship_payments FOR DELETE USING (true);

-- Indexes for lightning-fast progress calculation and reporting
CREATE INDEX IF NOT EXISTS idx_sponsorship_payments_pillar ON sponsorship_payments (pillar_key);
CREATE INDEX IF NOT EXISTS idx_sponsorship_payments_ref ON sponsorship_payments (reference);
CREATE INDEX IF NOT EXISTS idx_sponsorship_payments_status ON sponsorship_payments (status);
CREATE INDEX IF NOT EXISTS idx_sponsorship_payments_created ON sponsorship_payments (created_at DESC);
