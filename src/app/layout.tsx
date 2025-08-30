import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gnuplot Online",
  description: "Compilador en línia de Gnuplot. Galeria d'exemples. Tot en temps real. Fet amb WebAssembly.",
  keywords: ["gnuplot", "gràfics", "visualització", "diagrames", "webassembly", "navegador", "en línia", "compilador"],
  authors: [{ name: "Mapaor" }],
  creator: "Gnuplot Online",
  publisher: "Gnuplot Online",
  openGraph: {
    title: "Gnuplot Online",
    description: "Compilador en línia de Gnuplot. Galeria d'exemples. Tot en temps real. Fet amb WebAssembly.",
    type: "website",
    locale: "ca_ES",
    url: "https://gnuplot-online.vercel.app",
    images: [
      {
        url: "/banner-gnuplot.jpg",
        width: 1200,
        height: 630,
        alt: "Banner Gnuplot Online"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gnuplot Online",
    description: "Compilador en línia de Gnuplot. Galeria d'exemples. Tot en temps real. Fet amb WebAssembly.",
    images: ["/banner-gnuplot.jpg"],
    site: "https://gnuplot-online.vercel.app"
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
    <html lang="ca">
      <body>
        {children}
      </body>
    </html>
  );
}
