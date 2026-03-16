import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${playfair.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
