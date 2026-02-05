"use client";

import TourImageCarousel from "./TourImageCarousel";

type TourCardProps = {
  title: string;
  price: string;
  desc: string;
  img: string;
  images?: string[];
  delay?: number;
  onClick?: () => void;
};

export default function TourCard({
  title,
  price,
  desc,
  img,
  images,
  delay = 0,
  onClick,
}: TourCardProps) {
  const allImages = images && images.length ? images : [img];

  return (
    <div
      className="card overflow-hidden cursor-pointer"
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
    >
      <TourImageCarousel
        images={allImages}
        alt={title}
        stopPropagation // important so arrows won't open modal
      />

      <div className="card-body">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold">{title}</h3>
          <div className="font-semibold whitespace-nowrap">{price}</div>
        </div>
        <p className="text-gray-700 line-clamp-3">{desc}</p>
      </div>
    </div>
  );
}
