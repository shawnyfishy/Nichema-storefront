
import { GoogleGenAI } from "@google/genai";
import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchProduct } from '../api';
import { Product } from '../types';

interface ShopProps {
  addToCart: (product: Product, size?: { label: string; price: number }) => void;
  initialProductId?: string;
}

const Shop: React.FC<ShopProps> = ({ addToCart, initialProductId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | 'skincare' | 'haircare' | 'coming-soon'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<{ label: string; price: number } | null>(null);
  const [addedNotify, setAddedNotify] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fastTip, setFastTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(filter === 'all' ? undefined : filter);
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [filter]);

  useEffect(() => {
    if (initialProductId) {
      fetchProduct(initialProductId).then(product => {
        handleOpenProduct(product);
      }).catch(console.error);
    }
  }, [initialProductId]);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes ? product.sizes[0] : null);
    setAiAnalysis(null);
    setFastTip(null);
  };

  const getFastTip = async () => {
    if (!selectedProduct || fastTip) return;
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Give one super quick, 10-word usage tip for ${selectedProduct.name}. Make it sound like a beauty secret.`,
      });
      setFastTip(response.text);
    } catch (e) { console.error(e); }
  };

  const analyzeIngredients = async () => {
    if (!selectedProduct) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the synergy of these ingredients for ${selectedProduct.name}: ${selectedProduct.ingredients.join(', ')}. Focus on the soul of the ingredients. Poetic, botanical, under 60 words.`,
      });
      setAiAnalysis(response.text);
    } catch (error) {
      setAiAnalysis("The botanicals are whispering... but I couldn't hear them clearly.");
    } finally { setIsAnalyzing(false); }
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, selectedSize || undefined);
      setAddedNotify(true);
      setTimeout(() => setAddedNotify(false), 2000);
    }
  };

  return (
    <div className="pt-24 md:pt-40 pb-32 px-6 md:px-12 bg-[var(--bg-main)] min-h-screen transition-colors duration-[var(--duration-slow)]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <p className="text-[12px] uppercase tracking-[0.4em] text-[var(--primary-peony)] mb-4 font-extrabold">NICHEMA CURATION</p>
          <h2 className="text-6xl md:text-7xl serif mb-12 text-[var(--text-main)]">The Collection</h2>
          <div className="inline-flex flex-wrap justify-center gap-4 glass-card p-4 rounded-[2rem] text-[12px] uppercase tracking-[0.2em] mb-12 border border-[var(--primary-peony)]/20 shadow-sm">
            {['all', 'skincare', 'haircare', 'coming-soon'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`px-8 py-3 rounded-full transition-all duration-[var(--duration-mid)] ease-[var(--ease-out-expo)] font-bold ${filter === cat ? 'bg-[var(--primary-peony)] text-white shadow-lg' : 'text-[var(--text-main)] opacity-50 hover:opacity-100 hover:bg-white/20'}`}
              >
                {cat.replace('-', ' ')}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {products.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer transition-all duration-[var(--duration-mid)] ease-[var(--ease-out-expo)] hover:-translate-y-3"
              onClick={() => handleOpenProduct(product)}
            >
              <div className="relative aspect-[3/4] bg-[var(--bg-card)] overflow-hidden mb-8 rounded-[3rem] border border-[var(--border-subtle)] shadow-md transition-all duration-[var(--duration-mid)] ease-[var(--ease-out-expo)] hover:shadow-2xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-[var(--duration-mid)]" />
                <div className="absolute top-6 right-6 z-10 transition-transform duration-[var(--duration-mid)] group-hover:-translate-y-1">
                  <span className="glass-card text-[var(--text-main)] text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-lg font-extrabold backdrop-blur-md">
                    {product.badge.split(' • ')[0]}
                  </span>
                </div>
              </div>
              <div className="space-y-3 text-center">
                <h3 className="text-2xl md:text-3xl serif text-[var(--text-main)] group-hover:text-[var(--primary-peony)] transition-colors duration-[var(--duration-mid)]">{product.name}</h3>
                <p className="text-[16px] font-semibold tracking-widest text-[var(--text-muted)] transition-opacity duration-[var(--duration-mid)] group-hover:opacity-100">
                  {product.sizes ? `From ₹${Math.min(...product.sizes.map(s => s.price))}` : product.price === 'TBD' ? 'Coming Soon' : `₹${product.price}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 bg-black/20 backdrop-blur-xl transition-opacity duration-[var(--duration-mid)] ease-[var(--ease-out-expo)]">
          <div className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto glass-card shadow-2xl flex flex-col md:flex-row rounded-[4rem] border border-white/30 animate-in fade-in zoom-in-95 duration-[var(--duration-mid)] ease-[var(--ease-out-expo)]">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-8 right-8 z-20 text-4xl font-light hover:text-[var(--primary-peony)] transition-all duration-[var(--duration-fast)] drop-shadow-md text-[var(--text-main)]"
            >
              &times;
            </button>

            <div className="md:w-1/2 h-[300px] md:h-auto sticky top-0 md:relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover grayscale-[0.2] transition-all duration-[var(--duration-slow)] hover:grayscale-0"
              />
            </div>

            <div className="md:w-1/2 p-6 md:p-16 space-y-12">
              <div className="space-y-4">
                <p className="text-[12px] uppercase tracking-[0.4em] text-[var(--primary-peony)] font-extrabold">{selectedProduct.category}</p>
                <h2 className="text-4xl md:text-6xl serif text-[var(--text-main)]">{selectedProduct.name}</h2>
                <div className="flex items-center space-x-8 pt-2">
                  <p className="text-3xl font-bold tracking-widest text-[var(--text-main)]">
                    {selectedSize ? `₹${selectedSize.price}` : selectedProduct.price === 'TBD' ? 'TBD' : `₹${selectedProduct.price}`}
                  </p>
                  {selectedProduct.category !== 'coming-soon' && (
                    <button onMouseEnter={getFastTip} className="text-[11px] uppercase tracking-[0.2em] text-[var(--primary-peony)] border-b-2 border-[var(--primary-peony)] font-extrabold pb-1 hover:opacity-70 transition-all duration-[var(--duration-fast)]">Botanical Tip</button>
                  )}
                </div>
                {fastTip && <p className="mt-6 text-[15px] italic serif text-[var(--primary-peony)] font-medium animate-in slide-in-from-left-4 duration-[var(--duration-mid)]">{fastTip}</p>}
              </div>

              {selectedProduct.sizes && (
                <div className="space-y-4">
                  <p className="text-[11px] uppercase tracking-[0.3em] font-extrabold opacity-60">Choose Size</p>
                  <div className="flex flex-wrap gap-4">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size.label}
                        onClick={() => setSelectedSize(size)}
                        className={`px-8 py-3 rounded-full text-[12px] uppercase tracking-[0.2em] font-bold transition-all duration-[var(--duration-mid)] border ${selectedSize?.label === size.label
                          ? 'bg-[var(--primary-peony)] text-white border-[var(--primary-peony)] shadow-lg'
                          : 'bg-white/20 border-white/40 text-[var(--text-main)] hover:bg-white/40'
                          }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-10 border-t border-[var(--border-subtle)] pt-12">
                <div className="space-y-4">
                  <h4 className="text-[11px] uppercase tracking-[0.3em] font-extrabold text-[var(--primary-peony)]">The Essence</h4>
                  <p className="serif italic text-[19px] leading-relaxed text-[var(--text-main)]/90">{selectedProduct.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <h4 className="text-[11px] uppercase tracking-[0.3em] font-extrabold text-[var(--primary-peony)]">Ingredients</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.ingredients.map((ing, i) => (
                        <span key={i} className="text-[12px] uppercase tracking-widest text-[var(--text-muted)] bg-white/10 px-3 py-1 rounded-md border border-white/10">{ing}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[11px] uppercase tracking-[0.3em] font-extrabold text-[var(--primary-peony)]">Ritual Usage</h4>
                    <p className="text-[14px] leading-relaxed text-[var(--text-muted)] italic serif">{selectedProduct.usage}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-[var(--border-subtle)] pt-10">
                  <div className="space-y-4">
                    <h4 className="text-[11px] uppercase tracking-[0.3em] font-extrabold text-[var(--primary-peony)]">Storage & Care</h4>
                    <p className="text-[14px] leading-relaxed text-[var(--text-muted)] italic serif">{selectedProduct.storage}</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[11px] uppercase tracking-[0.3em] font-extrabold text-[var(--primary-peony)]">Sustainability</h4>
                    <p className="text-[14px] leading-relaxed text-[var(--text-muted)] italic serif">{selectedProduct.packaging}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/20 p-10 rounded-[3rem] border border-white/30 shadow-sm transition-all duration-[var(--duration-mid)] hover:bg-white/30">
                {aiAnalysis ? (
                  <div className="animate-in fade-in duration-[var(--duration-slow)] ease-[var(--ease-out-expo)]">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-[var(--primary-peony)] mb-4">Botanical Synergy</p>
                    <p className="serif italic text-[18px] leading-relaxed text-[var(--text-main)]">{aiAnalysis}</p>
                  </div>
                ) : (
                  <button onClick={analyzeIngredients} disabled={isAnalyzing} className="flex items-center space-x-3 text-[11px] uppercase tracking-[0.2em] font-extrabold text-[var(--primary-peony)] hover:text-[var(--text-main)] transition-colors duration-[var(--duration-mid)]">
                    <span className={isAnalyzing ? 'animate-spin' : ''}>✨</span>
                    <span>{isAnalyzing ? 'Extracting Essence...' : 'Deep Botanical Analysis'}</span>
                  </button>
                )}
              </div>

              <div className="space-y-6 pt-10 sticky bottom-0 bg-transparent">
                <button
                  disabled={selectedProduct.category === 'coming-soon'}
                  onClick={handleAddToCart}
                  className={`w-full py-6 rounded-full text-[13px] uppercase tracking-[0.35em] font-extrabold shadow-xl transition-all duration-[var(--duration-mid)] ease-[var(--ease-out-expo)] ${selectedProduct.category === 'coming-soon'
                    ? 'bg-[var(--text-muted)]/20 text-[var(--text-muted)] cursor-not-allowed opacity-50'
                    : 'bg-[var(--primary-peony)] text-white hover:bg-[var(--primary-espresso)] hover:-translate-y-1 active:scale-95'
                    }`}
                >
                  {addedNotify ? 'Added to Ritual Bag ✓' : (selectedProduct.category === 'coming-soon' ? 'Join the Waitlist' : 'Begin Your Ritual')}
                </button>
                <p className="text-center text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold opacity-60">Mindfully hand-packaged in reusable glass</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
