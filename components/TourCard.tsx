// components/TourCard.tsx
'use client';
import Image from "next/image";
import React from "react";

type TourCardProps = {
  title: string;
  desc: string;
  price: string;
  img: string;
  delay?: number;
  onClick?: () => void; // NEW
};

export default function TourCard({ title, desc, price, img, delay = 0, onClick }: TourCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group card text-left w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/30"
      data-aos="fade-up"
      data-aos-delay={delay}
      aria-label={`Open details for ${title}`}
    >
      <div className="card-body p-0">
        <div className="relative h-52 sm:h-64 w-full">
          <Image src={img} alt={title} fill className="object-cover rounded-t-xl" />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="muted mt-1 line-clamp-2">{desc}</p>
          <div className="mt-3 font-semibold">{price}</div>
          <div className="mt-2 text-sm underline opacity-80 group-hover:opacity-100">
            View details →
          </div>
        </div>
      </div>
    </button>
  );
}
