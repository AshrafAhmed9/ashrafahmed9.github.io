import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { OrbBackground } from "@/components/orb-background";
import { CornerMarks } from "@/components/corner-marks";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "K Ashraf Ahmed | Backend & Systems Engineer",
  description:
    "Final-year CS student and backend/distributed systems engineer building production-grade distributed applications, high-performance storage engines, and real-time AI inference platforms.",
  openGraph: {
    title: "K Ashraf Ahmed | Backend & Systems Engineer",
    description:
      "Building distributed systems, storage engines, and AI inference platforms with proven high-concurrency, low-latency performance.",
    url: "https://ashrafahmed9.github.io",
    siteName: "K Ashraf Ahmed",
    type: "website",
    locale: "en_US",
  },
  metadataBase: new URL("https://ashrafahmed9.github.io"),
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <OrbBackground />
          <CornerMarks />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
