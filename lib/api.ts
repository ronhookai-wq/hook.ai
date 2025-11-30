import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export interface TrackUsageParams {
  operationType: 'generate' | 'magic_edit' | 'upscale' | 'remove_bg' | 'upload';
  imageUrl: string;
  prompt?: string;
  style?: string;
  aspectRatio?: string;
  metadata?: Record<string, any>;
}

export interface UserData {
  profile: any;
  subscription: {
    isSubscribed: boolean;
    tier: string;
    status: string;
    currentPeriodEnd?: string;
    cancelAtPeriodEnd?: boolean;
  };
  usage: {
    thumbnails_generated: number;
    magic_edits_used: number;
    upscales_used: number;
    background_removals_used: number;
  };
  limits: {
    thumbnailsPerMonth: number;
  };
  recentImages: any[];
}

async function callEdgeFunction(functionName: string, body?: any, method: string = 'POST') {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  const url = `${SUPABASE_URL}/functions/v1/${functionName}`;

  const headers: HeadersInit = {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export async function trackUsage(params: TrackUsageParams) {
  return callEdgeFunction('track-usage', params);
}

export async function getUserData(): Promise<UserData> {
  return callEdgeFunction('get-user-data', null, 'GET');
}

export async function createCheckoutSession(tierId: string, priceId: string) {
  return callEdgeFunction('create-checkout-session', { tierId, priceId });
}

export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
}

export async function signInWithFacebook() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
}

export async function getSubscriptionTiers() {
  const { data, error } = await supabase
    .from('subscription_tiers')
    .select('*')
    .eq('is_active', true)
    .order('price', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getCurrentUsage() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const now = new Date();
  const month = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_id', user.id)
    .eq('month', month)
    .maybeSingle();

  if (error) throw error;

  return data || {
    thumbnails_generated: 0,
    magic_edits_used: 0,
    upscales_used: 0,
    background_removals_used: 0,
  };
}

export async function getRecentImages(limit: number = 20) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('generated_images')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function deleteImage(imageId: string) {
  const { error } = await supabase
    .from('generated_images')
    .delete()
    .eq('id', imageId);

  if (error) throw error;
}
