-- # Add User Profile and Subscription Triggers
--
-- ## Overview
-- Automatically creates user profile and free trial subscription when a new user signs up
--
-- ## Functions
-- 1. handle_new_user - Creates profile and initial subscription for new users
--
-- ## Triggers
-- 1. on_auth_user_created - Fires when a new user is created

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_usage_tracking_updated_at ON usage_tracking;
CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON usage_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();