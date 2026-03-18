interface ReviewItem {
  name: string;
  quote: string;
  tour?: string;
  rating?: number;
}

interface ReviewsGridSectionProps {
  intro?: string;
  reviews?: ReviewItem[];
}

const defaultReviews: ReviewItem[] = [
  {
    name: "Emily Johnson",
    quote:
      "The kayak tour was amazing! I learned so much and felt completely at ease. The guide's knowledge of the local ecosystem was incredible — I never knew there was so much hidden beauty right here on the Eastern Shore.",
    tour: "Newport Bay Tour",
    rating: 5,
  },
  {
    name: "Michael Chen",
    quote:
      "A fantastic adventure! The guide was knowledgeable and the scenery was breathtaking. We saw so many birds and even a family of river otters. This was the highlight of our vacation.",
    tour: "Pocomoke River Tour",
    rating: 5,
  },
  {
    name: "Sophie Martinez",
    quote:
      "Highly recommend! The kayak instruction was top-notch and very educational. As a first-time kayaker, I felt safe and supported the entire time. Can't wait to come back for the full moon tour!",
    tour: "Sunset Tour",
    rating: 5,
  },
  {
    name: "David & Sarah Thompson",
    quote:
      "We booked the Assateague Island tour for our anniversary and it was absolutely magical. Seeing the wild ponies from the water was an experience we'll never forget. The guide's passion for conservation really shines through.",
    tour: "Assateague Island Tour",
    rating: 5,
  },
  {
    name: "Rachel Kim",
    quote:
      "The full moon kayak tour was otherworldly. Paddling under the moonlight with the sounds of nature all around us was an experience I can't describe. Truly a must-do if you're in the Ocean City area.",
    tour: "Full Moon Tour",
    rating: 5,
  },
  {
    name: "James & Linda Peterson",
    quote:
      "We brought our kids (ages 10 and 13) on the St. Martin River tour. They learned so much about the local wildlife and history. It's rare to find an activity the whole family genuinely enjoys — this was it.",
    tour: "St. Martin River Tour",
    rating: 5,
  },
];

export default function ReviewsGridSection({
  intro = "At W.H. Peters Outdoor Adventures, we prioritize your experience. Here's what our wonderful guests have to say about their eco-tours and kayak adventures.",
  reviews = defaultReviews,
}: ReviewsGridSectionProps) {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-warm-gray text-lg max-w-2xl mx-auto">{intro}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="flex gap-1 text-gold mb-4">
                {[...Array(review.rating ?? 5)].map((_, j) => (
                  <svg key={j} className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              <p className="text-warm-gray leading-relaxed mb-6 flex-grow">
                &ldquo;{review.quote}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-sage-muted/20">
                <div>
                  <p className="font-semibold text-forest">{review.name}</p>
                  {review.tour && (
                    <p className="text-sage text-sm">{review.tour}</p>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full bg-sage-muted/30 flex items-center justify-center text-forest font-semibold text-sm">
                  {review.name.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
