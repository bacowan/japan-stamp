import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { getDictionary } from "@/localization/dictionaries";

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
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang);
  return (
    <html lang="en" className="h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
          bg-background text-text dark:bg-darkBackground dark:text-darkText
          h-full flex flex-col`}>
        <Navbar lang={(await params).lang} dictionary={{ ...dictionary["navbar"], ...dictionary["common"] }}/>
        <div className="grow">
          {children}
        </div>
        <Footer dictionary={dictionary["footer"]} locale={resolvedParams.lang}/>
      </body>
    </html>
  );
}
