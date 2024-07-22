import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
        {/* TODO: make this only appear in the pages that use it (it doesn't seem to work with the Head component) */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""/>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}