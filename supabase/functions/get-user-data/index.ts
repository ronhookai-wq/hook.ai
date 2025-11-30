import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Get user profile
    const { data: profile } = await supabaseClient
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    // Get active subscription
    const { data: subscription } = await supabaseClient
      .from("user_subscriptions")
      .select(`
        *,
        tier:subscription_tiers(*)
      `)
      .eq("user_id", user.id)
      .in("status", ["active", "trial"])
      .order("created_at", { ascending: false })
      .maybeSingle();

    // Get current month usage
    const now = new Date();
    const month = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    const { data: usage } = await supabaseClient
      .from("usage_tracking")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", month)
      .maybeSingle();

    // Get recent images
    const { data: recentImages } = await supabaseClient
      .from("generated_images")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    return new Response(
      JSON.stringify({
        profile,
        subscription: subscription ? {
          isSubscribed: subscription.status === 'active',
          tier: subscription.tier.name,
          status: subscription.status,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        } : {
          isSubscribed: false,
          tier: 'Free Trial',
          status: 'none',
        },
        usage: usage || {
          thumbnails_generated: 0,
          magic_edits_used: 0,
          upscales_used: 0,
          background_removals_used: 0,
        },
        limits: subscription ? {
          thumbnailsPerMonth: subscription.tier.thumbnails_per_month,
        } : {
          thumbnailsPerMonth: 5,
        },
        recentImages: recentImages || [],
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Get user data error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
