
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="pt-40 pb-32 bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-700">
      {/* Hero */}
      <section className="px-6 md:px-12 mb-32 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl serif mb-8">Our Story</h1>
        <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--primary-peony)] font-bold">Handmade with Intention</p>
      </section>

      {/* Founder's Letter */}
      <section className="bg-[var(--primary-peony)]/10 py-24 md:py-40 px-6 md:px-12 reveal">
        <div className="max-w-3xl mx-auto bg-[var(--bg-card)] p-8 md:p-20 lg:p-24 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] relative overflow-hidden border border-[var(--border-subtle)] rounded-xl">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--primary-peony)] opacity-40"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl serif italic mb-16 text-[var(--primary-peony)]">A Letter from Nishma</h2>
            <div className="space-y-10 text-lg md:text-xl font-light leading-[1.8] text-[var(--text-main)] serif">
              <p className="first-letter:text-5xl first-letter:mr-3 first-letter:float-left first-letter:bg-[var(--primary-peony)] first-letter:text-white first-letter:px-2 first-letter:mt-1 first-letter:rounded-sm">
                Dear Nichema Family,
              </p>
              
              <p>
                I’ve always struggled with dry skin. No matter how many high-end creams and lotions I tried, my skin would feel good for a while but soon start asking for more — almost as if it had become dependent on the products without truly being nourished.
              </p>

              <p>
                I wanted something that would deeply satisfy my skin — keeping it soft, hydrated, and comfortable for 24 hours or more. That search led me to explore the world of natural ingredients. I read, researched, experimented, and tested everything on my own skin first.
              </p>

              <p>
                That’s how my scrub was born — gentle enough to exfoliate without irritation, yet hydrating enough to leave my skin feeling fresh and even-toned. To lock in that moisture, I created my Shatapata Face & Body Butter. And when paired with my Botanical Toner — sprayed as a gentle mist, patted in, and followed by the butter — the results were simply magical.
              </p>

              <p>
                But my journey didn’t stop at skin. As a professional hairdresser, I’ve spent years understanding hair — how it responds to colour, cuts, and styling. That’s where my hair elixir and tonic came in — blends designed to help hair grow, strengthen, and shine naturally.
              </p>

              <p>
                Because everything I make is rooted in pure, natural ingredients rich in hydration, antioxidants, and rejuvenating properties, the benefits extend to all skin types and all hair types, across all ages.
              </p>

              <p>
                Every batch is handmade at home with care. Because it’s natural, you might notice slight variations in texture — but I promise, the goodness inside will always be the same.
              </p>

              <div className="pt-16 border-t border-[var(--border-subtle)]">
                <p className="italic font-medium text-[var(--primary-peony)]">With warmth,</p>
                <p className="italic">Nishma</p>
                <p className="text-[10px] uppercase tracking-[0.2em] mt-3 font-extrabold opacity-40">Founder, NICHEMA</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 text-[200px] opacity-[0.05] pointer-events-none rotate-12 text-[var(--primary-peony)]">🍃</div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-40 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
          {[
            { title: 'Handmade with Love', desc: 'Each batch is crafted by hand, not by machine. We infuse every jar with positive intention and prayer for your well-being.' },
            { title: 'Preservative Free', desc: 'We prioritize skin health over shelf life. Potency is our metric of success, requiring refrigeration to preserve natural goodness.' },
            { title: 'Circular Beauty', desc: 'Our packaging is just the beginning. We design for reuse and minimal environmental impact through glass and recycled materials.' }
          ].map((v, i) => (
            <div key={i} className="space-y-6 reveal group" style={{ transitionDelay: `${i * 0.2}s` }}>
              <div className="h-0.5 w-12 bg-[var(--primary-peony)]/40 group-hover:w-24 transition-all duration-500"></div>
              <h4 className="text-3xl serif italic text-[var(--text-main)] group-hover:text-[var(--primary-peony)] transition-colors">{v.title}</h4>
              <p className="text-[16px] font-normal text-[var(--text-muted)] leading-[1.7]">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section className="h-[80vh] reveal overflow-hidden relative">
        <div className="absolute inset-0 bg-[var(--bg-main)]/30 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=1920" 
          alt="Minimalistic Botanical Skincare Texture" 
          className="w-full h-full object-cover grayscale opacity-80 scale-110 hover:scale-100 transition-transform duration-[3s]"
        />
      </section>
    </div>
  );
};

export default About;
