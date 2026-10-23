import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"], weight: ["500", "700"], variable: "--font-bricolage", display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"], weight: "500", variable: "--font-plex-mono", display: "swap",
});

export const metadata: Metadata = {
  title: "Portée Flash",
  description: "Entraînement à la lecture de notes en solfège.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bricolage.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
