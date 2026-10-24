import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Inscripción CEF 123 Caseros",
  description:
    "Ficha digital de inscripción del Centro de Educación Física N.º 123 Caseros. Ahorramos fotocopias.",
  icons: {
    icon: [{ url: "/cef123.jpg", type: "image/jpeg", sizes: "any" }],
    shortcut: [{ url: "/cef123.jpg", type: "image/jpeg" }],
    apple: [{ url: "/cef123.jpg", type: "image/jpeg" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
