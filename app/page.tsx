"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import TourCard from "@/components/TourCard";
import TourImageCarousel from "@/components/TourImageCarousel";
import "./button.css";

type Tour = {
  title: string;
  price: string;
  desc: string;
  img: string;
  images: string[];
};

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
  children: ReactNode;
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
      className="rounded-2xl p-0 w-full max-w-2xl backdrop:bg-black/40"
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
  contextTitle,
}: {
  open: boolean;
  onClose: () => void;
  contextTitle?: string;
}) {
  const wechatId = "awesometravel";
  const phoneDisplay = "+65 8548 4800";
  const phoneDigits = "6585484800";
  const email = "awesometraveltoursingapore@gmail.com";

  const message = contextTitle
    ? `Hi Awesome Travel & Tour! I'm interested in: ${contextTitle}`
    : "Hi Awesome Travel & Tour! I'd like to ask about your tours.";

  const waHref = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
    message
  )}`;

  const emailSubject = contextTitle
    ? `Tour Enquiry - ${contextTitle}`
    : "Tour Enquiry - Awesome Travel & Tour";

  const emailBody = `Hi Awesome Travel & Tour,

${message}

(Write your question here)

Thanks!`;

  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  const copyWeChat = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(wechatId);
        alert(`WeChat ID copied: ${wechatId}`);
        return;
      }
    } catch {
      // fall through to prompt
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

/** Book modal (Pelago links) */
function BookModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const TOUR_1 =
    "https://www.pelago.com/en-SG/activity/plu5zwrw8-sg-culture-little-india-heritage-walking-tour-2h-singapore/";
  const TOUR_2 =
    "https://www.pelago.com/en-SG/activity/pzh00oysf-sg-culture-awesome-chinatown-heritage-walking-tour-two-hour-singapore/";

  return (
    <Modal open={open} onClose={onClose} title="Book on Pelago">
      <div className="space-y-3">
        <a
          className="btn btn-cta w-full px-4 py-2 text-center"
          href={TOUR_1}
          target="_blank"
          rel="noreferrer"
        >
          Book: Little India Heritage Walking Tour (2h)
        </a>

        <a
          className="btn btn-cta w-full px-4 py-2 text-center"
          href={TOUR_2}
          target="_blank"
          rel="noreferrer"
        >
          Book: Chinatown Heritage Walking Tour (2h)
        </a>

        <p className="text-sm text-gray-600">
          You’ll be redirected to Pelago to complete your booking.
        </p>
      </div>
    </Modal>
  );
}

function HeroCarousel({
  tours,
  onSelect,
  onContact,
  onBook,
}: {
  tours: Tour[];
  onSelect: (t: Tour) => void;
  onContact: (contextTitle?: string) => void;
  onBook: () => void;
}) {
  const [index, setIndex] = useState(0);
  const count = tours.length;
  const goNext = () => setIndex((i) => (i + 1) % count);
  const goPrev = () => setIndex((i) => (i - 1 + count) % count);
  const active = tours[index];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-[70vh] flex items-center justify-center text-white">
        <Image
          src={active.images?.[0] ?? active.img}
          alt={active.title}
          fill
          priority
          draggable={false}
          className="object-cover pointer-events-none select-none z-0"
        />
        <div className="absolute inset-0 bg-black/50 pointer-events-none z-0" />

        <div className="relative z-20 max-w-2xl p-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            {active.title}
          </h2>
          <p className="mb-6 line-clamp-3 text-lg text-white/90">
            {active.desc}
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              type="button"
              className="btn btn-cta px-4 py-2"
              onClick={() => onSelect(active)}
            >
              See more
            </button>

            <button
              type="button"
              className="btn btn-outline px-4 py-2"
              onClick={onBook}
            >
              Book
            </button>

            <button
              type="button"
              className="btn btn-outline px-4 py-2"
              onClick={() => onContact(active.title)}
            >
              Contact Us
            </button>

            <a href="#tours" className="btn px-4 py-2">
              Explore Tours
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-6 z-10">
        <button
          onClick={goPrev}
          className="button-74"
          role="button"
          aria-label="Previous"
        >
          <i className="fa-solid fa-chevron-left" />
        </button>
        <button
          onClick={goNext}
          className="button-74"
          role="button"
          aria-label="Next"
        >
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
const tours: Tour[] = [
  {
    title: "Tour 1: 10,000 Steps Thru' a Century (4h Walking Tour)",
    price: "S$30 per person",
    desc: `On this thoughtfully curated 4-hour walking tour, we take you on a journey of 10,000 steps through over a century of Singapore’s history. From lush green founding grounds to modern waterfront landmarks, this experience offers a deeper understanding of the Lion City’s past, present, and future.`,
    img: "/TOUR1.jpeg",
    images: [
      "/TOUR1.jpeg",
      "/TOUR1-1.jpeg",
      "/TOUR1-2.jpeg",
      "/TOUR1-3.jpeg",
      "/TOUR1-4.jpeg",
    ],
  },
  {
    title:
      "Tour 2: SG Culture Awesome Chinatown Heritage Walking Tour (2h + Free gift)",
    price: "S$50 per person",
    desc: `Step back in time and uncover the living history of Singapore’s Chinatown on this engaging 2-hour heritage walking tour. Wander through bustling streets filled with colorful shophouses and sacred landmarks as your guide shares stories of the immigrants who shaped this vibrant neighborhood. From temples and mosques to traditional food stalls, you’ll get a first-hand look at the cultural blend that makes Singapore truly unique.`,
    img: "/TOUR2.jpeg",
    images: ["/TOUR2.jpeg", "/TOUR2-1.jpeg", "/TOUR2-2.jpeg", "/TOUR2-3.jpeg"],
  },
  {
    title:
      "Tour 3: SG Culture Awesome Little India Heritage Walking Tour (2h + admission)",
    price: "S$30 per person",
    desc: `Walk through bustling streets lined with garland shops, goldsmiths, and spice stalls, visit the Indian Heritage Centre, and admire the striking House of Tan Teng Niah. Along the way, uncover stories of migration, trade, and tradition that shaped this iconic enclave. The tour includes a visit to Tekka Centre, where you’ll learn about Singapore’s UNESCO-recognised hawker culture and savour the aromas of authentic local dishes. It’s a sensory-rich experience that brings Singapore’s living heritage to life.`,
    img: "/TOUR3.jpeg",
    images: [
      "/TOUR3.jpeg",
      "/TOUR3-1.jpeg",
      "/TOUR3-2.jpeg",
      "/TOUR3-3.jpeg",
      "/TOUR3-4.jpeg",
      "/TOUR3-5.jpeg",
    ],
  },
  {
    title: "Tour 4: SG Chilli Crab Combo (2h Walking Tour + 2h Cooking)",
    price: "S$318 for 2 persons",
    desc: `1:00 PM - 3:00 PM: 2-hour Walking Tour to learn about the history of Fort Canning Park, ending at Clarke Quay.

3:00 PM - 5:00 PM: 2-hour SG Chilli Crab à la carte at Clarke Quay.

End the day with an immersive, hands-on culinary experience celebrating one of Singapore’s most iconic dishes: Singapore Chilli Crab.

Led by professional chefs, this interactive workshop reveals the secrets behind the signature recipe—how sweet, savoury, and spicy flavours are carefully balanced, and how technique makes all the difference.

During this 2-hour workshop, participants will:
• Learn about the different parts of the crab and how they affect texture and flavour
• Take part in a guided, hands-on cooking session (each participant prepares one crab with their partner)
• Discover professional tips used in local kitchens
• Dine on freshly prepared Chilli Crab, served with fluffy Golden Mantou
• Enjoy a refreshing Red Cooler cocktail

This experience blends heritage, storytelling, and food—perfect for travellers who want to understand Singapore not just through sights, but through taste.`,
    img: "/TOUR4.jpeg",
    images: [
      "/TOUR4.jpg",
      "/TOUR4-1.jpg",
      "/TOUR4-2.jpg",
      "/TOUR4-3.jpg",
      "/TOUR4-4.jpg",
      "/TOUR4-5.jpg",
      "/TOUR4-6.jpg",
      "/TOUR4-7.jpeg",
      "/TOUR4-8.jpg"
    ],
  },
];


  const [selected, setSelected] = useState<Tour | null>(null);
  const openTour = (t: Tour) => setSelected(t);
  const closeTour = () => setSelected(null);

  // Contact modal state
  const [contactOpen, setContactOpen] = useState(false);
  const [contactContextTitle, setContactContextTitle] = useState<
    string | undefined
  >(undefined);

  const openContact = (contextTitle?: string) => {
    setContactContextTitle(contextTitle);
    setContactOpen(true);
  };
  const closeContact = () => setContactOpen(false);

  // Book modal state
  const [bookOpen, setBookOpen] = useState(false);
  const openBook = () => setBookOpen(true);
  const closeBook = () => setBookOpen(false);

  const faqs: [string, string][] = [
    [
      "Do you offer hotel pickup?",
      "Yes. If you’re staying within the central area, we can arrange convenient hotel pickup and drop-off for your tour. Otherwise, we'll suggest an easy meeting point usually near Chinatown MRT.",
    ],
    [
      "Are tickets included?",
      "Some tours include attraction tickets; others keep it flexible. See each tour for specifics.",
    ],
    [
      "What about dietary needs?",
      "We can accommodate most preferences—vegetarian, no-pork, gluten-aware—just tell us during booking.",
    ],
    [
      "Do I need a visa for Singapore?",
      "Requirements vary by nationality. Please check with the relevant embassy or consulate before traveling.",
    ],
  ];

  return (
    <main id="main">
      {/* HERO — Carousel */}
      <section
        className="relative min-h-[62vh] flex items-center border-b overflow-hidden"
        aria-label="Hero Tours"
      >
        <HeroCarousel
          tours={tours}
          onSelect={openTour}
          onContact={openContact}
          onBook={openBook}
        />
      </section>

      {/* TOURS grid below */}
      <section id="tours" className="section pt-8 md:pt-12">
        <div className="container">
          <header className="section-head">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Explore Our Tours
            </h2>
            <p className="muted">
              Hand-picked experiences to discover Singapore&apos;s rich culture
              and heritage.
            </p>
          </header>
          <div className="grid grid-cols-12 gap-4">
            {tours.map((t, i) => (
              <div key={t.title} className="col-span-12 md:col-span-6">
                <TourCard
                  title={t.title}
                  price={t.price}
                  desc={t.desc}
                  img={t.img}
                  images={t.images}
                  delay={i * 80}
                  onClick={() => openTour(t)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="section section-alt">
        <div className="container max-w-3xl">
          <header className="section-head mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Why Choose Us?
            </h2>
          </header>
          <div className="prose prose-lg text-gray-700 space-y-4">
            <p>
              At <strong>Awesome Travel & Tour</strong>, we may be a new name in
              the travel industry, but our passion for travel is lifelong. To
              us, travel is more than just a holiday – it is a lifestyle choice,
              a chance to refresh one’s spirit, and a way to find new motivation
              when life feels tough. We believe that everyone, regardless of
              age, deserves the joy of discovering the world.
            </p>
            <p>
              The inspiration to start this agency came from my own family. When
              my parents wanted to visit their ancestral hometown in China, I
              realised how meaningful such journeys are for seniors – yet how
              difficult it can be for their children, busy with careers and
              family commitments, to accompany them. That’s when I decided to
              dedicate part of my agency to serving senior travellers, creating
              safe, thoughtful, and well-planned tours that allow them to travel
              with confidence and peace of mind.
            </p>
            <p>
              But our love for travel doesn’t stop there. As Singaporeans born
              and bred locally, we are passionate about sharing our home with
              visitors from around the world. Many say Singapore is small and
              has little to offer – but join us on one of our 4-hour walking
              tours, and you’ll see how every corner has a story. With our local
              guides, you’ll discover hidden gems, cultural tales, and living
              history that turns stone and brick into experiences that truly
              come alive.
            </p>
            <p>
              Why choose <strong>Awesome Travel & Tour</strong>? Because we
              believe travel is always better with a guide who cares. With a
              guide, every sight becomes more meaningful, and every step of your
              journey turns into a story worth remembering.
            </p>
            <p className="font-semibold text-black">
              Awesome Travel & Tour – Because Every Journey Deserves Care.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section">
        <div className="container">
          <header className="section-head">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Frequently Asked Questions
            </h2>
          </header>
          <div className="grid gap-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="card">
                <summary className="card-body font-bold cursor-pointer">
                  {q}
                </summary>
                <div className="px-5 pb-5 -mt-3 text-gray-700">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for tours */}
      <Modal open={!!selected} onClose={closeTour} title={selected?.title}>
        {selected && (
          <>
            <TourImageCarousel
              images={selected.images?.length ? selected.images : [selected.img]}
              alt={selected.title}
              className="mb-4"
            />

            <p className="text-gray-700 mb-3">{selected.desc}</p>

            <div className="flex justify-between items-center gap-3 flex-wrap">
              <div className="font-semibold">{selected.price}</div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline px-4 py-2"
                  onClick={() => {
                    closeTour();
                    openBook();
                  }}
                >
                  Book
                </button>

                <button
                  type="button"
                  className="btn btn-cta px-4 py-2"
                  onClick={() => {
                    closeTour();
                    openContact(selected.title);
                  }}
                >
                  Contact Us
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* Book modal */}
      <BookModal open={bookOpen} onClose={closeBook} />

      {/* Contact modal (shared) */}
      <ContactModal
        open={contactOpen}
        onClose={closeContact}
        contextTitle={contactContextTitle}
      />
    </main>
  );
}
