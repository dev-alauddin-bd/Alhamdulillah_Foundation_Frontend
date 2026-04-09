import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import { I18nProvider } from "@/components/shared/I18nProvider";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

import Script from "next/script";
import { ToastContainer } from "react-toastify";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Alhamdulillah Foundation | Collaborative Investment Platform",
  description:
    "A secure platform for managing community investment projects including agriculture, fish farming, and real estate development.",
  keywords:
    "Alhamdulillah Foundation, Investment, Halal Investment, Agriculture, Fish Farming, Real Estate, Bangladesh",
  authors: [{ name: "Alhamdulillah Foundation Team" }],
  openGraph: {
    title: "Alhamdulillah Foundation | Collaborative Investment Platform",
    description: "Secure platform for community investment projects.",
    url: "https://alhamdulillahfoundation.com",
    siteName: "Alhamdulillah Foundation",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alhamdulillah Foundation | Collaborative Investment Platform",
    description: "Secure platform for community investment projects.",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body
        suppressHydrationWarning
        className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ReduxProvider>
          <I18nProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
         {/* 🔔 TOASTER (ONE TIME) */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
            </ThemeProvider>
          </I18nProvider>
          <Analytics />
        </ReduxProvider>
      </body>
    </html>
  );
}
