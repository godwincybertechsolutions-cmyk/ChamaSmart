import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TokenResponse {
  access_token: string;
  expires_in: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY');
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET');
    const mpesaEnv = Deno.env.get('MPESA_ENV') || 'sandbox';

    if (!consumerKey || !consumerSecret) {
      throw new Error('MPesa credentials not configured');
    }

    // MPesa OAuth endpoint
    const authUrl = mpesaEnv === 'production'
      ? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

    // Generate Basic Auth token
    const auth = btoa(`${consumerKey}:${consumerSecret}`);

    const response = await fetch(authUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`MPesa auth failed: ${response.statusText}`);
    }

    const data: TokenResponse = await response.json();

    // Cache token in Supabase (optional - for rate limiting)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store token with expiry
    const expiresAt = new Date(Date.now() + (parseInt(data.expires_in) - 60) * 1000);
    
    await supabase
      .from('mpesa_tokens')
      .upsert({
        id: 'current',
        access_token: data.access_token,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
      });

    return new Response(
      JSON.stringify({ 
        access_token: data.access_token,
        expires_in: data.expires_in 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('MPesa auth error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});