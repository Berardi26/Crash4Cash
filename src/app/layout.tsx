import type { Metadata } from "next";
import { Geist, Nova_Square } from "next/font/google";
import "./globals.css";
import Provider from "../providers/provider";
import LoadingOverlay from "@/components/loading/loading";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistNova = Nova_Square({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Futuresea",
  description: "Casino web3 game on solana",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistNova.className}`}>
        <Provider>
          <LoadingOverlay />
          {children}
        </Provider>
      </body>
    </html>
  );
}
