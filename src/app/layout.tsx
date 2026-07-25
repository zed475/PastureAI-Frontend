import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PastureAI - Ethiopia Livestock Early Warning System",
  description: "Real-time monitoring and early warning system for Ethiopia's pastoral livestock communities. Track NDVI, livestock health, drought conditions, and more.",
  keywords: ["Ethiopia", "livestock", "early warning", "pastoralism", "NDVI", "drought", "Somali region", "Oromia", "Afar"],
  authors: [{ name: "PastureAI Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
