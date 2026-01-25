import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SessionProvider } from "next-auth/react";
import Provider from "@/components/shared/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nanny Plug Admin",
    template: "%s | Nanny Plug Admin",
  },
  description: "Advanced administration portal for Nanny Plug services, managing perks, listings, courses, and resources.",
  keywords: ["Nanny Plug", "Admin", "Nanny Management", "Childcare Services", "Admin Portal"],
  authors: [{ name: "Nanny Plug Team" }],
  creator: "Nanny Plug",
  publisher: "Nanny Plug",
  robots: "noindex, nofollow", // Since it's an admin portal, we usually don't want it indexed
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nanny-fe-admin.vercel.app",
    siteName: "Nanny Plug Admin",
    title: "Nanny Plug Admin Portal",
    description: "Manage your nanny services and childcare offerings efficiently.",
    images: [
      {
        url: "/authimage.jpg",
        width: 1200,
        height: 630,
        alt: "Nanny Plug Admin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nanny Plug Admin Portal",
    description: "Manage your nanny services and childcare offerings efficiently.",
    images: ["/authimage.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className=" bg-muted">
        <Provider>  {children}</Provider>
      </body>

    </html>
  );
}
