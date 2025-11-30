/*
  # Fix Security and Performance Issues

  ## Changes
  
  1. Indexes
    - Add missing index for `user_subscriptions.tier_id` foreign key
    - This improves query performance for foreign key lookups
  
  2. RLS Policy Optimization
    - Fix all RLS policies to use `(select auth.uid())` instead of `auth.uid()`
    - This prevents re-evaluation of auth.uid() for each row, improving performance at scale
    - Affects tables:
      - user_profiles (3 policies)
      - user_subscriptions (1 policy)
      - usage_tracking (3 policies)
      - generated_images (3 policies)
      - stripe_customers (1 policy)
      - stripe_subscriptions (1 policy)
      - stripe_orders (1 policy)
  
  3. Function Security
    - Fix `handle_new_user` function with secure search_path
    - Fix `update_updated_at_column` function with secure search_path
    - This prevents privilege escalation attacks
*/

-- Add missing index for tier_id foreign key
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier_id ON user_subscriptions(tier_id);

-- Drop and recreate all RLS policies with optimized auth.uid() calls

-- user_profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- user_subscriptions policies
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
CREATE POLICY "Users can view own subscription"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- usage_tracking policies
DROP POLICY IF EXISTS "Users can view own usage" ON usage_tracking;
CREATE POLICY "Users can view own usage"
  ON usage_tracking FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own usage" ON usage_tracking;
CREATE POLICY "Users can insert own usage"
  ON usage_tracking FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own usage" ON usage_tracking;
CREATE POLICY "Users can update own usage"
  ON usage_tracking FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- generated_images policies
DROP POLICY IF EXISTS "Users can view own images" ON generated_images;
CREATE POLICY "Users can view own images"
  ON generated_images FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own images" ON generated_images;
CREATE POLICY "Users can insert own images"
  ON generated_images FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own images" ON generated_images;
CREATE POLICY "Users can delete own images"
  ON generated_images FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- stripe_customers policies
DROP POLICY IF EXISTS "Users can view their own customer data" ON stripe_customers;
CREATE POLICY "Users can view their own customer data"
  ON stripe_customers
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()) AND deleted_at IS NULL);

-- stripe_subscriptions policies
DROP POLICY IF EXISTS "Users can view their own subscription data" ON stripe_subscriptions;
CREATE POLICY "Users can view their own subscription data"
  ON stripe_subscriptions
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id
      FROM stripe_customers
      WHERE user_id = (select auth.uid()) AND deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- stripe_orders policies
DROP POLICY IF EXISTS "Users can view their own order data" ON stripe_orders;
CREATE POLICY "Users can view their own order data"
  ON stripe_orders
  FOR SELECT
  TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id
      FROM stripe_customers
      WHERE user_id = (select auth.uid()) AND deleted_at IS NULL
    )
    AND deleted_at IS NULL
  );

-- Fix function security with proper search_path
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  free_trial_tier_id uuid;
BEGIN
  -- Insert user profile
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );

  -- Get Free Trial tier ID
  SELECT id INTO free_trial_tier_id
  FROM public.subscription_tiers
  WHERE name = 'Free Trial'
  LIMIT 1;

  -- Create initial free trial subscription
  IF free_trial_tier_id IS NOT NULL THEN
    INSERT INTO public.user_subscriptions (
      user_id,
      tier_id,
      status,
      current_period_start,
      current_period_end
    ) VALUES (
      NEW.id,
      free_trial_tier_id,
      'trial',
      NOW(),
      NOW() + INTERVAL '30 days'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
