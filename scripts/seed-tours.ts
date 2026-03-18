/**
 * Run with: npx tsx scripts/seed-tours.ts
 * Seeds tours from the /tours page content. Clears existing tours first.
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DB_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as never);

const TOURS = [
  // ── Main tours (from TourDetailSection on /tours) ──────────────────────────
  {
    name: "Newport Bay Salt Marsh",
    tagline: "Kayak Maryland's hidden gem: Newport Bay's wild salt marsh.",
    description:
      "Paddle through the largest continuous salt marsh in Worcester County, Maryland on a peaceful 2-3 hour guided tour. You'll glide along tidal creeks and open waters, spotting osprey, herons, and other wildlife while learning the stories of Maryland's \"forgotten bays.\" Small groups, calm waters, and optional sunset departures make this experience perfect for all skill levels — whether you're seeking adventure, relaxation, or stunning photos.",
    price: 75,
    duration: "2-3 hours",
    imageUrl:
      "https://static.wixstatic.com/media/5768ba_a2d76f158bc74f90b6db4b28452ab0e1~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/20221012_121045.jpg",
    wildlife: ["Osprey", "Herons", "Coastal Birds"],
    isActive: true,
    sortOrder: 0,
  },
  {
    name: "Pocomoke River Bald Cypress Swamp",
    tagline: "Serenity, Wildlife, and Ancient Trees Await",
    description:
      "Paddle the serene blackwaters of the Pocomoke River, home to the northernmost bald cypress swamp in the U.S. This 2-3 hour guided tour is great for all skill levels and offers close encounters with wildlife like herons, owls, turtles, river otters, and even longnose gar. Small groups, peaceful scenery, and optional sunset tours make this a truly unforgettable experience.",
    price: 75,
    duration: "2-3 hours",
    imageUrl:
      "https://static.wixstatic.com/media/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg",
    wildlife: ["Herons", "Owls", "Turtles", "River Otters", "Longnose Gar"],
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "St. Martin River",
    tagline:
      "Follow the quiet bends of the St. Martin River and step into a story of wildlife, water, and renewal.",
    description:
      "Paddle into the hidden beauty of the upper St. Martin River on a guided kayak adventure. Experience a peaceful journey through marshes and forests alive with herons, eagles, and other wildlife. Along the way, discover the rich history of Bishopville Dam and the inspiring restoration efforts bringing new life to the river. Small groups, expert guides, and calm waters make this the perfect escape into nature.",
    price: 75,
    duration: "2-3 hours",
    imageUrl:
      "https://static.wixstatic.com/media/5768ba_8efacc66b0074908b6c5c8b6a8abd3c7~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251106_215242625_edited.jpg",
    wildlife: ["Herons", "Eagles", "Diverse Wildlife"],
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Assateague Island National Seashore",
    tagline:
      "Where wild ponies roam, shipwreck tales linger, and the island itself is always on the move.",
    description:
      "Paddle through calm bays, salt marshes, and winding channels on a 2-3 hour guided kayak tour of Assateague Island National Seashore. Along the way, spot wild ponies, ospreys, herons, and other wildlife, while learning about shipwrecks, local watermen, and the island's shifting sands. Perfect for all skill levels, this small-group experience blends ecology, history, and stunning scenery — with magical sunset tours available seasonally.",
    price: 75,
    duration: "2-3 hours",
    imageUrl:
      "https://static.wixstatic.com/media/5768ba_359609431599441684b622533bee766f~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250509_151508817_MP.jpg",
    wildlife: ["Wild Ponies", "Ospreys", "Herons"],
    isActive: true,
    sortOrder: 3,
  },
  // ── Special tours (from SpecialToursSection / toursPageCards on /tours) ────
  {
    name: "Sunset Kayak Tour",
    tagline: "Watch the sky transform as you paddle through golden-hour waters.",
    description:
      "Experience the magic of the Eastern Shore as the sun dips below the horizon. This daily special tour combines stunning golden-hour skies with peaceful paddling and wildlife sightings. A perfect date night, anniversary, or special occasion on the water.",
    price: 85,
    duration: "2-3 hours",
    imageUrl:
      "https://static.wixstatic.com/media/5768ba_388163a383e849019d7b74abfa4e0da0~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250823_233340318_MP.jpg",
    wildlife: ["Herons", "Osprey", "Evening Wildlife"],
    isActive: true,
    sortOrder: 4,
  },
  {
    name: "Full Moon Kayak Tour",
    tagline: "A magical nighttime paddle under the glow of the full moon.",
    description:
      "Paddle under a full moon through glassy waters alive with night sounds. These monthly special tours offer a completely unique perspective on the Eastern Shore — bioluminescence, nighttime wildlife, and the quiet magic of being on the water after dark. Limited spots available.",
    price: 85,
    duration: "2-3 hours",
    imageUrl:
      "https://static.wixstatic.com/media/5768ba_b2953e61daad4dd08109df65193010b6~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251007_225010061.jpg",
    wildlife: ["Night Birds", "Bioluminescence", "Nocturnal Wildlife"],
    isActive: true,
    sortOrder: 5,
  },
];

async function main() {
  const existing = await prisma.tour.count();
  if (existing > 0) {
    console.log(`Deleting ${existing} existing tour(s)…`);
    await prisma.tour.deleteMany();
  }

  for (const tour of TOURS) {
    const created = await prisma.tour.create({ data: tour });
    console.log(`Created: ${created.name} (${created.id})`);
  }

  console.log("\nDone! 6 tours seeded.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
