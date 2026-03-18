import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env vars from .env
const envContent = readFileSync(join(__dirname, "../.env"), "utf8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const [key, ...rest] = l.split("=");
      return [key.trim(), rest.join("=").trim()];
    })
);

const PRIVATE_KEY = env.BUILDERIO_PRIVATE_API_KEY;
const PUBLIC_KEY = env.BUILDERIO_PUBLIC_API_KEY;

if (!PRIVATE_KEY || !PUBLIC_KEY) {
  console.error("Missing BUILDERIO_PRIVATE_API_KEY or BUILDERIO_PUBLIC_API_KEY in .env");
  process.exit(1);
}

const API_BASE = "https://builder.io/api/v1/write";

function block(name, options = {}, styles = {}) {
  const el = {
    "@type": "@builder.io/sdk:Element",
    component: { name, options },
  };
  if (Object.keys(styles).length) {
    el.responsiveStyles = { large: styles };
  }
  return el;
}

// IDs of the currently live pages — update these if pages are ever recreated
const PAGE_IDS = {
  "/":        "e2ade6bf66484e7b83c8a516234cfd93",
  "/tours":   "5e54b690be1b4df39174056f6ae985b9",
  "/about":   "a6814f91d3eb4166a0dc05f938f42a16",
  "/booking": "4ddb0984958d4392ad41aa49b6b3b38a",
  "/gallery": "d6eed014897d449a8fd94e78e81915c3",
  "/reviews": "da584097f392405a96368f0645a152df",
};

async function upsertPage(name, urlPath, blocks) {
  const id = PAGE_IDS[urlPath];
  const payload = {
    name,
    published: "published",
    query: [
      {
        "@type": "@builder.io/core:Query",
        property: "urlPath",
        operator: "is",
        value: urlPath,
      },
    ],
    data: { url: urlPath, blocks },
  };

  if (id) {
    console.log(`  Updating "${name}" (${id})...`);
    const res = await fetch(`${API_BASE}/page/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${PRIVATE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`PATCH failed: ${res.status} ${await res.text()}`);
    return res.json();
  } else {
    console.log(`  Creating "${name}"...`);
    const res = await fetch(`${API_BASE}/page`, {
      method: "POST",
      headers: { Authorization: `Bearer ${PRIVATE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`POST failed: ${res.status} ${await res.text()}`);
    const result = await res.json();
    console.log(`  → Add new id to PAGE_IDS["${urlPath}"]: ${result.id}`);
    return result;
  }
}

const pages = [
  {
    name: "Home",
    url: "/",
    blocks: [
      block("HomeHero", {
        eyebrow: "Ocean City, Maryland",
        headlineLines: [{ line: "Paddle." }, { line: "Explore." }],
        highlightedLine: "Learn.",
        tagline:
          "Guided kayak eco-tours through ancient cypress swamps, wild salt marshes, and pristine barrier islands.",
        primaryCtaText: "Book a Tour",
        primaryCtaHref: "/booking",
        secondaryCtaText: "Explore Tours",
        secondaryCtaHref: "/tours",
        imageUrl:
          "https://static.wixstatic.com/media/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg/v1/fill/w_1920,h_1080,al_c,q_85,enc_avif,quality_auto/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg",
        imageAlt: "Sunset over the Maryland salt marsh",
      }),
      block("FeaturesStrip", {
        features: [
          { iconType: "certified", title: "ACA Certified", description: "Level 1 Certified Kayak Instructor ensuring your safety and learning on every tour." },
          { iconType: "naturalist", title: "Local Naturalist", description: "Deep knowledge of local ecosystems, wildlife, and the cultural history of Maryland's Eastern Shore." },
          { iconType: "smallGroup", title: "Small Groups", description: "Limited to 6 kayaks (8 people max) for a personal, intimate experience on the water." },
          { iconType: "sunset", title: "Sunset & Full Moon", description: "Special sunset tours daily and full moon tours monthly for magical experiences on the water." },
        ],
      }),
      block("FeaturedToursSection", {
        eyebrow: "Our Tours",
        title: "Discover Maryland's Hidden Waterways",
        description: "Each tour is a unique journey through diverse ecosystems, rich history, and stunning natural beauty.",
        tours: [
          {
            title: "Pocomoke River",
            subtitle: "Bald Cypress Swamp",
            description: "Paddle the serene blackwaters of the Pocomoke River, home to the northernmost bald cypress swamp in the U.S. Close encounters with herons, owls, turtles, river otters, and longnose gar.",
            image: "https://static.wixstatic.com/media/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg",
            href: "/tours#pocomoke",
          },
          {
            title: "Assateague Island",
            subtitle: "National Seashore",
            description: "Paddle through calm bays, salt marshes, and winding channels. Spot wild ponies, ospreys, and herons while learning about shipwrecks and the island's shifting sands.",
            image: "https://static.wixstatic.com/media/5768ba_359609431599441684b622533bee766f~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250509_151508817_MP.jpg",
            href: "/tours#assateague",
          },
          {
            title: "Newport Bay",
            subtitle: "Salt Marsh Exploration",
            description: "Kayak through the largest continuous salt marsh in Worcester County. Glide along tidal creeks and open waters spotting osprey, herons, and other coastal wildlife.",
            image: "https://static.wixstatic.com/media/5768ba_a2d76f158bc74f90b6db4b28452ab0e1~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/20221012_121045.jpg",
            href: "/tours#newport",
          },
        ],
        ctaText: "View All Tours",
        ctaHref: "/tours",
      }),
      block("AboutPreviewSection", {
        eyebrow: "Our Story",
        title: "A Legacy of Love for Nature",
        body1: "W.H. Peters Outdoor Adventures is named after the man whose love of the natural world inspired everything we do. From childhood walks through the woods to summers fishing in Ocean City, Maryland, that sense of wonder has been passed down through generations.",
        body2: "Today, every tour is an opportunity to spark that same excitement and wonder in others — to help people form a personal connection to nature that inspires them to protect it.",
        ctaText: "Read Our Full Story",
        ctaHref: "/about",
        imageUrl: "https://static.wixstatic.com/media/5768ba_b0bd60522dbe4c95821c13551a01b85b~mv2.jpg/v1/crop/x_145,y_106,w_2291,h_1555/fill/w_824,h_560,al_c,q_85,enc_avif,quality_auto/PXL_20250811_124020150_edited.jpg",
        imageAlt: "Your guide on the water",
        statValue: "15+",
        statLabel: "Years on the water",
      }),
      block("TestimonialsSection", {
        eyebrow: "Testimonials",
        title: "What Our Guests Say",
        reviews: [
          { name: "Emily Johnson", quote: "The kayak tour was amazing! I learned so much and felt completely at ease." },
          { name: "Michael Chen", quote: "A fantastic adventure! The guide was knowledgeable and the scenery was breathtaking." },
          { name: "Sophie Martinez", quote: "Highly recommend! The kayak instruction was top-notch and very educational." },
        ],
        ctaText: "Read All Reviews →",
        ctaHref: "/reviews",
      }),
      block("SpecialToursSection", {
        cards: [
          {
            badge: "Daily",
            title: "Sunset Tours",
            description: "Watch the sky come alive as you paddle through serene waters at golden hour.",
            ctaText: "Book Sunset Tour",
            ctaHref: "/booking",
            imageUrl: "https://static.wixstatic.com/media/5768ba_388163a383e849019d7b74abfa4e0da0~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250823_233340318_MP.jpg",
            imageAlt: "Sunset kayaking",
          },
          {
            badge: "Monthly",
            title: "Full Moon Tours",
            description: "A magical nighttime paddle under the glow of the full moon.",
            ctaText: "Book Full Moon Tour",
            ctaHref: "/booking",
            imageUrl: "https://static.wixstatic.com/media/5768ba_b2953e61daad4dd08109df65193010b6~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251007_225010061.jpg",
            imageAlt: "Full moon kayaking",
          },
        ],
        cardHeight: "h-96",
        darkBackground: true,
      }),
    ],
  },

  {
    name: "Tours",
    url: "/tours",
    blocks: [
      block("PageHero", {
        eyebrow: "Guided Eco-Tours",
        title: "Explore Nature's Wonders",
        imageUrl: "https://static.wixstatic.com/media/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,enc_avif,quality_auto/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg",
        imageAlt: "Kayaking at sunset",
      }, { height: "50vh", minHeight: "400px" }),
      block("ToursIntroSection", {
        description: "Join me for exhilarating kayak eco-tours led by an experienced, local naturalist and ACA certified coastal kayak instructor. Experience diverse ecosystems, learn about local wildlife and rich cultural history, all while enjoying the beauty of nature paddling through serene waters.",
        badges: [
          { value: "All skill levels welcome" },
          { value: "Max 6 kayaks / 8 people" },
          { value: "Customizable dates & times" },
          { value: "Equipment provided" },
        ],
      }),
      block("TourDetailSection", {
        id: "newport",
        title: "Newport Bay Salt Marsh",
        tagline: "Kayak Maryland's hidden gem: Newport Bay's wild salt marsh.",
        description: "Paddle through the largest continuous salt marsh in Worcester County, Maryland on a peaceful 2-3 hour guided tour. You'll glide along tidal creeks and open waters, spotting osprey, herons, and other wildlife while learning the stories of Maryland's \"forgotten bays.\" Small groups, calm waters, and optional sunset departures make this experience perfect for all skill levels.",
        wildlife: [{ animal: "Osprey" }, { animal: "Herons" }, { animal: "Coastal Birds" }],
        duration: "2-3 hours",
        imageUrl: "https://static.wixstatic.com/media/5768ba_a2d76f158bc74f90b6db4b28452ab0e1~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/20221012_121045.jpg",
        imageAlt: "Newport Bay Salt Marsh",
        reversed: false,
      }),
      block("TourDetailSection", {
        id: "pocomoke",
        title: "Pocomoke River Bald Cypress Swamp",
        tagline: "Serenity, Wildlife, and Ancient Trees Await",
        description: "Paddle the serene blackwaters of the Pocomoke River, home to the northernmost bald cypress swamp in the U.S. This 2-3 hour guided tour is great for all skill levels and offers close encounters with wildlife like herons, owls, turtles, river otters, and even longnose gar.",
        wildlife: [{ animal: "Herons" }, { animal: "Owls" }, { animal: "Turtles" }, { animal: "River Otters" }, { animal: "Longnose Gar" }],
        duration: "2-3 hours",
        imageUrl: "https://static.wixstatic.com/media/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg",
        imageAlt: "Pocomoke River Bald Cypress Swamp",
        reversed: true,
      }),
      block("TourDetailSection", {
        id: "stmartin",
        title: "St. Martin River",
        tagline: "Follow the quiet bends of the St. Martin River and step into a story of wildlife, water, and renewal.",
        description: "Paddle into the hidden beauty of the upper St. Martin River on a guided kayak adventure. Experience a peaceful journey through marshes and forests alive with herons, eagles, and other wildlife. Along the way, discover the rich history of Bishopville Dam and the inspiring restoration efforts bringing new life to the river.",
        wildlife: [{ animal: "Herons" }, { animal: "Eagles" }, { animal: "Diverse Wildlife" }],
        duration: "2-3 hours",
        imageUrl: "https://static.wixstatic.com/media/5768ba_8efacc66b0074908b6c5c8b6a8abd3c7~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251106_215242625_edited.jpg",
        imageAlt: "St. Martin River",
        reversed: false,
      }),
      block("TourDetailSection", {
        id: "assateague",
        title: "Assateague Island National Seashore",
        tagline: "Where wild ponies roam, shipwreck tales linger, and the island itself is always on the move.",
        description: "Paddle through calm bays, salt marshes, and winding channels on a 2-3 hour guided kayak tour of Assateague Island National Seashore. Along the way, spot wild ponies, ospreys, herons, and other wildlife, while learning about shipwrecks, local watermen, and the island's shifting sands.",
        wildlife: [{ animal: "Wild Ponies" }, { animal: "Ospreys" }, { animal: "Herons" }],
        duration: "2-3 hours",
        imageUrl: "https://static.wixstatic.com/media/5768ba_359609431599441684b622533bee766f~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250509_151508817_MP.jpg",
        imageAlt: "Assateague Island National Seashore",
        reversed: true,
      }),
      block("SpecialToursSection", {
        eyebrow: "Special Experiences",
        sectionTitle: "Sunset & Full Moon Tours",
        cards: [
          {
            badge: "Runs Daily",
            title: "Sunset Kayak Tour",
            description: "Watch the sky transform as you paddle through golden-hour waters.",
            imageUrl: "https://static.wixstatic.com/media/5768ba_388163a383e849019d7b74abfa4e0da0~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250823_233340318_MP.jpg",
            imageAlt: "Sunset kayaking",
          },
          {
            badge: "Every Full Moon",
            title: "Full Moon Kayak Tour",
            description: "A magical nighttime paddle under the glow of the full moon.",
            imageUrl: "https://static.wixstatic.com/media/5768ba_b2953e61daad4dd08109df65193010b6~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251007_225010061.jpg",
            imageAlt: "Full moon kayaking",
          },
        ],
        cardHeight: "h-80",
        darkBackground: true,
      }),
      block("ToursImportantInfoSection", {
        title: "Important Information",
        items: [
          { text: "All participants must sign an assumption of risk and release of liability form. Children under 18 must have a parent or legal guardian co-sign." },
          { text: "Tours are easily accessible from Ocean City, Berlin, Snow Hill, Ocean Pines, Bishopville, Fenwick DE, and Selbyville DE." },
          { text: "All tours are customizable. Dates, times, and locations can be adjusted to accommodate your group." },
          { text: "Limited to 6 kayaks or 8 people (with tandem kayaks) per tour." },
        ],
      }),
    ],
  },

  {
    name: "About",
    url: "/about",
    blocks: [
      block("PageHero", {
        eyebrow: "Our Story",
        title: "Discover Our Journey",
        imageUrl: "https://static.wixstatic.com/media/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,enc_avif,quality_auto/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg",
        imageAlt: "Kayaking through the cypress swamp",
      }, { height: "50vh", minHeight: "400px" }),
      block("AboutPurposeSection", {
        eyebrow: "Our Purpose",
        title: "Inspiring Connection to Nature",
        paragraph1: "W.H. Peters Outdoor Adventures is dedicated to providing unforgettable kayak eco-tours and expert instruction. Guided by a local naturalist and ACA Certified Level 1 Kayak Instructor, my mission is to enhance your outdoor experience while promoting environmental awareness. I believe humanity's number one priority should be protecting the natural world that sustains us all — protecting ecosystems, wildlife, and in doing so, ourselves.",
        paragraph2: "The most meaningful way I can contribute to that goal is by helping people form a personal connection to nature. When something feels personal, people naturally want to protect it.",
        quote: "When someone begins to view nature as theirs — as something special and worth protecting — that's where real change begins.",
        paragraph3: "Through W.H. Peters Outdoor Adventures, I share my love, curiosity and wonder for the natural world with every guest. My goal is to spark excitement and wonder — to help people see the beauty and complexity of the environment that surrounds us.",
        paragraph4: "This belief is the foundation of my work and the guiding principle behind everything I do. Every tour, every conversation, and every moment on the water is an opportunity to inspire a lasting appreciation for the natural world and the responsibility we all share to preserve it.",
      }),
      block("AboutStorySection", {
        eyebrow: "The Name Behind the Adventures",
        title: "My Story",
        paragraph1: "W.H. Peters, or Bill, was born February 2, 1921 in Baltimore, MD. In January 1944 he married and five months later found himself at the helm of an LCVP delivering troops to Omaha Beach on D-Day during World War II.",
        paragraph2: "I knew him as Pop. Some of my earliest memories are sitting in a chair next to my Pop watching the birds at the numerous feeders he had outside the kitchen window. He made sure that his field guide for birds was always on the table and available for me to look through. I would spend hours watching the birds trying to learn which ones were in our yard.",
        paragraph3: "As I grew and my short, little kid legs were long enough to keep up, he would take me on walks through the woods near the house. He was constantly showing me the wonders of nature, be it around the house or during our summers in Ocean City, Maryland, fishing in the bay and exploring the salt marsh. I inherited his love of nature and being on the water, almost as if it was a genetic trait.",
        paragraph4: "The very last thing he said to me before passing in 1986 was to make him proud, and I have heard those words in my head every day since.",
        paragraph5: "When the idea of starting my own outdoor tour business came to me, I gave a lot of thought about the name of the company. Names like Osprey or Cypress, words that create images of the environment I spend my time in, seemed appropriate, but none felt like \"the one.\" One day, my genius wife asked me, \"What is your inspiration? Where does your love of all this come from?\"",
        paragraph6: "At that moment it all clicked — my grandfather! All those walks in the woods, all those hours sitting at the kitchen window, a lifetime of trying to make him proud. What better name for my business could there be?",
        closingQuote: "W.H. Peters Outdoor Adventures, named after the man who through his love inspired me to see the beauty of nature, to be curious about the world around us, and to want to share those experiences with others.",
        imageUrl: "https://static.wixstatic.com/media/5768ba_b0bd60522dbe4c95821c13551a01b85b~mv2.jpg/v1/crop/x_145,y_106,w_2291,h_1555/fill/w_824,h_560,al_c,q_85,enc_avif,quality_auto/PXL_20250811_124020150_edited.jpg",
        imageAlt: "Your guide on the water",
      }),
    ],
  },

  {
    name: "Booking",
    url: "/booking",
    blocks: [
      block("PageHero", {
        eyebrow: "Reserve Your Spot",
        title: "Book a Tour",
        imageUrl: "https://static.wixstatic.com/media/5768ba_8efacc66b0074908b6c5c8b6a8abd3c7~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,enc_avif,quality_auto/PXL_20251106_215242625_edited.jpg",
        imageAlt: "Sunset river view",
      }, { height: "40vh", minHeight: "350px" }),
      block("BookingOptionsSection", {
        title: "Choose Your Adventure",
        tours: [
          { name: "Newport Bay Salt Marsh Tour", duration: "2-3 hours", groupSize: "Up to 8 people", highlights: "Salt marsh, tidal creeks, osprey & herons" },
          { name: "Pocomoke River Cypress Swamp Tour", duration: "2-3 hours", groupSize: "Up to 8 people", highlights: "Bald cypress, blackwater, river otters & owls" },
          { name: "St. Martin River Tour", duration: "2-3 hours", groupSize: "Up to 8 people", highlights: "Marshes, forests, eagles & dam history" },
          { name: "Assateague Island Tour", duration: "2-3 hours", groupSize: "Up to 8 people", highlights: "Wild ponies, shipwreck tales, barrier island ecology" },
          { name: "Sunset Kayak Tour", duration: "2-3 hours", groupSize: "Up to 8 people", highlights: "Golden hour, stunning skies, serene waters" },
          { name: "Full Moon Kayak Tour", duration: "2-3 hours", groupSize: "Up to 8 people", highlights: "Moonlit paddle, night sounds, magical atmosphere" },
        ],
        customToursNote: "All tours are customizable. Dates, times, and locations can be adjusted to accommodate your group. Contact us to plan your perfect adventure.",
      }),
      block("BookingContactSidebar", {
        title: "Ready to Paddle?",
        description: "Contact us to check availability, ask questions, or book your guided kayak eco-tour. We'll help you choose the perfect adventure.",
        phone: "410-357-1025",
        email: "info@petersoutdoor.com",
        whatsIncluded: [
          { value: "Kayak & paddle equipment" },
          { value: "Safety gear (PFDs)" },
          { value: "Expert naturalist guide" },
          { value: "Wildlife & ecology education" },
          { value: "Small group experience" },
        ],
        importantNote: "All participants must sign a liability release form. Children under 18 require parent/guardian co-signature.",
      }),
    ],
  },

  {
    name: "Gallery",
    url: "/gallery",
    blocks: [
      block("PageHero", {
        eyebrow: "Moments on the Water",
        title: "Gallery",
        imageUrl: "https://static.wixstatic.com/media/5768ba_b2953e61daad4dd08109df65193010b6~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,enc_avif,quality_auto/PXL_20251007_225010061.jpg",
        imageAlt: "Full moon kayaking",
      }, { height: "40vh", minHeight: "350px" }),
      block("GalleryGridSection", {
        images: [
          { src: "https://static.wixstatic.com/media/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/5768ba_228ce943b71e4538a11a9ab52ddaf6ad~mv2.jpg", alt: "Sunset over the Maryland marsh", span: "col-span-2 row-span-2" },
          { src: "https://static.wixstatic.com/media/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg/v1/fill/w_600,h_600,al_c,q_85,enc_avif,quality_auto/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg", alt: "Pocomoke River kayaking through cypress trees", span: "" },
          { src: "https://static.wixstatic.com/media/5768ba_8efacc66b0074908b6c5c8b6a8abd3c7~mv2.jpg/v1/fill/w_600,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251106_215242625_edited.jpg", alt: "St. Martin River sunset", span: "" },
          { src: "https://static.wixstatic.com/media/5768ba_359609431599441684b622533bee766f~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250509_151508817_MP.jpg", alt: "Wild ponies at Assateague Island", span: "col-span-2" },
          { src: "https://static.wixstatic.com/media/5768ba_a2d76f158bc74f90b6db4b28452ab0e1~mv2.jpg/v1/fill/w_600,h_600,al_c,q_85,enc_avif,quality_auto/20221012_121045.jpg", alt: "Coastal forest at Newport Bay", span: "" },
          { src: "https://static.wixstatic.com/media/5768ba_388163a383e849019d7b74abfa4e0da0~mv2.jpg/v1/fill/w_600,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20250823_233340318_MP.jpg", alt: "Sunset kayak tour", span: "" },
          { src: "https://static.wixstatic.com/media/5768ba_b2953e61daad4dd08109df65193010b6~mv2.jpg/v1/fill/w_900,h_600,al_c,q_85,enc_avif,quality_auto/PXL_20251007_225010061.jpg", alt: "Full moon over the water", span: "col-span-2" },
          { src: "https://static.wixstatic.com/media/5768ba_b0bd60522dbe4c95821c13551a01b85b~mv2.jpg/v1/crop/x_145,y_106,w_2291,h_1555/fill/w_600,h_400,al_c,q_85,enc_avif,quality_auto/PXL_20250811_124020150_edited.jpg", alt: "Guide on the water", span: "" },
        ],
      }),
    ],
  },

  {
    name: "Reviews",
    url: "/reviews",
    blocks: [
      block("PageHero", {
        eyebrow: "Testimonials",
        title: "What Our Guests Say",
        imageUrl: "https://static.wixstatic.com/media/5768ba_388163a383e849019d7b74abfa4e0da0~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,enc_avif,quality_auto/PXL_20250823_233340318_MP.jpg",
        imageAlt: "Sunset kayaking",
      }, { height: "50vh", minHeight: "400px" }),
      block("ReviewStatsSection", {
        stats: [
          { value: "5.0", label: "Average Rating" },
          { value: "100%", label: "Would Recommend" },
          { value: "500+", label: "Happy Guests" },
        ],
      }),
      block("ReviewsGridSection", {
        intro: "At W.H. Peters Outdoor Adventures, we prioritize your experience. Here's what our wonderful guests have to say about their eco-tours and kayak adventures.",
        reviews: [
          { name: "Emily Johnson", quote: "The kayak tour was amazing! I learned so much and felt completely at ease. The guide's knowledge of the local ecosystem was incredible — I never knew there was so much hidden beauty right here on the Eastern Shore.", tour: "Newport Bay Tour", rating: 5 },
          { name: "Michael Chen", quote: "A fantastic adventure! The guide was knowledgeable and the scenery was breathtaking. We saw so many birds and even a family of river otters. This was the highlight of our vacation.", tour: "Pocomoke River Tour", rating: 5 },
          { name: "Sophie Martinez", quote: "Highly recommend! The kayak instruction was top-notch and very educational. As a first-time kayaker, I felt safe and supported the entire time. Can't wait to come back for the full moon tour!", tour: "Sunset Tour", rating: 5 },
          { name: "David & Sarah Thompson", quote: "We booked the Assateague Island tour for our anniversary and it was absolutely magical. Seeing the wild ponies from the water was an experience we'll never forget. The guide's passion for conservation really shines through.", tour: "Assateague Island Tour", rating: 5 },
          { name: "Rachel Kim", quote: "The full moon kayak tour was otherworldly. Paddling under the moonlight with the sounds of nature all around us was an experience I can't describe. Truly a must-do if you're in the Ocean City area.", tour: "Full Moon Tour", rating: 5 },
          { name: "James & Linda Peterson", quote: "We brought our kids (ages 10 and 13) on the St. Martin River tour. They learned so much about the local wildlife and history. It's rare to find an activity the whole family genuinely enjoys — this was it.", tour: "St. Martin River Tour", rating: 5 },
        ],
      }),
    ],
  },
];

console.log(`Creating/updating ${pages.length} pages in Builder.io...\n`);

for (const page of pages) {
  try {
    const result = await upsertPage(page.name, page.url, page.blocks);
    console.log(`  ✓ "${page.name}" → ${page.url} (id: ${result.id ?? result.results?.[0]?.id ?? "ok"})\n`);
  } catch (err) {
    console.error(`  ✗ "${page.name}" failed:`, err.message, "\n");
  }
}

console.log("Done.");
