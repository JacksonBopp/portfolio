import type { Metadata } from "next";
import { Cinzel, Geist, IM_Fell_English } from "next/font/google";
import { profile } from "@/data/profile";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const imFellEnglish = IM_Fell_English({
  variable: "--font-fell",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const title = `${profile.name} — ${profile.tagline}`;
const description = `${profile.subtagline}. Portfolio of ${profile.name}, a ${profile.tagline} student working across embedded systems, full-stack web, and AI.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${cinzel.variable} ${imFellEnglish.variable} h-full antialiased`}
    >
      <body className="relative z-0 flex min-h-full flex-col">
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
