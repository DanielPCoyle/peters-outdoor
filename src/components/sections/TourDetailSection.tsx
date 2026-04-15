"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Tour } from "@/lib/tourStore";
import RichText from "../RichText";

type WildlifeItem = string | { animal: string };

interface TourDetailSectionProps {
  tourId?: string;
  id?: string;
  title?: string;
  tagline?: string;
  description?: string;
  wildlife?: WildlifeItem[];
  duration?: string;
  imageUrl?: string;
  imageAlt?: string;
  reversed?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

export default function TourDetailSection({
  tourId,
  id,
  title: titleProp,
  tagline: taglineProp,
  description: descriptionProp,
  wildlife: wildlifeProp = [],
  duration: durationProp = "2-3 hours",
  imageUrl: imageUrlProp,
  imageAlt,
  reversed = false,
  ctaText = "Book This Tour",
  ctaHref = "/booking",
}: TourDetailSectionProps) {
  const [dbTour, setDbTour] = useState<Tour | null>(null);
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Detect Builder.io editing mode
  useEffect(() => {
    setIsEditing(!!(window as unknown as Record<string, unknown>).__builder_editing__);
  }, []);

  // Fetch all tours for the picker (editing mode) or a specific tour
  useEffect(() => {
    fetch("/api/tours")
      .then((r) => r.json())
      .then((data: { tours: Tour[] }) => {
        setAllTours(data.tours ?? []);
        if (tourId) {
          const found = data.tours.find((t) => t.id === tourId);
          if (found) setDbTour(found);
        }
      })
      .catch(console.error);
  }, [tourId]);

  const title = dbTour?.name ?? titleProp ?? "";
  const tagline = dbTour?.tagline ?? taglineProp;
  const description = dbTour?.description ?? descriptionProp ?? "";
  const duration = dbTour?.duration ?? durationProp;
  const imageUrl = dbTour?.imageUrl ?? imageUrlProp ?? "";
  const wildlife: WildlifeItem[] = dbTour?.wildlife ?? wildlifeProp;

  // In Builder.io editing mode with no tourId set, show a tour picker
  if (isEditing && !tourId) {
    return (
      <div className="border-2 border-dashed border-gold/60 rounded-2xl p-8 text-center bg-gold/5">
        <p className="text-forest font-semibold text-sm mb-1">TourDetailSection</p>
        <p className="text-warm-gray text-sm mb-4">
          Select a tour from the database using the <strong>Tour ID</strong> field in the right panel.
        </p>
        {allTours.length > 0 && (
          <div className="text-left max-w-sm mx-auto">
            <p className="text-xs font-semibold text-forest uppercase tracking-wider mb-2">Available Tours</p>
            <ul className="space-y-1.5">
              {allTours.map((t) => (
                <li key={t.id} className="bg-white rounded-lg px-3 py-2 border border-sage-muted/20">
                  <p className="text-forest font-medium text-sm">{t.name}</p>
                  <p className="text-warm-gray text-xs font-mono mt-0.5 select-all">{t.id}</p>
                </li>
              ))}
            </ul>
            <p className="text-xs text-warm-gray mt-3">Copy an ID above and paste it into the Tour ID field →</p>
          </div>
        )}
      </div>
    );
  }

  if (!imageUrl) return null;

  return (
    <div id={id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className={reversed ? "lg:order-2" : ""}>
        <div className="relative rounded-2xl overflow-hidden shadow-xl group">
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            width={900}
            height={600}
            className="w-full group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-forest">
            {duration}
          </div>
        </div>
      </div>

      <div className={reversed ? "lg:order-1" : ""}>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-forest mb-3">
          {title}
        </h2>
        {tagline && (
          <p className="text-sage font-medium text-lg mb-4 italic">{tagline}</p>
        )}
        <RichText html={description ?? ""} className="prose max-w-none text-warm-gray leading-relaxed mb-6" />

        {wildlife.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-forest mb-2">
              Wildlife you may see:
            </p>
            <div className="flex flex-wrap gap-2">
              {wildlife.map((item, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-sage-muted/30 text-forest text-sm rounded-full"
                >
                  {typeof item === "string" ? item : item.animal}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href={ctaHref}
          className="inline-block px-8 py-3 bg-gold text-forest font-semibold rounded-full hover:bg-gold-light transition-colors"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}
