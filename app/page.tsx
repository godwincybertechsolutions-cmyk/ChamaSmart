import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Shield, Zap, Users, TrendingUp, Smartphone, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-6xl">
              Manage Your Chama
              <span className="text-primary-600"> Smarter</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              The modern way to manage your Kenyan savings group. Track contributions, 
              manage loans, and process MPesa payments - all in one place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/signup">
                <Button size="lg" className="shadow-lg">
                  Create a Chama
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg">
                  Join a Chama
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-white dark:bg-neutral-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Everything you need to run your chama
            </h2>
            <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
              Built for Kenyan chamas, with features that make financial management simple and transparent.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-neutral-200 dark:border-neutral-800">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/20">
                      <feature.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 dark:bg-primary-800">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start managing your chama today
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Join thousands of Kenyan chamas already using ChamaSmart to streamline their operations.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="shadow-lg">
                  Get started for free
                </Button>
              </Link>
              <Link href="/features" className="text-sm font-semibold leading-6 text-white hover:text-primary-100">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: 'MPesa Integration',
    description: 'Accept contributions and process payouts directly through MPesa. Real-time payment tracking and automatic reconciliation.',
    icon: Smartphone,
  },
  {
    title: 'Smart Contributions',
    description: 'Set up recurring contributions, track payment history, and send automatic reminders to members.',
    icon: TrendingUp,
  },
  {
    title: 'Loan Management',
    description: 'Process loan applications, calculate interest automatically, and track repayment schedules.',
    icon: Zap,
  },
  {
    title: 'Member Portal',
    description: 'Give members access to their personal dashboard, contribution history, and loan status.',
    icon: Users,
  },
  {
    title: 'Financial Reports',
    description: 'Generate detailed reports, export statements, and maintain transparent records for all members.',
    icon: Shield,
  },
  {
    title: 'Secure & Compliant',
    description: 'Bank-level security with role-based access control and full audit trails for compliance.',
    icon: Lock,
  },
];