import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/auth-provider";
import { ReactQueryProvider } from "@/lib/query-client";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Refugee Young Adults (PWDs)",
  description: "Supporting mental health and well-being through community and resources.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ReactQueryProvider>
          <NextAuthProvider>
            {children}
          </NextAuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
