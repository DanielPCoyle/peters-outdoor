import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getTourById } from "@/lib/tourStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  if (!date) {
    return NextResponse.json({ error: "date required" }, { status: 400 });
  }

  const tour = await getTourById(id);
  if (!tour) return NextResponse.json({ error: "Tour not found" }, { status: 404 });

  const maxGuests = tour.maxGuests ?? 8;

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ bookedGuests: 0, maxGuests, seatsLeft: maxGuests });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Paginate through Stripe to find all succeeded bookings for this tour+date+time
  let bookedGuests = 0;
  let hasMore = true;
  let startingAfter: string | undefined;

  while (hasMore) {
    const intents = await stripe.paymentIntents.list({
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    for (const pi of intents.data) {
      if (pi.status !== "succeeded") continue;
      if (pi.metadata?.tourId !== id) continue;
      if (pi.metadata?.date !== date) continue;
      // If time is specified, only count bookings with matching time
      // If the booking has no time stored (legacy), skip it when time filtering
      if (time && pi.metadata?.time && pi.metadata.time !== time) continue;
      if (time && !pi.metadata?.time) continue; // legacy booking without time - skip
      const guests = parseInt(pi.metadata?.guests ?? "0", 10);
      // Private charter counts as full capacity
      if (pi.metadata?.isPrivateCharter === "true") {
        bookedGuests += maxGuests;
      } else {
        bookedGuests += isNaN(guests) ? 0 : guests;
      }
    }

    hasMore = intents.has_more;
    if (hasMore && intents.data.length > 0) {
      startingAfter = intents.data[intents.data.length - 1].id;
    } else {
      hasMore = false;
    }
  }

  const seatsLeft = Math.max(0, maxGuests - bookedGuests);
  return NextResponse.json({ bookedGuests, maxGuests, seatsLeft });
}
