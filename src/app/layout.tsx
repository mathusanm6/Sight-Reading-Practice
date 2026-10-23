import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-bricolage", display: "swap",
});

export const metadata: Metadata = {
  title: "Portée Flash",
  description: "Entraînement à la lecture de notes en solfège.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bricolage.variable}`}>
      <body>{children}</body>
    </html>
  );
}
