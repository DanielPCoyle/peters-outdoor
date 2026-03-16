"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/tours", label: "Tours" },
  { href: "/reviews", label: "Reviews" },
  { href: "/gallery", label: "Gallery" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-cream/95 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`transition-all duration-300 ${isScrolled ? "w-10 h-10" : "w-12 h-12"} rounded-full bg-forest flex items-center justify-center`}>
            <svg viewBox="0 0 40 40" className="w-6 h-6 text-cream" fill="currentColor">
              <path d="M20 4 L12 18 L16 18 L10 30 L15 30 L8 38 L32 38 L25 30 L30 30 L24 18 L28 18 Z" />
            </svg>
          </div>
          <div>
            <span className={`font-serif font-bold tracking-tight transition-all ${isScrolled ? "text-lg" : "text-xl"} text-forest`}>
              W.H. Peters
            </span>
            <span className={`block text-xs tracking-widest uppercase text-sage transition-opacity ${isScrolled ? "opacity-0 h-0" : "opacity-100"}`}>
              Outdoor Adventures
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? "bg-forest text-cream"
                  : "text-forest hover:bg-forest/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="ml-3 px-6 py-2.5 bg-gold text-forest font-semibold text-sm rounded-full hover:bg-gold-light transition-colors duration-200"
          >
            Book a Tour
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-forest"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-cream/98 backdrop-blur-lg border-t border-sage-muted/30">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-forest text-cream"
                    : "text-forest hover:bg-forest/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              className="mt-2 px-6 py-3 bg-gold text-forest font-semibold text-base rounded-xl text-center hover:bg-gold-light transition-colors"
            >
              Book a Tour
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
