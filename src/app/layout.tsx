// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import MainNavbar from "@/components/layout/MainNavbar";
import { Bebas_Neue, Inter_Tight } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "KOI Streetwear",
  description: "Urban fashion ecommerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bebas.variable} ${interTight.variable}`}>
        <Providers>
          <MainNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
