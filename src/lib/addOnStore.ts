import { prisma } from "./prisma";
import type { AddOn as PrismaAddOn } from "@prisma/client";

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  sortOrder: number;
}

function fromPrisma(a: PrismaAddOn): AddOn {
  return {
    id: a.id,
    name: a.name,
    description: a.description,
    price: Number(a.price),
    isActive: a.isActive,
    sortOrder: a.sortOrder,
  };
}

export async function getAllAddOns(): Promise<AddOn[]> {
  try {
    const rows = await prisma.addOn.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return rows.map(fromPrisma);
  } catch (err) {
    console.error("getAllAddOns:", err);
    return [];
  }
}

export async function getActiveAddOns(): Promise<AddOn[]> {
  try {
    const rows = await prisma.addOn.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return rows.map(fromPrisma);
  } catch (err) {
    console.error("getActiveAddOns:", err);
    return [];
  }
}

export async function getAddOnById(id: string): Promise<AddOn | null> {
  try {
    const row = await prisma.addOn.findUnique({ where: { id } });
    return row ? fromPrisma(row) : null;
  } catch (err) {
    console.error("getAddOnById:", err);
    return null;
  }
}

export async function createAddOn(
  input: Omit<AddOn, "id">
): Promise<AddOn | null> {
  try {
    const row = await prisma.addOn.create({ data: input });
    return fromPrisma(row);
  } catch (err) {
    console.error("createAddOn:", err);
    return null;
  }
}

export async function updateAddOn(
  id: string,
  input: Partial<Omit<AddOn, "id">>
): Promise<AddOn | null> {
  try {
    const row = await prisma.addOn.update({ where: { id }, data: input });
    return fromPrisma(row);
  } catch (err) {
    console.error("updateAddOn:", err);
    return null;
  }
}

export async function deleteAddOn(id: string): Promise<boolean> {
  try {
    await prisma.addOn.delete({ where: { id } });
    return true;
  } catch (err) {
    console.error("deleteAddOn:", err);
    return false;
  }
}

export async function getAddOnsForTour(tourId: string): Promise<AddOn[]> {
  try {
    const rows = await prisma.tourAddOn.findMany({
      where: { tourId },
      include: { addOn: true },
      orderBy: { addOn: { sortOrder: "asc" } },
    });
    return rows.map((r) => fromPrisma(r.addOn));
  } catch (err) {
    console.error("getAddOnsForTour:", err);
    return [];
  }
}

export async function setTourAddOns(
  tourId: string,
  addOnIds: string[]
): Promise<boolean> {
  try {
    await prisma.tourAddOn.deleteMany({ where: { tourId } });
    if (addOnIds.length > 0) {
      await prisma.tourAddOn.createMany({
        data: addOnIds.map((addOnId) => ({ tourId, addOnId })),
        skipDuplicates: true,
      });
    }
    return true;
  } catch (err) {
    console.error("setTourAddOns:", err);
    return false;
  }
}
