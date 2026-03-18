import Image from "next/image";

interface AboutStorySectionProps {
  eyebrow?: string;
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
  paragraph3?: string;
  paragraph4?: string;
  paragraph5?: string;
  paragraph6?: string;
  closingQuote?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export default function AboutStorySection({
  eyebrow = "The Name Behind the Adventures",
  title = "My Story",
  paragraph1 = "W.H. Peters, or Bill, was born February 2, 1921 in Baltimore, MD. In January 1944 he married and five months later found himself at the helm of an LCVP delivering troops to Omaha Beach on D-Day during World War II.",
  paragraph2 = "I knew him as Pop. Some of my earliest memories are sitting in a chair next to my Pop watching the birds at the numerous feeders he had outside the kitchen window. He made sure that his field guide for birds was always on the table and available for me to look through. I would spend hours watching the birds trying to learn which ones were in our yard.",
  paragraph3 = "As I grew and my short, little kid legs were long enough to keep up, he would take me on walks through the woods near the house. He was constantly showing me the wonders of nature, be it around the house or during our summers in Ocean City, Maryland, fishing in the bay and exploring the salt marsh. I inherited his love of nature and being on the water, almost as if it was a genetic trait.",
  paragraph4 = "The very last thing he said to me before passing in 1986 was to make him proud, and I have heard those words in my head every day since.",
  paragraph5 = "When the idea of starting my own outdoor tour business came to me, I gave a lot of thought about the name of the company. Names like Osprey or Cypress, words that create images of the environment I spend my time in, seemed appropriate, but none felt like \"the one.\" One day, my genius wife asked me, \"What is your inspiration? Where does your love of all this come from?\"",
  paragraph6 = "At that moment it all clicked — my grandfather! All those walks in the woods, all those hours sitting at the kitchen window, a lifetime of trying to make him proud. What better name for my business could there be?",
  closingQuote = "W.H. Peters Outdoor Adventures, named after the man who through his love inspired me to see the beauty of nature, to be curious about the world around us, and to want to share those experiences with others.",
  imageUrl = "https://static.wixstatic.com/media/5768ba_b0bd60522dbe4c95821c13551a01b85b~mv2.jpg/v1/crop/x_145,y_106,w_2291,h_1555/fill/w_824,h_560,al_c,q_85,enc_avif,quality_auto/PXL_20250811_124020150_edited.jpg",
  imageAlt = "Your guide on the water",
}: AboutStorySectionProps) {
  const paragraphs = [paragraph1, paragraph2, paragraph3, paragraph4, paragraph5, paragraph6].filter(Boolean);

  return (
    <section className="py-24 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-sage text-sm font-medium tracking-[0.3em] uppercase mb-3">
              {eyebrow}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest mb-8">
              {title}
            </h2>

            <div className="space-y-6 text-warm-gray leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              <div className="bg-white rounded-2xl p-8 border border-sage-muted/30 mt-8">
                <p className="font-serif text-xl text-forest leading-relaxed italic">
                  {closingQuote}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-32">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={imageUrl}
                alt={imageAlt}
                width={824}
                height={560}
                className="w-full"
              />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-sage/20 text-sage flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="font-semibold text-forest text-sm">ACA Certified</p>
                <p className="text-warm-gray text-xs">Level 1 Instructor</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-sage/20 text-sage flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-forest text-sm">Local Naturalist</p>
                <p className="text-warm-gray text-xs">Eastern Shore Expert</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
