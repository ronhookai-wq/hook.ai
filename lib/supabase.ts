import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  thumbnails_per_month: number;
  features: string[];
  stripe_price_id: string | null;
  is_active: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  tier_id: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  tier?: SubscriptionTier;
}

export interface UsageTracking {
  id: string;
  user_id: string;
  month: string;
  thumbnails_generated: number;
  magic_edits_used: number;
  upscales_used: number;
  background_removals_used: number;
}

export interface GeneratedImage {
  id: string;
  user_id: string;
  image_url: string;
  prompt: string | null;
  style: string | null;
  aspect_ratio: string | null;
  operation_type: 'generate' | 'magic_edit' | 'upscale' | 'remove_bg' | 'upload';
  metadata: Record<string, any>;
  created_at: string;
}
