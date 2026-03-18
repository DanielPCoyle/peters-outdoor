import { prisma } from "./prisma";
import type { Tour as PrismaTour } from "@prisma/client";
import type { AddOn } from "./addOnStore";

export type { AddOn };

export interface Tour {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  duration: string;
  imageUrl: string;
  wildlife: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  addOns?: AddOn[];
}

function fromPrisma(t: PrismaTour): Tour {
  return {
    id: t.id,
    name: t.name,
    tagline: t.tagline,
    description: t.description,
    price: Number(t.price),
    duration: t.duration,
    imageUrl: t.imageUrl,
    wildlife: t.wildlife,
    isActive: t.isActive,
    sortOrder: t.sortOrder,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

export async function getAllTours(): Promise<Tour[]> {
  try {
    const rows = await prisma.tour.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return rows.map(fromPrisma);
  } catch (err) {
    console.error("getAllTours:", err);
    return [];
  }
}

export async function getActiveTours(): Promise<Tour[]> {
  try {
    const rows = await prisma.tour.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return rows.map(fromPrisma);
  } catch (err) {
    console.error("getActiveTours:", err);
    return [];
  }
}

export async function getTourById(id: string): Promise<Tour | null> {
  try {
    const row = await prisma.tour.findUnique({ where: { id } });
    return row ? fromPrisma(row) : null;
  } catch (err) {
    console.error("getTourById:", err);
    return null;
  }
}

export async function createTour(
  input: Omit<Tour, "id" | "createdAt" | "updatedAt">
): Promise<Tour | null> {
  try {
    const row = await prisma.tour.create({
      data: {
        name: input.name,
        tagline: input.tagline,
        description: input.description,
        price: input.price,
        duration: input.duration,
        imageUrl: input.imageUrl,
        wildlife: input.wildlife,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      },
    });
    return fromPrisma(row);
  } catch (err) {
    console.error("createTour:", err);
    return null;
  }
}

export async function updateTour(
  id: string,
  input: Partial<Omit<Tour, "id" | "createdAt" | "updatedAt">>
): Promise<Tour | null> {
  try {
    const row = await prisma.tour.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.tagline !== undefined && { tagline: input.tagline }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.price !== undefined && { price: input.price }),
        ...(input.duration !== undefined && { duration: input.duration }),
        ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
        ...(input.wildlife !== undefined && { wildlife: input.wildlife }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
        ...(input.sortOrder !== undefined && { sortOrder: input.sortOrder }),
      },
    });
    return fromPrisma(row);
  } catch (err) {
    console.error("updateTour:", err);
    return null;
  }
}

export async function deleteTour(id: string): Promise<boolean> {
  try {
    await prisma.tour.delete({ where: { id } });
    return true;
  } catch (err) {
    console.error("deleteTour:", err);
    return false;
  }
}
