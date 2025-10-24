'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Loader2, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { formatCurrency, formatPhoneNumber } from '@/lib/utils';
import toast from 'react-hot-toast';
import axios from 'axios';

const checkoutSchema = z.object({
  phone: z.string().min(10, 'Valid phone number required'),
  amount: z.number().min(10, 'Minimum amount is KES 10').max(150000, 'Maximum amount is KES 150,000'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

interface MpesaCheckoutProps {
  amount?: number;
  description?: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
}

export function MpesaCheckout({ 
  amount: defaultAmount, 
  description = 'Chama Contribution',
  onSuccess,
  onError 
}: MpesaCheckoutProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'polling' | 'success' | 'failed'>('idle');
  const [transactionId, setTransactionId] = useState<string>('');

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      amount: defaultAmount,
    }
  });

  const pollPaymentStatus = async (checkoutRequestId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // Poll for 60 seconds max
    
    const interval = setInterval(async () => {
      try {
        const response = await axios.post('/api/mpesa/status', { checkoutRequestId });
        
        if (response.data.status === 'completed') {
          clearInterval(interval);
          setStatus('success');
          setTransactionId(response.data.transactionId);
          toast.success('Payment successful!');
          onSuccess?.(response.data.transactionId);
        } else if (response.data.status === 'failed') {
          clearInterval(interval);
          setStatus('failed');
          toast.error('Payment failed. Please try again.');
          onError?.('Payment failed');
        }
        
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setStatus('failed');
          toast.error('Payment timeout. Please check your phone.');
          onError?.('Payment timeout');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000); // Poll every 2 seconds
  };

  const onSubmit = async (data: CheckoutForm) => {
    setStatus('processing');
    
    try {
      // Initiate STK Push
      const response = await axios.post('/api/mpesa/stk-push', {
        phone: data.phone,
        amount: data.amount,
        description,
      });

      if (response.data.success) {
        setStatus('polling');
        toast.success('Check your phone for the MPesa prompt');
        pollPaymentStatus(response.data.checkoutRequestId);
      } else {
        throw new Error(response.data.message || 'Failed to initiate payment');
      }
    } catch (error: any) {
      setStatus('failed');
      const message = error.response?.data?.message || 'Payment initiation failed';
      toast.error(message);
      onError?.(message);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          MPesa Payment
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      {status === 'idle' || status === 'processing' ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <div className="mt-1 relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="0712345678"
                  disabled={status === 'processing'}
                  className="pl-10 w-full px-3 py-2 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-neutral-800 dark:border-neutral-700"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-danger-500 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Amount (KES)</label>
              <input
                {...register('amount', { valueAsNumber: true })}
                type="number"
                placeholder="1000"
                disabled={status === 'processing' || !!defaultAmount}
                className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-neutral-800 dark:border-neutral-700"
              />
              {errors.amount && (
                <p className="text-sm text-danger-500 mt-1">{errors.amount.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={status === 'processing'}
            >
              {status === 'processing' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay with MPesa'
              )}
            </Button>
          </CardFooter>
        </form>
      ) : status === 'polling' ? (
        <CardContent className="py-12">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
            <p className="text-center text-sm">
              Please complete the payment on your phone
            </p>
            <p className="text-center text-xs text-neutral-500">
              Waiting for confirmation...
            </p>
          </div>
        </CardContent>
      ) : status === 'success' ? (
        <CardContent className="py-12">
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-success-500" />
            <p className="text-center font-medium">Payment Successful!</p>
            <p className="text-center text-sm text-neutral-500">
              Transaction ID: {transactionId}
            </p>
          </div>
        </CardContent>
      ) : (
        <CardContent className="py-12">
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-12 w-12 text-danger-500" />
            <p className="text-center font-medium">Payment Failed</p>
            <Button 
              onClick={() => setStatus('idle')}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}