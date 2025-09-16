"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function Navbar() {
  const contactRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);

  const [contactH, setContactH] = useState(0);
  const [mainH, setMainH] = useState(0);

  // Measure heights (on load + resize) so the second bar sits right below the first
  useLayoutEffect(() => {
    const measure = () => {
      setContactH(contactRef.current?.offsetHeight ?? 0);
      setMainH(mainRef.current?.offsetHeight ?? 0);
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  return (
    <>
      {/* Top contact strip — FIXED */}
      <div
        ref={contactRef}
        className="fixed top-0 left-0 right-0 z-50 bg-pink-200/90 backdrop-blur-md border-b"
      >
        <div
          className="
            container
            flex flex-col sm:flex-row
            sm:items-center sm:justify-start
            gap-x-6 gap-y-1
            py-1.5
            text-[13px] sm:text-sm text-gray-800
          "
        >
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

      {/* Main nav bar — FIXED, positioned right under contact strip */}
      <header
        ref={mainRef}
        className="fixed left-0 right-0 z-40 bg-white border-b"
        style={{ top: contactH }} // dynamic offset = contact strip height
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

      {/* Spacer so content doesn't slide under the fixed bars */}
      <div style={{ height: contactH + mainH }} />
    </>
  );
}
