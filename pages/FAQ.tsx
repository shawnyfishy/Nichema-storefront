
import React, { useState, useEffect } from 'react';

const FAQ_DATA = [
  {
    category: "Product & Ingredients",
    questions: [
      {
        q: "Why do your products need refrigeration?",
        a: "Our products are handmade in small batches with zero synthetic preservatives. Like fresh food for your skin, cold storage maintains the peak potency of active botanicals and prevents natural degradation over time."
      },
      {
        q: "How long do the products last?",
        a: "Because we prioritize freshness, most Nichema products have a recommended usage window of 3-6 months. Using them fresh ensures you experience the maximum restorative benefits of the active botanicals."
      },
      {
        q: "Are your products truly organic?",
        a: "Absolutely. We source high-quality, organic ingredients directly from nature. We believe in radical honesty and list every single botanical that goes into our formulations."
      }
    ]
  },
  {
    category: "Packaging & Sustainability",
    questions: [
      {
        q: "Why glass instead of plastic?",
        a: "Glass is infinitely recyclable, non-toxic, and non-porous. It ensures no harmful chemicals leach into our pure formulas and preserves the aromatic integrity of our natural oils."
      },
      {
        q: "How can I reuse my containers?",
        a: "Our jars are designed for a second life. They make beautiful spice containers, succulent planters, or travel organizers. We encourage you to find creative ways to extend their journey."
      },
      {
        q: "Do you offer a refill program?",
        a: "We are currently developing a localized refill initiative to minimize our footprint further. Join our newsletter to stay updated on our circular beauty progress."
      }
    ]
  },
  {
    category: "Shipping & Returns",
    questions: [
      {
        q: "How do you ensure eco-friendly shipping?",
        a: "We use 100% plastic-free packaging. Your products are nestled in biodegradable cornstarch peanuts or recycled paper wrap. Even our adhesive tape is paper-based and water-activated."
      },
      {
        q: "What is your return policy?",
        a: "Due to the artisanal and preservative-free nature of our products, we generally do not accept returns. However, if your product arrives damaged or if there is a concern with your order, please contact us within 48 hours of delivery."
      },
      {
        q: "Do you ship internationally?",
        a: "Currently, we ship across India. We are working on a mindful expansion to share Nichema rituals globally while maintaining our carbon-neutral shipping goals."
      },
      {
        q: "How long does delivery take?",
        a: "As we handcraft in small batches, please allow 3-5 business days for preparation, followed by 3-7 days for shipping depending on your sanctuary's location."
      }
    ]
  },
  {
    category: "Storage & Care",
    questions: [
      {
        q: "Can I travel with these products?",
        a: "Yes! While they thrive in the fridge, they can withstand room temperatures for short durations during travel. Simply return them to a cool spot once you reach your destination to restore their potency."
      },
      {
        q: "How do I know if my product is still fresh?",
        a: "Since we use raw natural ingredients, slight variations in color and texture are normal. A fresh product should smell earthy and botanical. If the aromatic profile changes significantly, it may be past its peak freshness."
      }
    ]
  }
];

const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  // Effect to handle navigation from support links
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#shipping') {
      setActiveCategory(2); // Shipping & Returns index
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="pt-40 pb-32 bg-[var(--bg-main)] min-h-screen transition-colors duration-700">
      <section className="max-w-4xl mx-auto px-6">
        <header className="text-center mb-28 reveal">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--primary-peony)] mb-6 font-bold">CLARITY & CARE</p>
          <h1 className="text-6xl md:text-7xl serif mb-10 text-[var(--text-main)]">Frequently Asked</h1>
          <div className="flex flex-wrap justify-center gap-4 mt-16">
            {FAQ_DATA.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => { setActiveCategory(idx); setOpenQuestion(null); }}
                className={`text-[11px] uppercase tracking-[0.3em] px-8 py-3 rounded-full border transition-all font-bold ${
                  activeCategory === idx 
                    ? 'bg-[var(--primary-peony)] text-white border-[var(--primary-peony)] shadow-lg' 
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-main)]/60 hover:border-[var(--primary-peony)] hover:bg-[var(--bg-card)]'
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </header>

        <div className="space-y-2 reveal bg-[var(--bg-card)]/40 p-2 rounded-[2.5rem] backdrop-blur-sm border border-[var(--border-subtle)]">
          {FAQ_DATA[activeCategory].questions.map((item, idx) => (
            <div 
              key={idx} 
              className={`group transition-all duration-500 rounded-[2rem] ${openQuestion === item.q ? 'bg-[var(--bg-card)] shadow-sm' : 'hover:bg-[var(--bg-card)]/60'}`}
            >
              <button
                onClick={() => setOpenQuestion(openQuestion === item.q ? null : item.q)}
                className="w-full py-10 px-8 flex justify-between items-center text-left"
              >
                <span className="text-2xl md:text-3xl serif italic pr-12 text-[var(--text-main)]">{item.q}</span>
                <span className={`text-3xl font-light transform transition-transform duration-700 text-[var(--primary-peony)] ${openQuestion === item.q ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-700 ease-in-out ${
                  openQuestion === item.q ? 'max-h-[400px] opacity-100 pb-12 px-10' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-lg md:text-xl font-light leading-relaxed text-[var(--text-muted)] max-w-2xl serif italic">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-40 text-center p-16 bg-[var(--bg-card)] rounded-[3rem] shadow-sm reveal border border-[var(--border-subtle)]">
           <h3 className="text-4xl serif mb-6 text-[var(--text-main)]">Still have questions?</h3>
           <p className="text-lg font-light text-[var(--text-muted)] mb-10 italic serif">We are here to help you on your ritual journey.</p>
           <a href="mailto:hello@nichema.com" className="inline-block text-[11px] uppercase tracking-[0.4em] font-bold border-b-2 border-[var(--primary-peony)] pb-2 hover:opacity-50 transition-opacity text-[var(--text-main)]">
             Contact Our Sanctuary
           </a>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
