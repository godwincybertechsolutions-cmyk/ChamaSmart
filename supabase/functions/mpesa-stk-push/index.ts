import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from 'https://deno.land/std@0.168.0/crypto/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface STKPushRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
  userId?: string;
}

interface MPesaSTKResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

// Helper to get valid access token
async function getAccessToken(supabase: any): Promise<string> {
  // Check for cached token
  const { data: tokenData } = await supabase
    .from('mpesa_tokens')
    .select('access_token, expires_at')
    .eq('id', 'current')
    .single();

  if (tokenData && new Date(tokenData.expires_at) > new Date()) {
    return tokenData.access_token;
  }

  // Get new token via auth function
  const authResponse = await fetch(
    `${Deno.env.get('SUPABASE_URL')}/functions/v1/mpesa-auth`,
    {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
    }
  );

  if (!authResponse.ok) {
    throw new Error('Failed to get MPesa access token');
  }

  const { access_token } = await authResponse.json();
  return access_token;
}

// Generate STK password
function generatePassword(shortcode: string, passkey: string, timestamp: string): string {
  const str = shortcode + passkey + timestamp;
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return btoa(String.fromCharCode(...data));
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request
    const requestData: STKPushRequest = await req.json();
    const { phoneNumber, amount, accountReference, transactionDesc, userId } = requestData;

    // Validate inputs
    if (!phoneNumber || !amount || amount <= 0) {
      throw new Error('Invalid phone number or amount');
    }

    // Format phone number (ensure it starts with 254)
    const formattedPhone = phoneNumber.startsWith('254') 
      ? phoneNumber 
      : phoneNumber.startsWith('0') 
        ? '254' + phoneNumber.substring(1)
        : '254' + phoneNumber;

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get MPesa credentials
    const shortcode = Deno.env.get('MPESA_SHORTCODE')!;
    const passkey = Deno.env.get('MPESA_PASSKEY')!;
    const callbackUrl = Deno.env.get('MPESA_CALLBACK_URL') || 
      `${supabaseUrl}/functions/v1/mpesa-callback`;
    const mpesaEnv = Deno.env.get('MPESA_ENV') || 'sandbox';

    // Generate timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .substring(0, 14);

    // Generate password
    const password = generatePassword(shortcode, passkey, timestamp);

    // Get access token
    const accessToken = await getAccessToken(supabase);

    // MPesa STK Push URL
    const stkUrl = mpesaEnv === 'production'
      ? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    // Prepare STK push request
    const stkPushData = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference || 'ChamaSmart',
      TransactionDesc: transactionDesc || 'Chama Contribution',
    };

    // Make STK push request
    const stkResponse = await fetch(stkUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushData),
    });

    if (!stkResponse.ok) {
      const error = await stkResponse.text();
      console.error('STK Push failed:', error);
      throw new Error('Failed to initiate payment');
    }

    const stkResult: MPesaSTKResponse = await stkResponse.json();

    // Store transaction in database
    const { error: dbError } = await supabase
      .from('mpesa_transactions')
      .insert({
        merchant_request_id: stkResult.MerchantRequestID,
        checkout_request_id: stkResult.CheckoutRequestID,
        phone_number: formattedPhone,
        amount: amount,
        account_reference: accountReference,
        transaction_desc: transactionDesc,
        status: 'pending',
        user_id: userId,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway - payment was initiated
    }

    return new Response(
      JSON.stringify({
        success: true,
        checkoutRequestId: stkResult.CheckoutRequestID,
        merchantRequestId: stkResult.MerchantRequestID,
        responseDescription: stkResult.ResponseDescription,
        customerMessage: stkResult.CustomerMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('STK Push error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});