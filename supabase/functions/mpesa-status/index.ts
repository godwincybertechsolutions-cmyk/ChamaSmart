import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StatusRequest {
  checkoutRequestId: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request
    const { checkoutRequestId }: StatusRequest = await req.json();

    if (!checkoutRequestId) {
      throw new Error('Checkout request ID is required');
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Query transaction status from database
    const { data: transaction, error: dbError } = await supabase
      .from('mpesa_transactions')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .single();

    if (dbError) {
      console.error('Database query error:', dbError);
      throw new Error('Transaction not found');
    }

    // Check if we should query MPesa API for status
    const shouldQueryAPI = 
      transaction.status === 'pending' && 
      new Date().getTime() - new Date(transaction.created_at).getTime() < 120000; // Within 2 minutes

    if (shouldQueryAPI) {
      // Get access token
      const authResponse = await fetch(
        `${supabaseUrl}/functions/v1/mpesa-auth`,
        {
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          },
        }
      );

      if (authResponse.ok) {
        const { access_token } = await authResponse.json();
        
        // Query MPesa STK Push Query API
        const mpesaEnv = Deno.env.get('MPESA_ENV') || 'sandbox';
        const queryUrl = mpesaEnv === 'production'
          ? 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query'
          : 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query';

        const shortcode = Deno.env.get('MPESA_SHORTCODE')!;
        const passkey = Deno.env.get('MPESA_PASSKEY')!;
        
        const timestamp = new Date()
          .toISOString()
          .replace(/[^0-9]/g, '')
          .substring(0, 14);
        
        const password = btoa(shortcode + passkey + timestamp);

        const queryResponse = await fetch(queryUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            CheckoutRequestID: checkoutRequestId,
          }),
        });

        if (queryResponse.ok) {
          const queryResult = await queryResponse.json();
          console.log('MPesa query result:', queryResult);

          // Update transaction if status changed
          if (queryResult.ResultCode !== undefined) {
            const newStatus = queryResult.ResultCode === '0' ? 'completed' : 'failed';
            
            await supabase
              .from('mpesa_transactions')
              .update({
                status: newStatus,
                result_code: parseInt(queryResult.ResultCode),
                result_desc: queryResult.ResultDesc,
                updated_at: new Date().toISOString(),
              })
              .eq('checkout_request_id', checkoutRequestId);

            transaction.status = newStatus;
            transaction.result_code = parseInt(queryResult.ResultCode);
            transaction.result_desc = queryResult.ResultDesc;
          }
        }
      }
    }

    // Also check for real-time updates via payment notifications
    const { data: notification } = await supabase
      .from('payment_notifications')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return new Response(
      JSON.stringify({
        status: transaction.status,
        resultCode: transaction.result_code,
        resultDesc: transaction.result_desc,
        amount: transaction.amount,
        phoneNumber: transaction.phone_number,
        mpesaReceiptNumber: transaction.mpesa_receipt_number,
        transactionDate: transaction.transaction_date,
        notification: notification || null,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Status check error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'unknown'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});