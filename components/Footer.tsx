"use client";

import { useEffect, useRef, useState } from "react";

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
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
      className="w-full max-w-3xl p-0 rounded-2xl backdrop:bg-black/40"
      onClick={handleBackdrop}
    >
      <div className="rounded-2xl overflow-hidden shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-3 bg-white border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="px-3 py-1 rounded-md border hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        {/* body styled similar to screenshot */}
        <div className="bg-amber-50 px-6 py-5">
          <div className="border-t-4 border-amber-200 pt-4">
            {children}
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default function Footer() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false); // optional second modal

  return (
    <footer className="border-t">
      {/* Main footer content */}
      <div className="container grid grid-cols-12 gap-6 py-10 text-sm" data-aos="fade-up">
        {/* Left column */}
        <div className="col-span-12 md:col-span-6 space-y-1">
          <h4 className="font-bold">Address &amp; Contact</h4>
          <p>Awesome Travel &amp; Tour Pte. Ltd.</p>
          <p>(TA3929)</p>
          <p>40 Choa Chu Kang Street 64</p>
          <p>Singapore</p>
          <p>Phone: +65 85484800</p>
        </div>

        {/* Right column */}
        <div className="col-span-12 md:col-span-6 space-y-2 md:text-right">
          <h4 className="font-bold">Useful Info</h4>

          {/* Use buttons so they open modals instead of navigating */}
          <button
            onClick={() => setShowTerms(true)}
            className="font-semibold hover:underline text-left md:text-right"
          >
            Terms &amp; Conditions
          </button>

          <br />

          <button
            onClick={() => setShowPrivacy(true)}
            className="font-semibold hover:underline text-left md:text-right"
          >
            Data Protection Policy
          </button>
        </div>
      </div>

      {/* Bottom copyright strip */}
      <div className="bg-pink-200 py-3">
        <p className="text-center text-sm font-medium">
          Copyright @ awesometraveltoursingapore
        </p>
      </div>

      {/* Terms modal */}
      <Modal open={showTerms} onClose={() => setShowTerms(false)} title="TERMS & CONDITIONS">
        <ul className="list-disc pl-6 space-y-2 leading-relaxed text-gray-800">
          <li>
            Tour confirmation is given upon successful booking and payment. Please show your
            booking confirmation (mobile or printed) to our guide to start your tour.
          </li>
          <li>Please arrive at the meeting point 15 minutes before start time — our tours start punctually.</li>
          <li>Tours run rain or shine - please bring an umbrella or poncho.</li>
          <li>Please wear comfortable walking shoes and sun protection.</li>
          <li>Please purchase your own travel insurance.</li>
          <li>
            In the rare occasion of schedule changes, we will contact you by email and/or text as soon as we are aware.
          </li>
          <li>The management reserves the right to amend terms and conditions without prior notice.</li>
        </ul>
      </Modal>

      {/* Privacy modal (placeholder; edit as needed) */}
      <Modal open={showPrivacy} onClose={() => setShowPrivacy(false)} title="DATA PROTECTION POLICY">
        <p className="text-gray-800 leading-relaxed">
          We collect and use your information solely for booking and customer support purposes.
          By providing your details, you consent to us contacting you regarding your tour.
          Data is stored securely and not shared with third parties except where required to
          fulfil your booking or by law. For access or deletion requests, please email us at awesometraveltoursingapore@gmail.com. 
        </p>
      </Modal>
    </footer>
  );
}
