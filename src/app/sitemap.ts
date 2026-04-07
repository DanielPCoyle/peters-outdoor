import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://petersoutdoor.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tours = await prisma.tour.findMany({
    where: { isActive: true },
    select: { id: true, updatedAt: true },
  });

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/tours`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/booking`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/gallery`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/reviews`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/gift-certificates`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/waiver`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const tourPages: MetadataRoute.Sitemap = tours.map((tour) => ({
    url: `${SITE_URL}/book/${tour.id}`,
    lastModified: tour.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...tourPages];
}
