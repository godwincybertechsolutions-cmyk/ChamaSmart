import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 px-6 sm:px-12">
      <main className="flex flex-col items-center text-center sm:text-left sm:items-start max-w-3xl py-24">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-10">
          <Image
            src="/logo.svg"
            alt="ChamaSmart Logo"
            width={40}
            height={40}
            className="rounded-xl shadow-sm dark:invert"
          />
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            ChamaSmart
          </h1>
        </div>

        {/* Hero Section */}
        <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">
          Manage group savings and loans effortlessly.
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mb-8">
          Simplify your chama’s finances with real-time contributions, MPesa integrations, and transparent records — all in one intuitive dashboard.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-6 text-lg rounded-full shadow-md">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" className="px-8 py-6 text-lg rounded-full border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 text-sm text-neutral-500 dark:text-neutral-500">
          Built with ❤️ using Next.js, Tailwind, and Supabase.
        </div>
      </main>
    </div>
  );
}

