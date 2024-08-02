import { Exo_2, M_PLUS_2 } from "next/font/google";
import { usePathname } from "next/navigation";

const english_font = Exo_2({ subsets: ["latin"] });
const japanese_font = M_PLUS_2({ subsets: ["latin"]});

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
      <body className={english_font.className + " " + japanese_font.className + " bg-blue-950 text-white"}>
        {children}
      </body>
    </html>
  );
}