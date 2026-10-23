import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-bricolage", display: "swap",
});

export const metadata: Metadata = {
  title: "Portée",
  description: "Entraînement à la lecture de notes en solfège.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

/** Applies the saved theme before first paint so a dark-mode user never sees a white flash. */
const themeScript = `try{var t=localStorage.getItem("portee-flash:theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bricolage.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
