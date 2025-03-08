import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/[lang]/components/navbar";
import Footer from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Japan Stamp",
  description: "Find eki-stamps in Japan",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: Promise<{ lang: 'en-US' | 'ja' }>
}>) {
  return (
    <html lang="en" className="h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
          bg-background text-text dark:bg-darkBackground dark:text-darkText
          h-full flex flex-col`}>
        <Navbar lang={(await params).lang}/>
        <div className="grow">
          {children}
        </div>
        <Footer/>
      </body>
    </html>
  );
}
