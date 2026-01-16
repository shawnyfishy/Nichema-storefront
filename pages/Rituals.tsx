
import { GoogleGenAI } from "@google/genai";
import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../api';
import { Product } from '../types';

const Rituals: React.FC = () => {
  const [concern, setConcern] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customRitual, setCustomRitual] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  const generateRitual = async () => {
    if (!concern.trim()) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `A customer has this concern: "${concern}". 
        Available products: ${products.map(p => p.name).join(', ')}.
        Create a personalized morning and evening ritual using these products. 
        Focus on mindfulness and the "intentional" nature of Nichema. 
        Format: Markdown with clean headers. Use an elegant, nurturing tone.`,
      });
      setCustomRitual(response.text);
    } catch (error) {
      console.error(error);
      setCustomRitual("I was unable to weave your ritual together. Perhaps try a simpler description of your needs?");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="pt-24 md:pt-40 pb-32 bg-[var(--bg-main)] transition-colors duration-700">
      <div className="max-w-4xl mx-auto px-6">
        <header className="text-center mb-24 reveal">
          <p className="text-[12px] uppercase tracking-[0.4em] text-[var(--primary-peony)] mb-6 font-bold">SACRED CARE</p>
          <h1 className="text-5xl md:text-7xl serif mb-10 text-[var(--text-main)]">Ritual Guidance</h1>
          <p className="serif italic text-2xl text-[var(--text-muted)]">Crafting a conversation between your skin and nature.</p>
        </header>

        {/* AI Generator - Glass Frame */}
        <section className="glass-card p-6 md:p-20 rounded-[4rem] border border-white/20 mb-24 reveal">
          <div className="max-w-2xl mx-auto text-center space-y-12 text-[var(--text-main)]">
            <h2 className="text-3xl md:text-4xl serif italic">Craft Your Custom Ritual</h2>
            <p className="text-[13px] tracking-[0.2em] opacity-60 uppercase font-bold">Describe your skin or hair journey, and let our sanctuary guide suggest a path.</p>

            <div className="relative">
              <textarea
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
                placeholder="e.g., My skin feels tired and dry after long days, and my hair needs more strength..."
                className="w-full h-40 bg-white/30 rounded-3xl p-8 text-lg serif italic focus:outline-none focus:ring-1 focus:ring-[var(--primary-peony)] resize-none text-[var(--text-main)] placeholder:text-[var(--text-main)]/40 border border-white/20"
              />
              <button
                onClick={generateRitual}
                disabled={isGenerating || !concern.trim()}
                className="mt-8 w-full md:w-auto bg-[var(--primary-peony)] text-white px-12 py-5 rounded-full text-[13px] uppercase tracking-[0.3em] font-bold hover:bg-[var(--primary-espresso)] transition-all disabled:opacity-30 shadow-xl"
              >
                {isGenerating ? 'Weaving your ritual...' : 'Receive Guidance'}
              </button>
            </div>

            {customRitual && (
              <div className="mt-20 text-left p-10 bg-white/20 rounded-[2rem] border border-white/30 animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="prose prose-stone max-w-none serif text-lg leading-relaxed text-[var(--text-main)]/80">
                  {customRitual.split('\n').map((line, i) => (
                    <p key={i} className="mb-4">{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Standard Rituals - Frosted Glass Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[var(--text-main)]">
          <div className="p-6 md:p-12 glass-card rounded-[3rem] space-y-8 hover:bg-white/40 transition-all cursor-default">
            <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-[var(--primary-peony)]">Morning Awakening</h3>
            <p className="text-3xl serif italic">The Refresh Ritual</p>
            <ol className="space-y-6 text-[15px] text-[var(--text-muted)]">
              <li className="flex space-x-4"><span>01</span> <span>Mist your face with Botanical Toner to wake the senses.</span></li>
              <li className="flex space-x-4"><span>02</span> <span>While damp, massage a pea-sized amount of Shatapata Butter.</span></li>
              <li className="flex space-x-4"><span>03</span> <span>Seal with light upward strokes, breathing in the saffron.</span></li>
            </ol>
          </div>
          <div className="p-6 md:p-12 glass-card rounded-[3rem] space-y-8 hover:bg-white/40 transition-all cursor-default">
            <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-[var(--primary-peony)]">Evening Rest</h3>
            <p className="text-3xl serif italic">The Recovery Ritual</p>
            <ol className="space-y-6 text-[15px] text-[var(--text-muted)]">
              <li className="flex space-x-4"><span>01</span> <span>Deep cleanse and exfoliate twice a week with Body Scrub.</span></li>
              <li className="flex space-x-4"><span>02</span> <span>Apply Hair Elixir to scalp, massaging with intention.</span></li>
              <li className="flex space-x-4"><span>03</span> <span>A heavy layer of Shatapata Butter on feet and hands for overnight repair.</span></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rituals;
