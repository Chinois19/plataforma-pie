import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalUI from "@/components/GlobalUI";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PIE Escuela Pucara Alto",
  description: "Gestión de material educativo para el Programa de Integración Escolar de la Escuela Pucara Alto. Diseñado por Baúl de Josefa SPA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <GlobalUI />
        {children}
      </body>
    </html>
  );
}
