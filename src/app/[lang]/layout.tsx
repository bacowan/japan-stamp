import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { getDictionary } from "@/localization/dictionaries";
import { VercelToolbar } from "@vercel/toolbar/next";
import { Suspense } from "react";
import Loading from "./loading";
import { mapPageFlag } from "../../../flags";
import ConsentModal from "./components/consent-modal";
import isPermittedCountry from "./utils/is-permitted-country";

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
  const shouldInjectToolbar = process.env.NODE_ENV === 'development';
  const resolvedParams = await params;
  const dictionary = await getDictionary(resolvedParams.lang);
  const showMap = await mapPageFlag();
  return (
    <html lang="en" className="h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased
          bg-background text-text dark:bg-darkBackground dark:text-darkText
          h-full flex flex-col`}>
        <Navbar lang={resolvedParams.lang} dictionary={{ ...dictionary["navbar"], ...dictionary["common"] }} showMapHeader={showMap}/>
        <div className="grow">
          <Suspense fallback={<Loading/>}>
              {children}
          </Suspense>
        </div>
        {shouldInjectToolbar && <VercelToolbar />}
        <ConsentModal dictionary={dictionary["privacy-preferences"]} isPermittedCountry={await isPermittedCountry()}/>
        <Footer dictionary={dictionary["footer"]} locale={resolvedParams.lang}/>
      </body>
    </html>
  );
}
