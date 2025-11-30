-- # Create Users and Subscriptions Schema
--
-- ## Overview
-- This migration sets up the core database structure for Hook.ai
--
-- ## New Tables
-- 1. user_profiles - Extended user information
-- 2. subscription_tiers - Available subscription plans
-- 3. user_subscriptions - User subscription tracking
-- 4. usage_tracking - Monthly usage tracking
-- 5. generated_images - Image generation history
--
-- ## Security
-- All tables have RLS enabled with appropriate policies

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create subscription_tiers table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  thumbnails_per_month integer NOT NULL,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  stripe_price_id text,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active tiers"
  ON subscription_tiers FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  tier_id uuid REFERENCES subscription_tiers(id) NOT NULL,
  status text NOT NULL DEFAULT 'trial',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_status CHECK (status IN ('active', 'canceled', 'expired', 'trial'))
);

ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);

-- Create usage_tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  month date NOT NULL,
  thumbnails_generated integer DEFAULT 0 NOT NULL,
  magic_edits_used integer DEFAULT 0 NOT NULL,
  upscales_used integer DEFAULT 0 NOT NULL,
  background_removals_used integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, month)
);

ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage"
  ON usage_tracking FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON usage_tracking FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON usage_tracking FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_month ON usage_tracking(user_id, month);

-- Create generated_images table
CREATE TABLE IF NOT EXISTS generated_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  prompt text,
  style text,
  aspect_ratio text,
  operation_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_operation CHECK (operation_type IN ('generate', 'magic_edit', 'upscale', 'remove_bg', 'upload'))
);

ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own images"
  ON generated_images FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own images"
  ON generated_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own images"
  ON generated_images FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_generated_images_user_created ON generated_images(user_id, created_at DESC);

-- Insert default subscription tiers
INSERT INTO subscription_tiers (name, price, thumbnails_per_month, features) VALUES
  ('Free Trial', 0, 5, '["Watermarked thumbnails", "HD upscaling", "Basic background removal", "Try without credit card"]'::jsonb),
  ('Basic', 15, 30, '["HD thumbnail generation", "Background removal", "HD upscaling", "AI style suggestions", "Limited batch processing"]'::jsonb),
  ('Pro', 25, 100, '["4K thumbnail generation", "Advanced background removal", "4K upscaling", "AI style variations", "Batch uploads", "Priority support"]'::jsonb),
  ('Agency', 59, 300, '["4K+ thumbnail generation", "Unlimited style variations", "Full batch uploads", "Multi-seat / team access", "API access & white label", "Priority support"]'::jsonb)
ON CONFLICT (name) DO NOTHING;