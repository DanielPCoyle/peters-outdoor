import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://petersoutdoor.com";

export const metadata: Metadata = {
  title: {
    default: "W.H. Peters Outdoor Adventures | Guided Kayak Eco-Tours | Ocean City, MD",
    template: "%s | W.H. Peters Outdoor Adventures",
  },
  description:
    "Experience unforgettable guided kayak eco-tours in Ocean City, MD. Explore bald cypress swamps, salt marshes, and Assateague Island with an ACA Certified Instructor and local naturalist.",
  keywords: [
    "kayak tours",
    "eco-tours",
    "Ocean City MD",
    "guided kayaking",
    "Assateague Island",
    "Pocomoke River",
    "Newport Bay",
    "St. Martin River",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "W.H. Peters Outdoor Adventures",
    title: "W.H. Peters Outdoor Adventures | Guided Kayak Eco-Tours",
    description:
      "Guided kayak eco-tours in Ocean City, MD. Explore bald cypress swamps, salt marshes, and Assateague Island with a certified instructor.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${playfair.variable} antialiased`}>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}
            </Script>
          </>
        )}
        <SiteChrome>
          <main>{children}</main>
        </SiteChrome>
      </body>
    </html>
  );
}
