'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type PhoneForm = z.infer<typeof phoneSchema>;
type OtpForm = z.infer<typeof otpSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');

  const phoneForm = useForm<PhoneForm>({
    resolver: zodResolver(phoneSchema),
  });

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
  });

  const handlePhoneSubmit = async (data: PhoneForm) => {
    // Mock API call
    setPhoneNumber(data.phone);
    setStep('otp');
    toast.success('OTP sent to your phone');
  };

  const handleOtpSubmit = async (data: OtpForm) => {
    // Mock verification
    toast.success('Welcome back!');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-neutral-50 dark:bg-neutral-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            {step === 'phone' 
              ? 'Enter your phone number to sign in' 
              : 'Enter the OTP sent to your phone'}
          </CardDescription>
        </CardHeader>
        
        {step === 'phone' ? (
          <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <div className="mt-1 relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  <input
                    {...phoneForm.register('phone')}
                    type="tel"
                    placeholder="0712345678"
                    className="pl-10 w-full px-3 py-2 border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 dark:border-neutral-700"
                  />
                </div>
                {phoneForm.formState.errors.phone && (
                  <p className="text-sm text-danger-500 mt-1">
                    {phoneForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Send OTP
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Enter OTP</label>
                <input
                  {...otpForm.register('otp')}
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="mt-1 w-full px-3 py-2 text-center text-2xl tracking-widest border border-neutral-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-neutral-800 dark:border-neutral-700"
                />
                {otpForm.formState.errors.otp && (
                  <p className="text-sm text-danger-500 mt-1">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                OTP sent to {phoneNumber}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full">
                Verify & Sign In
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('phone')}
                className="w-full"
              >
                Use different number
              </Button>
            </CardFooter>
          </form>
        )}
        
        <div className="pb-6 px-6 text-center text-sm">
          <span className="text-neutral-600 dark:text-neutral-400">
            Don&apos;t have an account?{' '}
          </span>
          <Link href="/auth/signup" className="text-primary-600 hover:underline">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}