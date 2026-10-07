import type { Metadata } from "next";
import { Nunito, Baloo_2 } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Lingoland — Learn a language the fun way",
  description:
    "Lingoland is a playful, game-like language learning app. Bite-sized lessons, streaks, leaderboards, AI tutor, and a friendly fox named Lumo.",
  keywords: [
    "language learning",
    "Lingoland",
    "Lumo",
    "learn Spanish",
    "learn Japanese",
    "learn French",
    "AI tutor",
  ],
  authors: [{ name: "Lingoland" }],
  openGraph: {
    title: "Lingoland — Learn a language the fun way",
    description:
      "Bite-sized lessons, friendly fox mascot, gamified streaks and an AI tutor.",
    siteName: "Lingoland",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#58cc8d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${baloo.variable} antialiased bg-background text-foreground no-tap-highlight`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" />
      </body>
    </html>
  );
}
