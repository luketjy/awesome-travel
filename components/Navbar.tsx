"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top contact strip (always visible) */}
      <div className="sticky top-0 z-50 bg-pink-200/90 backdrop-blur-md border-b h-8">
        <div className="container flex flex-wrap items-center gap-x-6 gap-y-1 h-full text-[13px] sm:text-sm text-gray-800">
          <span>
            WeChat ID: <strong>awesometravel</strong>
          </span>
          <a href="tel:+6585484800" className="hover:underline whitespace-nowrap">
            WhatsApp/Call: +65 8548 4800
          </a>
          <a
            href="mailto:awesometraveltoursingapore@gmail.com"
            className="hover:underline break-all"
          >
            Email: awesometraveltoursingapore@gmail.com
          </a>
        </div>
      </div>

      {/* Main nav bar (sticks below the contact bar) */}
      <header
        className={`sticky top-8 z-40 backdrop-blur-md border-b transition ${
          scrolled ? "bg-white shadow" : "bg-white/80"
        }`}
        data-aos="fade-down"
      >
        <div className="container flex items-center justify-between py-3">
          <Link href="/" className="font-extrabold flex items-center gap-2">
            <span>✈️</span> awesometraveltours
          </Link>

          <nav className="hidden sm:flex items-center gap-4">
            <a href="/#tours" className="opacity-90 hover:opacity-100">
              Tours
            </a>
            <a href="/#why" className="opacity-90 hover:opacity-100">
              Why Us
            </a>
            <a href="/#faq" className="opacity-90 hover:opacity-100">
              FAQ
            </a>
            <Link href="/booking" className="btn btn-cta px-4 py-2">
              Book
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
