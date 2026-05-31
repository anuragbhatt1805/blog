import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ToastProvider";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-anurag.vercel.app'),
  title: {
    default: "Telemetry - Advanced Developer Insights",
    template: "%s | Telemetry"
  },
  description: "A premium blogging platform for developers to share insights, tutorials, and more.",
  keywords: ["developer", "blog", "coding", "programming", "tutorials", "insights"],
  authors: [{ name: "Anurag" }],
  creator: "Anurag",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blog-anurag.vercel.app", // Placeholder, will be used if defined
    siteName: "Telemetry",
    title: "Telemetry - Advanced Developer Insights",
    description: "A premium blogging platform for developers to share insights, tutorials, and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Telemetry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Telemetry - Advanced Developer Insights",
    description: "Deep-dive technical essays, system design teardowns, and engineering metrics.",
    creator: "@telemetry",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
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
