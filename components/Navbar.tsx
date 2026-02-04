"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

/** Reusable modal using <dialog> */
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useLayoutEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    else if (!open && dlg.open) dlg.close();
  }, [open]);

  const handleBackdrop = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dlg = ref.current;
    if (!dlg) return;
    const r = dlg.getBoundingClientRect();
    const inside =
      r.top <= e.clientY &&
      e.clientY <= r.top + r.height &&
      r.left <= e.clientX &&
      e.clientX <= r.left + r.width;
    if (!inside) onClose();
  };

  return (
    <dialog
      ref={ref}
      className="rounded-2xl p-0 w-full max-w-xl backdrop:bg-black/40"
      onClick={handleBackdrop}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={() => onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            aria-label="Close"
            className="btn btn-outline px-3 py-1"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </dialog>
  );
}

function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const wechatId = "awesometravel";
  const phoneDisplay = "+65 8548 4800";
  const phoneDigits = "6585484800";
  const email = "awesometraveltoursingapore@gmail.com";

  const message = "Hi Awesome Travel & Tour! I'd like to enquire about your tours.";
  const waHref = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;

  const emailSubject = "Tour Enquiry - Awesome Travel & Tour";
  const emailBody = `Hi Awesome Travel & Tour,%0D%0A%0D%0AI'm interested in your tours and would like to ask:%0D%0A%0D%0A(Write your question here)%0D%0A%0D%0AThanks!`;
  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${emailBody}`;

  const copyWeChat = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(wechatId);
        alert(`WeChat ID copied: ${wechatId}`);
        return;
      }
    } catch {
      // fall through
    }
    window.prompt("Copy WeChat ID:", wechatId);
  };

  return (
    <Modal open={open} onClose={onClose} title="Contact Us">
      <div className="space-y-3">
        <a
          className="btn btn-cta w-full px-4 py-2 text-center"
          href={waHref}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp: {phoneDisplay}
        </a>

        <a
          className="btn btn-outline w-full px-4 py-2 text-center"
          href={`tel:+${phoneDigits}`}
        >
          Call: {phoneDisplay}
        </a>

        <a className="btn w-full px-4 py-2 text-center" href={mailtoHref}>
          Email: {email}
        </a>

        <button
          type="button"
          className="btn w-full px-4 py-2"
          onClick={copyWeChat}
        >
          WeChat: {wechatId} (Copy ID)
        </button>

        <p className="text-sm text-gray-600">
          Tip: WeChat usually can’t open a direct chat link from a website, so
          copying the ID is the easiest way.
        </p>
      </div>
    </Modal>
  );
}

export default function Navbar() {
  const contactRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);

  const [contactH, setContactH] = useState(0);
  const [mainH, setMainH] = useState(0);

  const [contactOpen, setContactOpen] = useState(false);

  // NEW: Book dropdown state
  const [bookOpen, setBookOpen] = useState(false);

  // Pelago tour links
  const TOUR_1 =
    "https://www.pelago.com/en-SG/activity/plu5zwrw8-sg-culture-little-india-heritage-walking-tour-2h-singapore/";
  const TOUR_2 =
    "https://www.pelago.com/en-SG/activity/pzh00oysf-sg-culture-awesome-chinatown-heritage-walking-tour-two-hour-singapore/";

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

  // Close book dropdown when clicking anywhere outside it
  useLayoutEffect(() => {
    if (!bookOpen) return;

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      // if click is inside the dropdown container, do nothing
      if (target.closest("[data-book-dropdown]")) return;
      setBookOpen(false);
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [bookOpen]);

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
            <Image
              src="/logo.jpeg"
              alt="AwesomeTravelTours logo"
              width={65}
              height={65}
              className="rounded-sm"
              priority
            />
            awesometraveltours
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

            {/* NEW: Book dropdown button */}
            <div className="relative" data-book-dropdown>
              <button
                type="button"
                className="btn btn-outline px-4 py-2"
                onClick={(e) => {
                  e.stopPropagation(); // prevents immediate outside-click close
                  setBookOpen((v) => !v);
                }}
              >
                Book
              </button>

              {bookOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-white shadow-lg overflow-hidden">
                  <a
                    href={TOUR_1}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-4 py-3 hover:bg-gray-50"
                    onClick={() => setBookOpen(false)}
                  >
                    Little India Heritage Walking Tour (2h)
                  </a>
                  <a
                    href={TOUR_2}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-4 py-3 hover:bg-gray-50"
                    onClick={() => setBookOpen(false)}
                  >
                    Chinatown Heritage Walking Tour (2h)
                  </a>
                </div>
              )}
            </div>

            {/* Contact button */}
            <button
              type="button"
              className="btn btn-cta px-4 py-2"
              onClick={() => setContactOpen(true)}
            >
              Contact Us
            </button>
          </nav>
        </div>
      </header>

      {/* Spacer so content doesn't slide under the fixed bars */}
      <div style={{ height: contactH + mainH }} />

      {/* Contact modal */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
