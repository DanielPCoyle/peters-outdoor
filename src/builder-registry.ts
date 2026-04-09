import type { RegisteredComponent } from "@builder.io/sdk-react";
import TourCard from "@/components/TourCard";
import ToursIntroSection from "@/components/sections/ToursIntroSection";
import ToursImportantInfoSection from "@/components/sections/ToursImportantInfoSection";
import AboutPurposeSection from "@/components/sections/AboutPurposeSection";
import AboutStorySection from "@/components/sections/AboutStorySection";
import BookingContactSidebar from "@/components/sections/BookingContactSidebar";
import HomeHero from "@/components/sections/HomeHero";
import PageHero from "@/components/sections/PageHero";
import FeaturesStrip from "@/components/sections/FeaturesStrip";
import FeaturedToursSection from "@/components/sections/FeaturedToursSection";
import AboutPreviewSection from "@/components/sections/AboutPreviewSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import SpecialToursSection from "@/components/sections/SpecialToursSection";
import TourDetailSection from "@/components/sections/TourDetailSection";
import ReviewStatsSection from "@/components/sections/ReviewStatsSection";
import ReviewsGridSection from "@/components/sections/ReviewsGridSection";
import GalleryGridSection from "@/components/sections/GalleryGridSection";
import BookingOptionsSection from "@/components/sections/BookingOptionsSection";
import BookingFormBlock from "@/components/sections/BookingFormBlock";
import GroupBookingSection from "@/components/sections/GroupBookingSection";
import LegalPage from "@/components/sections/LegalPage";
import GiftCertIntroSection from "@/components/sections/GiftCertIntroSection";
import GiftCertHowItWorksSection from "@/components/sections/GiftCertHowItWorksSection";
import GiftCertFormSection from "@/components/sections/GiftCertFormSection";
import GiftCertCtaSection from "@/components/sections/GiftCertCtaSection";

export const builderComponents: RegisteredComponent[] = [
  {
    component: TourCard,
    name: "TourCard",
    inputs: [
      { name: "title", type: "string", required: true },
      { name: "subtitle", type: "string" },
      { name: "description", type: "string" },
      {
        name: "image",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "webp", "avif"],
      },
      { name: "href", type: "string" },
      { name: "duration", type: "string", defaultValue: "2-3 hours" },
      { name: "difficulty", type: "string", defaultValue: "All levels" },
    ],
  },

  {
    component: HomeHero,
    name: "HomeHero",
    inputs: [
      { name: "eyebrow", type: "string", defaultValue: "Ocean City, Maryland" },
      {
        name: "headlineLines",
        type: "list",
        subFields: [{ name: "line", type: "string" }],
        defaultValue: [{ line: "Paddle." }, { line: "Explore." }],
      },
      { name: "highlightedLine", type: "string", defaultValue: "Learn." },
      {
        name: "tagline",
        type: "longText",
        defaultValue:
          "Guided kayak eco-tours through ancient cypress swamps, wild salt marshes, and pristine barrier islands.",
      },
      { name: "primaryCtaText", type: "string", defaultValue: "Book a Tour" },
      { name: "primaryCtaHref", type: "string", defaultValue: "/booking" },
      { name: "secondaryCtaText", type: "string", defaultValue: "Explore Tours" },
      { name: "secondaryCtaHref", type: "string", defaultValue: "/tours" },
      {
        name: "imageUrl",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "webp", "avif"],
      },
      { name: "imageAlt", type: "string" },
    ],
  },

  {
    component: PageHero,
    name: "PageHero",
    inputs: [
      { name: "eyebrow", type: "string" },
      { name: "title", type: "string", required: true },
      {
        name: "imageUrl",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "webp", "avif"],
        required: true,
      },
      { name: "imageAlt", type: "string" },
    ],
  },

  {
    component: FeaturesStrip,
    name: "FeaturesStrip",
    inputs: [
      {
        name: "features",
        type: "list",
        subFields: [
          {
            name: "iconType",
            type: "string",
            enum: ["certified", "naturalist", "smallGroup", "sunset"],
            defaultValue: "certified",
          },
          { name: "title", type: "string" },
          { name: "description", type: "string" },
        ],
      },
    ],
  },

  {
    component: FeaturedToursSection,
    name: "FeaturedToursSection",
    inputs: [
      { name: "eyebrow", type: "string", defaultValue: "Our Tours" },
      {
        name: "title",
        type: "string",
        defaultValue: "Discover Maryland's Hidden Waterways",
      },
      { name: "description", type: "longText" },
      {
        name: "useDbTours",
        type: "boolean",
        defaultValue: false,
        helperText: "When enabled, pulls tours live from the database instead of the list below.",
      },
      {
        name: "tours",
        type: "list",
        subFields: [
          { name: "title", type: "string" },
          { name: "subtitle", type: "string" },
          { name: "description", type: "longText" },
          {
            name: "image",
            type: "file",
            allowedFileTypes: ["jpeg", "jpg", "png", "webp", "avif"],
          },
          { name: "href", type: "string" },
          { name: "duration", type: "string", defaultValue: "2-3 hours" },
          { name: "difficulty", type: "string", defaultValue: "All levels" },
        ],
      },
      { name: "ctaText", type: "string", defaultValue: "View All Tours" },
      { name: "ctaHref", type: "string", defaultValue: "/tours" },
    ],
  },

  {
    component: AboutPreviewSection,
    name: "AboutPreviewSection",
    inputs: [
      { name: "eyebrow", type: "string", defaultValue: "Our Story" },
      { name: "title", type: "string", defaultValue: "A Legacy of Love for Nature" },
      { name: "body1", type: "longText" },
      { name: "body2", type: "longText" },
      { name: "ctaText", type: "string", defaultValue: "Read Our Full Story" },
      { name: "ctaHref", type: "string", defaultValue: "/about" },
      {
        name: "imageUrl",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "webp", "avif"],
      },
      { name: "imageAlt", type: "string" },
      { name: "statValue", type: "string", defaultValue: "15+" },
      { name: "statLabel", type: "string", defaultValue: "Years on the water" },
    ],
  },

  {
    component: TestimonialsSection,
    name: "TestimonialsSection",
    inputs: [
      { name: "eyebrow", type: "string", defaultValue: "Testimonials" },
      { name: "title", type: "string", defaultValue: "What Our Guests Say" },
      {
        name: "reviews",
        type: "list",
        subFields: [
          { name: "name", type: "string" },
          { name: "quote", type: "longText" },
        ],
      },
      { name: "ctaText", type: "string", defaultValue: "Read All Reviews →" },
      { name: "ctaHref", type: "string", defaultValue: "/reviews" },
    ],
  },

  {
    component: SpecialToursSection,
    name: "SpecialToursSection",
    inputs: [
      { name: "eyebrow", type: "string" },
      { name: "sectionTitle", type: "string" },
      {
        name: "cards",
        type: "list",
        subFields: [
          { name: "badge", type: "string" },
          { name: "title", type: "string" },
          { name: "description", type: "longText" },
          { name: "ctaText", type: "string" },
          { name: "ctaHref", type: "string" },
          {
            name: "imageUrl",
            type: "file",
            allowedFileTypes: ["jpeg", "jpg", "png", "webp", "avif"],
          },
          { name: "imageAlt", type: "string" },
        ],
      },
      {
        name: "cardHeight",
        type: "string",
        enum: ["h-96", "h-80"],
        defaultValue: "h-96",
      },
      { name: "darkBackground", type: "boolean", defaultValue: true },
    ],
  },

  {
    component: TourDetailSection,
    name: "TourDetailSection",
    inputs: [
      {
        name: "tourId",
        type: "string",
        helperText: "Paste a Tour ID from /admin/tours. The component will display live data from the database for that tour and show a tour picker in the editor when left empty.",
      },
      { name: "id", type: "string" },
      { name: "title", type: "string" },
      { name: "tagline", type: "string" },
      { name: "description", type: "longText", required: true },
      {
        name: "wildlife",
        type: "list",
        subFields: [{ name: "animal", type: "string" }],
      },
      { name: "duration", type: "string", defaultValue: "2-3 hours" },
      {
        name: "imageUrl",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "webp", "avif"],
        required: true,
      },
      { name: "imageAlt", type: "string" },
      { name: "reversed", type: "boolean", defaultValue: false },
      { name: "ctaText", type: "string", defaultValue: "Book This Tour" },
      { name: "ctaHref", type: "string", defaultValue: "/booking" },
    ],
  },

  {
    component: ReviewStatsSection,
    name: "ReviewStatsSection",
    inputs: [
      {
        name: "stats",
        type: "list",
        subFields: [
          { name: "value", type: "string" },
          { name: "label", type: "string" },
        ],
      },
    ],
  },

  {
    component: ReviewsGridSection,
    name: "ReviewsGridSection",
    inputs: [
      { name: "intro", type: "longText" },
      {
        name: "reviews",
        type: "list",
        subFields: [
          { name: "name", type: "string" },
          { name: "quote", type: "longText" },
          { name: "tour", type: "string" },
          { name: "rating", type: "number", defaultValue: 5 },
        ],
      },
    ],
  },

  {
    component: GalleryGridSection,
    name: "GalleryGridSection",
    inputs: [
      {
        name: "images",
        type: "list",
        subFields: [
          {
            name: "src",
            type: "file",
            allowedFileTypes: ["jpeg", "jpg", "png", "webp", "avif"],
          },
          { name: "alt", type: "string" },
          { name: "span", type: "string", helperText: "CSS grid span class, e.g. col-span-2 row-span-2" },
        ],
      },
    ],
  },

  {
    component: ToursIntroSection,
    name: "ToursIntroSection",
    inputs: [
      { name: "description", type: "longText" },
      {
        name: "badges",
        type: "list",
        subFields: [{ name: "value", type: "string" }],
      },
    ],
  },

  {
    component: ToursImportantInfoSection,
    name: "ToursImportantInfoSection",
    inputs: [
      { name: "title", type: "string", defaultValue: "Important Information" },
      {
        name: "items",
        type: "list",
        subFields: [{ name: "text", type: "longText" }],
      },
    ],
  },

  {
    component: AboutPurposeSection,
    name: "AboutPurposeSection",
    inputs: [
      { name: "eyebrow", type: "string", defaultValue: "Our Purpose" },
      { name: "title", type: "string", defaultValue: "Inspiring Connection to Nature" },
      { name: "paragraph1", type: "longText" },
      { name: "paragraph2", type: "longText" },
      { name: "quote", type: "longText" },
      { name: "paragraph3", type: "longText" },
      { name: "paragraph4", type: "longText" },
    ],
  },

  {
    component: AboutStorySection,
    name: "AboutStorySection",
    inputs: [
      { name: "eyebrow", type: "string", defaultValue: "The Name Behind the Adventures" },
      { name: "title", type: "string", defaultValue: "My Story" },
      { name: "paragraph1", type: "longText" },
      { name: "paragraph2", type: "longText" },
      { name: "paragraph3", type: "longText" },
      { name: "paragraph4", type: "longText" },
      { name: "paragraph5", type: "longText" },
      { name: "paragraph6", type: "longText" },
      { name: "closingQuote", type: "longText" },
      {
        name: "grandfatherImageUrl",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "webp", "avif"],
        friendlyName: "Grandfather Photo",
        helperText: "If set, the image crossfades from grandfather to guide photo as the user scrolls",
      },
      { name: "grandfatherImageAlt", type: "string", defaultValue: "W.H. Peters — the inspiration" },
      {
        name: "imageUrl",
        type: "file",
        allowedFileTypes: ["jpeg", "jpg", "png", "webp", "avif"],
      },
      { name: "imageAlt", type: "string" },
    ],
  },

  {
    component: BookingContactSidebar,
    name: "BookingContactSidebar",
    inputs: [
      { name: "title", type: "string", defaultValue: "Ready to Paddle?" },
      { name: "description", type: "longText" },
      { name: "phone", type: "string", defaultValue: "410-357-1025" },
      { name: "email", type: "string", defaultValue: "info@petersoutdoor.com" },
      {
        name: "whatsIncluded",
        type: "list",
        subFields: [{ name: "value", type: "string" }],
      },
      { name: "importantNote", type: "longText" },
    ],
  },

  {
    component: BookingOptionsSection,
    name: "BookingOptionsSection",
    inputs: [
      { name: "title", type: "string", defaultValue: "Choose Your Adventure" },
      {
        name: "tours",
        type: "list",
        subFields: [
          { name: "name", type: "string" },
          { name: "duration", type: "string" },
          { name: "groupSize", type: "string" },
          { name: "highlights", type: "string" },
        ],
      },
      { name: "customToursNote", type: "longText" },
    ],
  },

  {
    component: BookingFormBlock,
    name: "BookingFormBlock",
    inputs: [
      { name: "sectionTitle", type: "string", defaultValue: "Reserve Your Spot" },
      { name: "sectionSubtitle", type: "string", defaultValue: "Select your tour, pick a date, and secure your booking in minutes." },
      { name: "showGroupSidebar", type: "boolean", defaultValue: true },
      { name: "sidebarEyebrow", type: "string", defaultValue: "Groups & Corporate" },
      { name: "sidebarTitle", type: "string", defaultValue: "Planning a Group Adventure?" },
      {
        name: "sidebarDescription",
        type: "longText",
        defaultValue: "Corporate outings, family reunions, birthday paddles, or team-building retreats — we'll customize every detail. Private tours and group pricing for parties of 9+.",
      },
      {
        name: "sidebarPerks",
        type: "list",
        subFields: [{ name: "label", type: "string" }],
        defaultValue: [
          { label: "Private guided tour — just your group" },
          { label: "Flexible route, date, and start time" },
          { label: "Perfect for corporate team building" },
          { label: "Celebrations, reunions, bachelorette parties" },
        ],
      },
      { name: "sidebarEmailLabel", type: "string", defaultValue: "Email Us for Group Pricing" },
      { name: "sidebarEmail", type: "string", defaultValue: "info@petersoutdoor.com" },
      { name: "sidebarPhoneLabel", type: "string", defaultValue: "Call 410-357-1025" },
      { name: "sidebarPhone", type: "string", defaultValue: "410-357-1025" },
    ],
  },

  {
    component: GroupBookingSection,
    name: "GroupBookingSection",
    inputs: [
      { name: "eyebrow", type: "string", defaultValue: "Groups & Corporate" },
      { name: "title", type: "string", defaultValue: "Planning a Group Adventure?" },
      {
        name: "description",
        type: "longText",
        defaultValue: "Whether it's a corporate outing, family reunion, birthday paddle, or team-building retreat — we'll customize every detail for your group. Private tours, flexible scheduling, and group pricing available for parties of 9 or more.",
      },
      {
        name: "perks",
        type: "list",
        subFields: [{ name: "label", type: "string" }],
        defaultValue: [
          { label: "Private guided tour — just your group" },
          { label: "Flexible route, date, and start time" },
          { label: "Perfect for corporate team building" },
          { label: "Celebrations, reunions, bachelorette parties" },
        ],
      },
      { name: "emailLabel", type: "string", defaultValue: "Email Us for Group Pricing" },
      { name: "email", type: "string", defaultValue: "info@petersoutdoor.com" },
      { name: "phone", type: "string", defaultValue: "410-357-1025" },
    ],
  },

  {
    component: LegalPage,
    name: "LegalPage",
    inputs: [
      { name: "title", type: "string", required: true, defaultValue: "Legal" },
      { name: "lastUpdated", type: "string", defaultValue: "March 2026" },
      {
        name: "sections",
        type: "list",
        subFields: [
          { name: "heading", type: "string", required: true },
          { name: "body", type: "longText", required: true },
        ],
        defaultValue: [],
      },
    ],
  },

  {
    component: GiftCertIntroSection,
    name: "GiftCertIntroSection",
    inputs: [
      { name: "title", type: "string", defaultValue: "The Most Memorable Gift They'll Ever Receive" },
      {
        name: "description",
        type: "longText",
        defaultValue: "Skip the stuff. Give an experience they'll talk about for years. A W.H. Peters Outdoor Adventures gift certificate is redeemable for any tour, any date — no expiration.",
      },
      {
        name: "occasions",
        type: "list",
        subFields: [{ name: "value", type: "string" }],
        defaultValue: [
          { value: "Birthdays" },
          { value: "Anniversaries" },
          { value: "Holidays" },
          { value: "Graduations" },
          { value: "Mother's / Father's Day" },
          { value: "Corporate Gifts" },
          { value: "Just Because" },
        ],
      },
    ],
  },

  {
    component: GiftCertHowItWorksSection,
    name: "GiftCertHowItWorksSection",
    inputs: [
      {
        name: "steps",
        type: "list",
        subFields: [
          { name: "step", type: "string" },
          { name: "title", type: "string" },
          { name: "body", type: "longText" },
        ],
        defaultValue: [
          { step: "01", title: "Choose Your Amount", body: "Pick a denomination or enter a custom amount. Any tour, any date." },
          { step: "02", title: "We Send the Certificate", body: "You'll receive a personalized PDF gift certificate by email within 24 hours." },
          { step: "03", title: "Recipient Books Their Tour", body: "They pick their tour and date, then apply the certificate at checkout." },
        ],
      },
    ],
  },

  {
    component: GiftCertFormSection,
    name: "GiftCertFormSection",
    inputs: [
      { name: "whatsIncludedTitle", type: "string", defaultValue: "What's Included" },
      {
        name: "whatsIncluded",
        type: "list",
        subFields: [{ name: "value", type: "string" }],
        defaultValue: [
          { value: "Valid for any tour (Newport Bay, Pocomoke, Assateague, St. Martin, Sunset, Full Moon)" },
          { value: "Redeemable for any available date" },
          { value: "No expiration date" },
          { value: "Transferable — gift it to anyone" },
          { value: "All equipment provided (kayak, paddle, PFD)" },
        ],
      },
      { name: "popularAmountsTitle", type: "string", defaultValue: "Popular Amounts" },
      {
        name: "popularAmounts",
        type: "list",
        subFields: [
          { name: "label", type: "string" },
          { name: "amount", type: "string" },
        ],
        defaultValue: [
          { label: "1 Standard Tour", amount: "$75" },
          { label: "1 Premium Tour (Sunset or Full Moon)", amount: "$85" },
          { label: "2 People, Standard Tour", amount: "$150" },
          { label: "2 People, Premium Tour", amount: "$170" },
        ],
      },
      { name: "questionsTitle", type: "string", defaultValue: "Questions?" },
      { name: "questionsDescription", type: "longText", defaultValue: "We're happy to help you choose the right gift." },
      { name: "email", type: "string", defaultValue: "info@petersoutdoor.com" },
      { name: "phone", type: "string", defaultValue: "410-357-1025" },
    ],
  },

  {
    component: GiftCertCtaSection,
    name: "GiftCertCtaSection",
    inputs: [
      { name: "eyebrow", type: "string", defaultValue: "Ready to Paddle?" },
      { name: "title", type: "string", defaultValue: "Want to book a tour for yourself?" },
      { name: "ctaText", type: "string", defaultValue: "Book a Tour" },
      { name: "ctaHref", type: "string", defaultValue: "/booking" },
    ],
  },
];
