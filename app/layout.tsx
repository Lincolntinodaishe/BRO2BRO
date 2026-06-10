import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulse — The Barbershop Got Men Talking. We Built What Comes Next.",
  description:
    "Pulse is the AI-powered wellness companion that extends trusted community conversations into real care — connecting Black men to preventive health, mental wellness, and community support.",
  keywords: ["Black men's health", "AI health", "barbershop", "Arkansas", "wellness", "UAMS"],
  openGraph: {
    title: "Pulse — AI-Powered Black Men's Health",
    description: "The barbershop got men talking. We built what comes next.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
