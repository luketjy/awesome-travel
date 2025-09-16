"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TourCard from "@/components/TourCard";
import "./button.css";

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

function HeroCarousel({
  tours,
  onSelect,
}: {
  tours: any[];
  onSelect: (t: any) => void;
}) {
  const [index, setIndex] = useState(0);
  const count = tours.length;
  const goNext = () => setIndex((i) => (i + 1) % count);
  const goPrev = () => setIndex((i) => (i - 1 + count) % count);
  const active = tours[index];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative h-[70vh] flex items-center justify-center text-white">
        {/* background image should NOT catch taps */}
        <Image
          src={active.img}
          alt={active.title}
          fill
          priority
          draggable={false}
          className="object-cover pointer-events-none select-none z-0"
        />
        {/* overlay should NOT catch taps */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none z-0" />

        {/* content sits on top */}
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
            <Link href="/booking" className="btn btn-outline px-4 py-2">
              Book
            </Link>
            <a href="#tours" className="btn px-4 py-2">
              Explore Tours
            </a>
          </div>
        </div>
      </div>

      {/* Chevron controls (Font Awesome) */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-6 z-10">
        <button onClick={goPrev} className="button-74" role="button" aria-label="Previous">
          <i className="fa-solid fa-chevron-left" />
        </button>
        <button onClick={goNext} className="button-74" role="button" aria-label="Next">
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const tours = [
    {
      title: "Tour 1: From Colony to Nation: Civic District Walk (4 Hours)",
      price: "From S$60",
      desc: "Step into the Civic District, where grand landmarks and the Singapore River reveal the nation’s journey from colony to modern city. Once a bustling port alive with merchants and migrants, this area today showcases a blend of history, heritage and vibrant city life. Walk past the National Gallery and the Padang, stand on the very ground where independence was declared, and follow the river that shaped the dreams of traders and settlers. The tour ends at the iconic Merlion Park, where Singapore’s story comes full circle against a stunning waterfront skyline.",
      img: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title:
        "Tour 2: Colours of Heritage: Chinatown, Little India & Kampong Glam (4 hours)",
      price: "From S$60",
      desc: "Experience Singapore’s vibrant multicultural heritage in this immersive 4-hour walk. Journey through Chinatown, home to century old temples and traditional shophouses; Kampong Glam, where the golden domes of Sultan Mosque rise above colourful textile streets and street art; and Little India, alive with spices, flowers, and festivals. Along the way, discover how Chinese, Malay, and Indian communities shaped Singapore’s identity, and capture the vibrant colours and flavours of these living cultural districts.",
      img: "https://images.unsplash.com/photo-1542367597-8849eb47a6ee?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Tour 3: Instagrammable Moments: Fort Canning Walk (4 hours)",
      price: "From S$60",
      desc: "Blending history with Instagram-worthy sights, this 4-hour walking tour takes you through some of Singapore’s most photogenic spots. Begin at Old Hill Police Station before heading to Fort Canning Park, a green hill rich with colonial and wartime stories. Descend into the famous Tree Tunnel and spiral staircase, one of the city’s top photo locations. Next, head to Emerald Hill to admire colourful Peranakan shophouses. The walk combines storytelling with stunning backdrops — perfect for those who want to uncover history while capturing unforgettable photos of the Lion City.",
      img: "https://images.unsplash.com/photo-1533574597035-1ffeba0d4bce?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const [selected, setSelected] = useState<(typeof tours)[number] | null>(null);
  const openTour = (t: (typeof tours)[number]) => setSelected(t);
  const closeTour = () => setSelected(null);

  return (
    <main id="main">
      {/* HERO — Carousel */}
      <section
        className="relative min-h-[62vh] flex items-center border-b overflow-hidden"
        aria-label="Hero Tours"
      >
        <HeroCarousel tours={tours} onSelect={openTour} />
      </section>

      {/* TOURS grid below */}
      <section id="tours" className="section pt-8 md:pt-12">
        <div className="container">
          <header className="section-head">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Popular Singapore Tours
            </h2>
            <p className="muted">
              Hand-picked experiences with clear timings and pricing (SGD).
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
            <h2 className="text-2xl sm:text-3xl font-extrabold">Why Choose Us?</h2>
          </header>
          <div className="prose prose-lg text-gray-700 space-y-4">
            <p>
              At <strong>Awesome Travel & Tour</strong>, we may be a new name in the
              travel industry, but our passion for travel is lifelong. To us, travel
              is more than just a holiday – it is a lifestyle choice, a chance to
              refresh one’s spirit, and a way to find new motivation when life feels
              tough. We believe that everyone, regardless of age, deserves the joy of
              discovering the world.
            </p>
            <p>
              The inspiration to start this agency came from my own family. When my
              parents wanted to visit their ancestral hometown in China, I realised how
              meaningful such journeys are for seniors – yet how difficult it can be
              for their children, busy with careers and family commitments, to
              accompany them. That’s when I decided to dedicate part of my agency to
              serving senior travellers, creating safe, thoughtful, and well-planned
              tours that allow them to travel with confidence and peace of mind.
            </p>
            <p>
              But our love for travel doesn’t stop there. As a Singaporean born and
              bred, I am equally passionate about sharing my home with visitors from
              around the world. Many say Singapore is small and has little to offer –
              but join us on one of our 4-hour walking tours, and you’ll see how every
              corner has a story. With our local guides, you’ll discover hidden gems,
              cultural tales, and living history that turns stone and brick into
              experiences that truly come alive.
            </p>
            <p>
              Why choose <strong>Awesome Travel & Tour</strong>? Because we believe travel
              is always better with a guide who cares. With a guide, every sight becomes
              more meaningful, and every step of your journey turns into a story worth
              remembering.
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
            {[
              [
                "Do you offer hotel pickup?",
                "Yes. Many tours include pickup in central areas; otherwise we’ll suggest an easy meeting point.",
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
                "Requirements vary by nationality. Please check ICA’s official guidance.",
              ],
            ].map(([q, a]) => (
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.img} alt={selected.title} className="rounded-xl mb-4" />
            <p className="text-gray-700 mb-3">{selected.desc}</p>
            <div className="flex justify-between items-center">
              <div className="font-semibold">{selected.price}</div>
              <Link href="/booking" className="btn btn-cta px-4 py-2">
                Book Now
              </Link>
            </div>
          </>
        )}
      </Modal>
    </main>
  );
}
