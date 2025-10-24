import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TopNav } from "@/components/layouts/top-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChamaSmart | Group Finance & Savings Dashboard",
  description:
    "Manage group savings, contributions, and loans seamlessly with ChamaSmart — your smart chama management tool.",
  keywords: ["Chama", "Savings", "Finance", "Kenya", "Dashboard", "MPesa"],
  authors: [{ name: "ChamaSmart Team" }],
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Global Navbar */}
          <TopNav />

          {/* Page Content */}
          <main className="min-h-screen">{children}</main>

          {/* Toast Notifications */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
