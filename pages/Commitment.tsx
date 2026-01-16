
import { GoogleGenAI } from "@google/genai";
import React, { useState } from 'react';

const Commitment: React.FC = () => {
  const [customIdea, setCustomIdea] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEcoIdea = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Suggest one unique and creative way to reuse a small glass skincare jar. Be brief, creative, and artistic. Under 15 words.",
      });
      setCustomIdea(response.text);
    } catch (e) {
      console.error(e);
      setCustomIdea("A tiny vase for a single wildflower.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="pt-40 pb-32 bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-700">
      {/* Header */}
      <section className="px-6 md:px-12 mb-32 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 mb-4 text-[var(--primary-peony)] font-bold">Our Commitment</p>
        <h2 className="text-6xl md:text-8xl serif mb-12">Nature's Pharmacy</h2>
        <div className="max-w-2xl mx-auto h-px bg-[var(--text-main)]/10"></div>
      </section>

      {/* Why Natural */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-40">
        <div className="space-y-8 reveal">
          <h3 className="text-4xl serif italic">"Our ingredients work WITH your skin, not against it."</h3>
          <p className="text-lg font-light leading-relaxed text-[var(--text-muted)]">
            Every ingredient in our products serves a purpose. Unlike conventional products with fillers and synthetic preservatives, our formulations contain only active botanicals that nourish, repair, and protect.
          </p>
          <div className="space-y-6">
            <div className="flex items-start space-x-6">
               <div className="w-12 h-12 rounded-full bg-[var(--primary-peony)]/20 flex items-center justify-center text-xl">🌱</div>
               <div>
                  <h4 className="font-semibold text-sm uppercase tracking-widest mb-1">Peak Potency</h4>
                  <p className="text-xs text-[var(--text-muted)]">Sourced from nature at the height of their nutrient density.</p>
               </div>
            </div>
            <div className="flex items-start space-x-6">
               <div className="w-12 h-12 rounded-full bg-[var(--primary-peony)]/20 flex items-center justify-center text-xl">💧</div>
               <div>
                  <h4 className="font-semibold text-sm uppercase tracking-widest mb-1">Zero Fillers</h4>
                  <p className="text-xs text-[var(--text-muted)]">We don't use water as a cheap base. Every drop is active.</p>
               </div>
            </div>
          </div>
        </div>
        <div className="aspect-square bg-[var(--bg-card)] overflow-hidden rounded-3xl reveal border border-[var(--border-subtle)] shadow-xl">
           <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1000" alt="Sustainable Living" className="w-full h-full object-cover opacity-80" />
        </div>
      </section>

      {/* Sustainable Packaging Infographic Section */}
      <section className="bg-[var(--bg-card)] py-32 px-6 md:px-12 mb-32 reveal border-y border-[var(--border-subtle)]">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl md:text-6xl serif text-center mb-24">10 Ways to Reuse Your Nichema Containers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
               {[
                 'Spice Storage', 'DIY Beauty', 'Mini Planters', 'Desk Organizers', 'Travel Bottles',
                 'Bobby Pin Jar', 'Candle Holders', 'Gift Jars', 'Herb Garden', 'Art Supplies'
               ].map((item, idx) => (
                 <div key={idx} className="group flex flex-col items-center p-6 border border-[var(--primary-peony)]/20 rounded-xl hover:bg-[var(--primary-peony)] hover:text-white transition-all duration-500">
                   <div className="text-2xl mb-4 group-hover:scale-125 transition-transform">✨</div>
                   <p className="text-[10px] uppercase tracking-widest font-bold text-center">{item}</p>
                 </div>
               ))}
            </div>

            {/* Fast AI Eco-Idea Generator */}
            <div className="mt-20 p-8 border border-[var(--primary-peony)] rounded-3xl text-center max-w-xl mx-auto bg-[var(--bg-main)] shadow-inner">
               <h4 className="text-[11px] uppercase tracking-[0.3em] font-bold mb-4 opacity-50 text-[var(--primary-peony)]">Instant Reuse Idea</h4>
               {customIdea ? (
                 <p className="serif italic text-2xl text-[var(--text-main)] animate-in fade-in zoom-in-95">{customIdea}</p>
               ) : (
                 <p className="serif italic text-xl opacity-30 text-[var(--text-main)]">Need something different?</p>
               )}
               <button 
                onClick={generateEcoIdea}
                disabled={isGenerating}
                className="mt-6 text-[10px] uppercase tracking-widest font-bold text-[var(--primary-peony)] hover:text-[var(--text-main)] transition-colors"
               >
                 {isGenerating ? 'Sparking...' : 'Generate New Idea ✨'}
               </button>
            </div>

            <div className="mt-24 text-center">
               <p className="text-xl serif italic mb-8 text-[var(--text-muted)]">"Sustainability is not a choice, it is our responsibility to the earth."</p>
               <button className="text-[11px] uppercase tracking-[0.3em] font-bold border-b-2 border-[var(--primary-peony)] pb-2 hover:opacity-60 transition-all text-[var(--text-main)]">Join Our Conscious Community</button>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Commitment;
