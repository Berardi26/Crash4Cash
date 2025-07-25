import type { Metadata } from "next";
import { Geist, Nova_Square } from "next/font/google";
import "./globals.css";
import Provider from "../providers/provider";

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
          {children}
        </Provider>
      </body>
    </html>
  );
}
