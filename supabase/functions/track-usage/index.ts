import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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

    const { operationType, imageUrl, prompt, style, aspectRatio, metadata } = await req.json();

    // Get current month
    const now = new Date();
    const month = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

    // Check current usage
    const { data: usage } = await supabaseClient
      .from("usage_tracking")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", month)
      .maybeSingle();

    // Get user subscription
    const { data: subscription } = await supabaseClient
      .from("user_subscriptions")
      .select(`
        *,
        tier:subscription_tiers(*)
      `)
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (!subscription) {
      return new Response(
        JSON.stringify({ error: "No active subscription found" }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const limit = subscription.tier.thumbnails_per_month;
    const currentUsage = usage?.thumbnails_generated || 0;

    if (operationType === 'generate' && currentUsage >= limit) {
      return new Response(
        JSON.stringify({ error: "Monthly limit reached", limit, currentUsage }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Update or insert usage tracking
    const updateData: any = { updated_at: new Date().toISOString() };
    
    if (operationType === 'generate') {
      updateData.thumbnails_generated = (usage?.thumbnails_generated || 0) + 1;
    } else if (operationType === 'magic_edit') {
      updateData.magic_edits_used = (usage?.magic_edits_used || 0) + 1;
    } else if (operationType === 'upscale') {
      updateData.upscales_used = (usage?.upscales_used || 0) + 1;
    } else if (operationType === 'remove_bg') {
      updateData.background_removals_used = (usage?.background_removals_used || 0) + 1;
    }

    if (usage) {
      await supabaseClient
        .from("usage_tracking")
        .update(updateData)
        .eq("id", usage.id);
    } else {
      await supabaseClient
        .from("usage_tracking")
        .insert({
          user_id: user.id,
          month,
          thumbnails_generated: operationType === 'generate' ? 1 : 0,
          magic_edits_used: operationType === 'magic_edit' ? 1 : 0,
          upscales_used: operationType === 'upscale' ? 1 : 0,
          background_removals_used: operationType === 'remove_bg' ? 1 : 0,
        });
    }

    // Save image record
    await supabaseClient
      .from("generated_images")
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        prompt: prompt || null,
        style: style || null,
        aspect_ratio: aspectRatio || null,
        operation_type: operationType,
        metadata: metadata || {},
      });

    return new Response(
      JSON.stringify({ 
        success: true,
        usage: {
          current: operationType === 'generate' ? currentUsage + 1 : currentUsage,
          limit
        }
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Usage tracking error:", error);
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
