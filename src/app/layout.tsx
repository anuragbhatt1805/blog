import type { Metadata } from "next";
import { Inter_Tight, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ToastProvider";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-anurag.vercel.app'),
  title: {
    default: "Telemetry — Editorial Archive",
    template: "%s | Telemetry"
  },
  description: "An editorial archive of deep-dive technical essays, system design teardowns, and engineering notes.",
  keywords: ["developer", "blog", "coding", "programming", "tutorials", "insights"],
  authors: [{ name: "Anurag" }],
  creator: "Anurag",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blog-anurag.vercel.app",
    siteName: "Telemetry",
    title: "Telemetry — Editorial Archive",
    description: "An editorial archive of deep-dive technical essays and engineering notes.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Telemetry" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Telemetry — Editorial Archive",
    description: "Deep-dive technical essays, system design teardowns, and engineering metrics.",
    creator: "@telemetry",
  },
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <Navbar />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
