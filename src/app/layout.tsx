import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { FloatingCartBar } from "@/components/layout/FloatingCartBar";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/components/providers/Providers";
import { APP_NAME, APP_TAGLINE, DEFAULT_CAMPUS } from "@/lib/constants";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} | ${DEFAULT_CAMPUS.shortName}`,
    template: `%s | ${APP_NAME}`,
  },
  description: `${APP_TAGLINE} First campus: ${DEFAULT_CAMPUS.name}, ${DEFAULT_CAMPUS.city}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${fraunces.variable} font-sans`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <DemoBanner />
            <Navbar />
            <main className="flex-1 pb-16 sm:pb-0">{children}</main>
            <FloatingCartBar />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
