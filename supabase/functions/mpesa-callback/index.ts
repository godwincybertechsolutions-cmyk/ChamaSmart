import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CallbackMetadata {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  Amount?: number;
  MpesaReceiptNumber?: string;
  TransactionDate?: string;
  PhoneNumber?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse callback data
    const callbackData = await req.json();
    console.log('MPesa callback received:', JSON.stringify(callbackData));

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract callback metadata
    const stkCallback = callbackData.Body?.stkCallback;
    if (!stkCallback) {
      throw new Error('Invalid callback structure');
    }

    const { 
      MerchantRequestID, 
      CheckoutRequestID, 
      ResultCode, 
      ResultDesc 
    } = stkCallback;

    // Process callback metadata items
    const metadata: Partial<CallbackMetadata> = {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
    };

    // Extract additional metadata if payment was successful
    if (ResultCode === 0 && stkCallback.CallbackMetadata?.Item) {
      const items = stkCallback.CallbackMetadata.Item;
      
      items.forEach((item: any) => {
        switch (item.Name) {
          case 'Amount':
            metadata.Amount = item.Value;
            break;
          case 'MpesaReceiptNumber':
            metadata.MpesaReceiptNumber = item.Value;
            break;
          case 'TransactionDate':
            metadata.TransactionDate = item.Value?.toString();
            break;
          case 'PhoneNumber':
            metadata.PhoneNumber = item.Value?.toString();
            break;
        }
      });
    }

    // Update transaction status in database
    const status = ResultCode === 0 ? 'completed' : 'failed';
    
    const { data: transaction, error: updateError } = await supabase
      .from('mpesa_transactions')
      .update({
        status,
        result_code: ResultCode,
        result_desc: ResultDesc,
        mpesa_receipt_number: metadata.MpesaReceiptNumber,
        transaction_date: metadata.TransactionDate,
        callback_metadata: metadata,
        updated_at: new Date().toISOString(),
      })
      .eq('checkout_request_id', CheckoutRequestID)
      .select()
      .single();

    if (updateError) {
      console.error('Failed to update transaction:', updateError);
      throw updateError;
    }

    // If successful, update related records (e.g., member contributions)
    if (status === 'completed' && transaction) {
      // Update member contribution record
      if (transaction.user_id) {
        const { error: contributionError } = await supabase
          .from('contributions')
          .insert({
            user_id: transaction.user_id,
            amount: metadata.Amount || transaction.amount,
            mpesa_receipt_number: metadata.MpesaReceiptNumber,
            transaction_id: transaction.id,
            contribution_date: new Date().toISOString(),
            status: 'confirmed',
          });

        if (contributionError) {
          console.error('Failed to record contribution:', contributionError);
        }
      }

      // Send real-time notification via Supabase Realtime
      const { error: broadcastError } = await supabase
        .from('payment_notifications')
        .insert({
          checkout_request_id: CheckoutRequestID,
          status: 'completed',
          amount: metadata.Amount,
          receipt_number: metadata.MpesaReceiptNumber,
          created_at: new Date().toISOString(),
        });

      if (broadcastError) {
        console.error('Failed to broadcast notification:', broadcastError);
      }
    }

    // Return success response to MPesa
    return new Response(
      JSON.stringify({
        ResultCode: 0,
        ResultDesc: 'Callback processed successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Callback processing error:', error);
    
    // Still return success to MPesa to prevent retries
    return new Response(
      JSON.stringify({
        ResultCode: 0,
        ResultDesc: 'Accepted',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  }
});