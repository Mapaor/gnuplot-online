import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gnuplot Web Compiler - Create Beautiful Plots in Your Browser",
  description: "A modern web-based Gnuplot compiler and visualization tool. Create beautiful plots, charts, and graphs directly in your browser using WebAssembly. No installation required - powered by Next.js, React, and TypeScript.",
  keywords: ["gnuplot", "plotting", "visualization", "charts", "graphs", "webassembly", "browser", "online", "compiler"],
  authors: [{ name: "Gnuplot Web Compiler Team" }],
  creator: "Gnuplot Web Compiler",
  publisher: "Gnuplot Web Compiler",
  openGraph: {
    title: "Gnuplot Web Compiler",
    description: "Create beautiful plots and visualizations with Gnuplot in your browser",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gnuplot Web Compiler",
    description: "Create beautiful plots and visualizations with Gnuplot in your browser",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
