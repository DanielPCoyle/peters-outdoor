import { Metadata } from "next";
import PrivateBookingPage from "./PrivateBookingPage";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tour = await prisma.privateTour.findUnique({ where: { slug } });
  return {
    title: tour ? `${tour.title} — W.H. Peters Outdoor Adventures` : "Private Tour Booking",
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PrivateBookingPage slug={slug} />;
}
