import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn the story behind W.H. Peters Outdoor Adventures — a legacy of love for nature passed down through generations.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <Image
          src="https://static.wixstatic.com/media/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg/v1/fill/w_1920,h_800,al_c,q_85,enc_avif,quality_auto/5768ba_3bc8f28567d84fdbba85e29534c0e859~mv2.jpg"
          alt="Kayaking through the cypress swamp"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-forest/60" />
        <div className="relative z-10 text-center text-white px-6">
          <p className="text-sage-light text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold">
            Discover Our Journey
          </h1>
        </div>
      </section>

      {/* Our Purpose */}
      <section className="py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sage text-sm font-medium tracking-[0.3em] uppercase mb-3">
              Our Purpose
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest mb-8">
              Inspiring Connection to Nature
            </h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="space-y-6 text-warm-gray leading-relaxed text-lg">
              <p>
                W.H. Peters Outdoor Adventures is dedicated to providing
                unforgettable kayak eco-tours and expert instruction. Guided by a
                local naturalist and ACA Certified Level 1 Kayak Instructor, my
                mission is to enhance your outdoor experience while promoting
                environmental awareness. I believe humanity&apos;s number one
                priority should be protecting the natural world that sustains us
                all &mdash; protecting ecosystems, wildlife, and in doing so,
                ourselves.
              </p>

              <p>
                The most meaningful way I can contribute to that goal is by
                helping people form a personal connection to nature. When
                something feels personal, people naturally want to protect it.
              </p>

              <div className="bg-forest text-cream rounded-2xl p-8 md:p-12 my-12 text-center">
                <svg
                  className="w-10 h-10 text-gold mx-auto mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="font-serif text-2xl md:text-3xl font-medium italic leading-relaxed">
                  When someone begins to view nature as{" "}
                  <span className="text-gold">theirs</span> &mdash; as something
                  special and worth protecting &mdash; that&apos;s where real
                  change begins.
                </p>
              </div>

              <p>
                Through W.H. Peters Outdoor Adventures, I share my love,
                curiosity and wonder for the natural world with every guest. My
                goal is to spark excitement and wonder &mdash; to help people see
                the beauty and complexity of the environment that surrounds us.
              </p>

              <p>
                This belief is the foundation of my work and the guiding
                principle behind everything I do. Every tour, every conversation,
                and every moment on the water is an opportunity to inspire a
                lasting appreciation for the natural world and the responsibility
                we all share to preserve it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* My Story */}
      <section className="py-24 bg-cream-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-sage text-sm font-medium tracking-[0.3em] uppercase mb-3">
                The Name Behind the Adventures
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest mb-8">
                My Story
              </h2>

              <div className="space-y-6 text-warm-gray leading-relaxed">
                <p>
                  W.H. Peters, or Bill, was born February 2, 1921 in Baltimore,
                  MD. In January 1944 he married and five months later found
                  himself at the helm of an LCVP delivering troops to Omaha Beach
                  on D-Day during World War II.
                </p>

                <p>
                  I knew him as Pop. Some of my earliest memories are sitting in
                  a chair next to my Pop watching the birds at the numerous
                  feeders he had outside the kitchen window. He made sure that his
                  field guide for birds was always on the table and available for
                  me to look through. I would spend hours watching the birds
                  trying to learn which ones were in our yard.
                </p>

                <p>
                  As I grew and my short, little kid legs were long enough to keep
                  up, he would take me on walks through the woods near the house.
                  He was constantly showing me the wonders of nature, be it around
                  the house or during our summers in Ocean City, Maryland, fishing
                  in the bay and exploring the salt marsh. I inherited his love of
                  nature and being on the water, almost as if it was a genetic
                  trait.
                </p>

                <p>
                  The very last thing he said to me before passing in 1986 was to
                  make him proud, and I have heard those words in my head every
                  day since.
                </p>

                <p>
                  When the idea of starting my own outdoor tour business came to
                  me, I gave a lot of thought about the name of the company.
                  Names like Osprey or Cypress, words that create images of the
                  environment I spend my time in, seemed appropriate, but none
                  felt like &ldquo;the one.&rdquo; One day, my genius wife asked
                  me, &ldquo;What is your inspiration? Where does your love of
                  all this come from?&rdquo;
                </p>

                <p>
                  At that moment it all clicked &mdash; my grandfather! All those
                  walks in the woods, all those hours sitting at the kitchen
                  window, a lifetime of trying to make him proud. What better name
                  for my business could there be?
                </p>

                <div className="bg-white rounded-2xl p-8 border border-sage-muted/30 mt-8">
                  <p className="font-serif text-xl text-forest leading-relaxed italic">
                    W.H. Peters Outdoor Adventures, named after the man who
                    through his love inspired me to see the beauty of nature, to
                    be curious about the world around us, and to want to share
                    those experiences with others.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-32">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://static.wixstatic.com/media/5768ba_b0bd60522dbe4c95821c13551a01b85b~mv2.jpg/v1/crop/x_145,y_106,w_2291,h_1555/fill/w_824,h_560,al_c,q_85,enc_avif,quality_auto/PXL_20250811_124020150_edited.jpg"
                  alt="Your guide on the water"
                  width={824}
                  height={560}
                  className="w-full"
                />
              </div>

              {/* Credentials */}
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
    </>
  );
}
