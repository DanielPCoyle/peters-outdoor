import { prisma } from "./prisma";
import type { GiftCertificate } from "@prisma/client";
import crypto from "crypto";

export type GiftCertStatus = "pending_payment" | "active" | "redeemed";

export interface GiftCertRequest {
  id: string;
  createdAt: string;
  status: GiftCertStatus;
  yourName: string;
  yourEmail: string;
  recipientName?: string;
  message?: string;
  amount: number;
  certificateCode?: string;
  stripePaymentIntentId?: string;
  sentAt?: string;
  redeemedAt?: string;
}

function fromPrisma(r: GiftCertificate): GiftCertRequest {
  return {
    id: r.id,
    createdAt: r.createdAt.toISOString(),
    status: r.status as GiftCertStatus,
    yourName: r.yourName,
    yourEmail: r.yourEmail,
    recipientName: r.recipientName ?? undefined,
    message: r.message ?? undefined,
    amount: Number(r.amount),
    certificateCode: r.certificateCode ?? undefined,
    stripePaymentIntentId: r.stripePaymentIntentId ?? undefined,
    sentAt: r.sentAt?.toISOString(),
    redeemedAt: r.redeemedAt?.toISOString(),
  };
}

export async function getAllRequests(): Promise<GiftCertRequest[]> {
  try {
    const rows = await prisma.giftCertificate.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(fromPrisma);
  } catch (err) {
    console.error("getAllRequests:", err);
    return [];
  }
}

export async function getRequestById(id: string): Promise<GiftCertRequest | null> {
  try {
    const row = await prisma.giftCertificate.findUnique({ where: { id } });
    return row ? fromPrisma(row) : null;
  } catch (err) {
    console.error("getRequestById:", err);
    return null;
  }
}

export async function getRequestByCode(
  code: string
): Promise<GiftCertRequest | null> {
  try {
    const row = await prisma.giftCertificate.findFirst({
      where: { certificateCode: code },
    });
    return row ? fromPrisma(row) : null;
  } catch (err) {
    console.error("getRequestByCode:", err);
    return null;
  }
}

export async function getRequestByPaymentIntent(
  paymentIntentId: string
): Promise<GiftCertRequest | null> {
  try {
    const row = await prisma.giftCertificate.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
    });
    return row ? fromPrisma(row) : null;
  } catch (err) {
    console.error("getRequestByPaymentIntent:", err);
    return null;
  }
}

export async function createRequest(input: {
  yourName: string;
  yourEmail: string;
  recipientName?: string;
  message?: string;
  amount: number;
  stripePaymentIntentId: string;
}): Promise<GiftCertRequest | null> {
  try {
    const row = await prisma.giftCertificate.create({
      data: {
        yourName: input.yourName,
        yourEmail: input.yourEmail,
        recipientName: input.recipientName || null,
        message: input.message || null,
        amount: input.amount,
        stripePaymentIntentId: input.stripePaymentIntentId,
        status: "pending_payment",
      },
    });
    return fromPrisma(row);
  } catch (err) {
    console.error("createRequest:", err);
    return null;
  }
}

/**
 * Atomically marks a cert as redeemed only if it is currently active.
 * Returns the updated record, or null if it was already redeemed / not found.
 */
export async function atomicRedeem(id: string): Promise<GiftCertRequest | null> {
  try {
    const result = await prisma.giftCertificate.updateMany({
      where: { id, status: "active" },
      data: { status: "redeemed", redeemedAt: new Date() },
    });
    if (result.count === 0) return null; // already redeemed or not found
    return await getRequestById(id);
  } catch (err) {
    console.error("atomicRedeem:", err);
    return null;
  }
}

export async function updateRequest(
  id: string,
  updates: Partial<{
    status: GiftCertStatus;
    certificateCode: string;
    sentAt: string;
    redeemedAt: string;
  }>
): Promise<GiftCertRequest | null> {
  try {
    const row = await prisma.giftCertificate.update({
      where: { id },
      data: {
        ...(updates.status !== undefined && { status: updates.status }),
        ...(updates.certificateCode !== undefined && { certificateCode: updates.certificateCode }),
        ...(updates.sentAt !== undefined && { sentAt: new Date(updates.sentAt) }),
        ...(updates.redeemedAt !== undefined && { redeemedAt: new Date(updates.redeemedAt) }),
      },
    });
    return fromPrisma(row);
  } catch (err) {
    console.error("updateRequest:", err);
    return null;
  }
}

export function generateCertCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "PETERS-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// kept for any internal use
export { crypto };
