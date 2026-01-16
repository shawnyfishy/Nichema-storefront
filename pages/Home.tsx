import React, { useMemo, useState, useEffect } from 'react';
import { fetchProducts } from '../api';
import { Product } from '../types';
import { MeshGradient } from "@paper-design/shaders-react";

interface HomeProps {
  onNavigate: (path: string) => void;
  theme: 'light' | 'dark';
}

const Home: React.FC<HomeProps> = ({ onNavigate, theme }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  const gradientColors = useMemo(() => theme === 'light'
    ? ["#F4C9D6", "#FADDE5", "#FFFFFF", "#FFD1DC"]
    : ["#3E2723", "#1A1210", "#F4C9D6", "#5D4037"], [theme]);

  const promises = [
    {
      icon: (
        <svg className="w-8 h-8 mx-auto mb-6 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M2 22C2 22 2 13 12 13C12 13 12 2 22 2C22 2 22 11 12 11C12 11 12 22 2 22Z" />
        </svg>
      ),
      title: "Pure Botanicals",
      desc: "Cold-pressed oils and wild-harvested herbs, completely free from synthetics."
    },
    {
      icon: (
        <svg className="w-8 h-8 mx-auto mb-6 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" />
          <path d="M5 3L5.5 5.5L8 6L5.5 6.5L5 9L4.5 6.5L2 6L4.5 5.5L5 3Z" />
        </svg>
      ),
      title: "Artisanal Batching",
      desc: "Crafted with intention in small batches to ensure absolute freshness."
    },
    {
      icon: (
        <svg className="w-8 h-8 mx-auto mb-6 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M5 8H15M2 12H19M7 16H13" />
          <path d="M17 16L19 18L22 15" />
        </svg>
      ),
      title: "Ayurvedic Wisdom",
      desc: "Ancient methods refined for the modern conscious lifestyle."
    },
    {
      icon: (
        <svg className="w-8 h-8 mx-auto mb-6 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 22C12 22 19 18 19 12C19 6 12 2 12 2C12 2 5 6 5 12C5 18 12 22 12 22Z" />
          <path d="M12 17C12 17 15 14.5 15 12C15 9.5 12 8 12 8" />
        </svg>
      ),
      title: "Slow Infusions",
      desc: "Patience is our key ingredient. We allow nature to release its power in its own time."
    },
    {
      icon: (
        <svg className="w-8 h-8 mx-auto mb-6 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      title: "Radical Honesty",
      desc: "Transparent labeling and visible botanical evidence in every jar."
    },
    {
      icon: (
        <svg className="w-8 h-8 mx-auto mb-6 text-[var(--primary-peony)] opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 000-7.78v0z" />
        </svg>
      ),
      title: "With Intention",
      desc: "Every ritual is designed to elevate both your body and your spirit."
    }
  ];

  return (
    <div className="bg-[var(--bg-main)]">
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center relative px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 transition-all duration-[var(--duration-slow)] ease-[var(--ease-out-expo)]">
          <div className="absolute inset-0 scale-125">
            <MeshGradient
              className="w-full h-full opacity-100"
              colors={gradientColors}
              speed={0.4}
            />
          </div>
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20 pointer-events-none" />
        </div>

        <div className="relative z-10 space-y-8 text-white max-w-4xl">
          <h1 className="text-7xl md:text-[130px] tracking-[0.15em] leading-none serif reveal font-medium drop-shadow-2xl transition-all" style={{ transitionDelay: '0.2s' }}>
            NICHEMA
          </h1>
          <p className="mx-auto text-xl md:text-2xl font-medium tracking-[0.2em] reveal italic serif px-4 opacity-100 drop-shadow-xl" style={{ transitionDelay: '0.4s' }}>
            A ritual of pure, radiant care.
          </p>
          <div className="pt-16 reveal" style={{ transitionDelay: '0.6s' }}>
            <button
              onClick={() => onNavigate('/shop')}
              className="group relative overflow-hidden px-14 py-5 bg-[var(--primary-peony)] text-white rounded-full text-[13px] uppercase tracking-[0.3em] transition-all duration-[var(--duration-mid)] ease-[var(--ease-out-expo)] hover:bg-white hover:text-black font-bold shadow-2xl active:scale-95"
            >
              <span className="relative z-10">Enter the Sanctuary</span>
            </button>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Liquid Glass Pane */}
      <section className="py-40 px-6 md:px-12 relative reveal overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary-peony)]/20 rounded-full blur-[120px] -mr-64 -mt-64 transition-opacity duration-[var(--duration-slow)]"></div>
        <div className="max-w-5xl mx-auto glass-card p-12 md:p-24 rounded-[4rem] relative z-10 text-center border border-white/20">
          <p className="text-[12px] uppercase tracking-[0.4em] text-[var(--primary-peony)] mb-8 font-extrabold">OUR PHILOSOPHY</p>
          <h2 className="text-5xl md:text-6xl serif mb-12 text-[var(--text-main)]">Luminous. Intentional. Yours.</h2>
          <p className="text-2xl md:text-3xl font-normal leading-relaxed mb-24 italic max-w-2xl mx-auto serif text-[var(--text-muted)]">
            "We weave the wisdom of ancient botanicals with the purity of contemporary care. Every drop is a prayer for your radiance."
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8 border-t border-[var(--border-subtle)] pt-24">
            {[
              { icon: '🌿', label: 'Handmade' },
              { icon: '🐇', label: 'Cruelty-Free' },
              { icon: '✨', label: 'Pure Root' },
              { icon: '♻️', label: 'Sustainable' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-6 group cursor-default">
                <div className="w-16 h-16 rounded-full bg-[var(--primary-peony)]/20 flex items-center justify-center text-3xl transition-all duration-[var(--duration-mid)] ease-[var(--ease-out-expo)] group-hover:bg-[var(--primary-peony)]/40 group-hover:scale-110">{item.icon}</div>
                <p className="text-[12px] uppercase tracking-[0.25em] font-bold text-[var(--text-main)] opacity-80 transition-all duration-[var(--duration-mid)] group-hover:opacity-100">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promises Section */}
      <section className="py-40 px-6 md:px-12 bg-transparent reveal">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl serif text-[var(--text-main)] mb-6">The Nichema Promise</h2>
          <div className="w-12 h-px bg-[var(--text-main)]/20 mx-auto mb-32 transition-all duration-[var(--duration-slow)] hover:w-32"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
            {promises.map((item, idx) => (
              <div key={idx} className="glass-card p-10 rounded-[2.5rem] space-y-4 max-w-sm mx-auto group hover:bg-white/40 transition-all cursor-default">
                <div className="text-[var(--text-main)] transition-all duration-[var(--duration-mid)] ease-[var(--ease-out-expo)] group-hover:text-[var(--primary-peony)] group-hover:scale-110">
                  {item.icon}
                </div>
                <h4 className="text-[14px] md:text-[15px] uppercase tracking-[0.25em] font-medium text-[var(--text-main)] mb-6 transition-colors duration-[var(--duration-mid)] group-hover:text-[var(--primary-peony)]">
                  {item.title}
                </h4>
                <p className="text-[14px] md:text-[15px] leading-relaxed text-[var(--text-muted)] font-normal px-4">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-40 px-6 md:px-12 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 reveal">
            <div>
              <p className="text-[12px] uppercase tracking-[0.4em] text-[var(--primary-peony)] mb-3 font-extrabold">THE COLLECTION</p>
              <h2 className="text-6xl md:text-7xl serif text-[var(--text-main)]">Sacred Rituals</h2>
            </div>
            <button onClick={() => onNavigate('/shop')} className="text-[13px] uppercase tracking-[0.25em] font-bold border-b-2 border-[var(--primary-peony)] pb-1 transition-all duration-[var(--duration-fast)] hover:opacity-60 hover:translate-x-1 text-[var(--text-main)]">Discover All Botanicals</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {products.slice(0, 3).map((product, idx) => (
              <div key={product.id} className="reveal group cursor-pointer" style={{ transitionDelay: `${idx * 0.2}s` }} onClick={() => onNavigate('/shop')}>
                <div className="relative overflow-hidden aspect-[4/5] mb-10 bg-[var(--bg-card)] rounded-[3rem] shadow-md transition-all duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] hover:shadow-2xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale-[0.2] opacity-90 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] group-hover:scale-110"
                  />
                  <div className="absolute bottom-6 left-6 glass-card px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-main)] shadow-lg transition-transform duration-[var(--duration-mid)] group-hover:-translate-y-2 rounded-full backdrop-blur-md">
                    {product.badge.split(' • ')[0]}
                  </div>
                </div>
                <div className="space-y-3 text-center">
                  <h3 className="text-3xl serif italic text-[var(--text-main)] group-hover:text-[var(--primary-peony)] transition-colors duration-[var(--duration-mid)]">{product.name}</h3>
                  <p className="text-[16px] font-bold tracking-[0.15em] text-[var(--primary-peony)]">₹{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
