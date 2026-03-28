interface ParagraphItem {
  text: string;
}

interface AboutPurposeSectionProps {
  eyebrow?: string;
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
  quote?: string;
  paragraph3?: string;
  paragraph4?: string;
}

export default function AboutPurposeSection({
  eyebrow = "Our Purpose",
  title = "Inspiring Connection to Nature",
  paragraph1 = "W.H. Peters Outdoor Adventures is dedicated to providing unforgettable kayak eco-tours and expert instruction. Guided by a local naturalist and ACA Certified Level 1 Kayak Instructor, my mission is to enhance your outdoor experience while promoting environmental awareness. I believe humanity's number one priority should be protecting the natural world that sustains us all — protecting ecosystems, wildlife, and in doing so, ourselves.",
  paragraph2 = "The most meaningful way I can contribute to that goal is by helping people form a personal connection to nature. When something feels personal, people naturally want to protect it.",
  quote = "When someone begins to view nature as theirs — as something special and worth protecting — that's where real change begins.",
  paragraph3 = "Through W.H. Peters Outdoor Adventures, I share my love, curiosity and wonder for the natural world with every guest. My goal is to spark excitement and wonder — to help people see the beauty and complexity of the environment that surrounds us.",
  paragraph4 = "This belief is the foundation of my work and the guiding principle behind everything I do. Every tour, every conversation, and every moment on the water is an opportunity to inspire a lasting appreciation for the natural world and the responsibility we all share to preserve it.",
}: AboutPurposeSectionProps) {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sage text-sm font-medium tracking-[0.3em] uppercase mb-3">
            {eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-forest mb-8">
            {title}
          </h2>
        </div>

        <div className="space-y-6 text-warm-gray leading-relaxed text-lg">
          <p>{paragraph1}</p>
          <p>{paragraph2}</p>

          <div className="bg-forest text-cream rounded-2xl p-8 md:p-12 my-12 text-center">
            <p className="font-serif text-2xl md:text-3xl font-medium italic leading-relaxed">
              {quote}
            </p>
          </div>

          <p>{paragraph3}</p>
          <p>{paragraph4}</p>
        </div>
      </div>
    </section>
  );
}
