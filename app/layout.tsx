import type { Metadata, Viewport } from "next";
import { Nunito, Lora } from "next/font/google";

import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "IntusBridge — Un espacio seguro para momentos difíciles",
  description:
    "Apoyo emocional ante estrés, ansiedad y bullying. Herramientas de calma, diario seguro y guias prácticas. No sustituye a un profesional.",
};

export const viewport: Viewport = {
  themeColor: "#4a9e8f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${nunito.variable} ${lora.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
