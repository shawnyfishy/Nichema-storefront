
import React from 'react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleSupportClick = (section: string) => {
    // We update the hash so the FAQ page knows which category to open
    window.location.hash = section;
    onNavigate('/faq');
  };

  return (
    <footer className="bg-[#3E2723] text-[#F8F6F0] pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-4xl md:text-5xl serif mb-8 text-[#F4C9D6]">Join the Nichema Family</h2>
          <p className="text-sm uppercase tracking-widest mb-8 opacity-90 italic font-medium">Conscious Beauty, Mindful Living</p>
          <form className="flex max-w-md border-b border-[#F8F6F0]/40 pb-2 group focus-within:border-[#F4C9D6] transition-colors" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-transparent border-none outline-none w-full text-lg placeholder:text-[#F8F6F0]/40 text-[#F8F6F0]"
            />
            <button className="px-4 text-[#F4C9D6] hover:text-white transition-colors uppercase text-[10px] tracking-[0.2em] font-bold">Subscribe</button>
          </form>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.3em] mb-8 font-extrabold text-[#F4C9D6]">Explore</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li>
              <button onClick={() => onNavigate('/shop')} className="hover:text-[#F4C9D6] transition-colors text-left opacity-90 hover:opacity-100">Shop All</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/commitment')} className="hover:text-[#F4C9D6] transition-colors text-left opacity-90 hover:opacity-100">Commitment</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/about')} className="hover:text-[#F4C9D6] transition-colors text-left opacity-90 hover:opacity-100">Our Story</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/rituals')} className="hover:text-[#F4C9D6] transition-colors text-left opacity-90 hover:opacity-100">Rituals</button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] uppercase tracking-[0.3em] mb-8 font-extrabold text-[#F4C9D6]">Support</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li>
              <button onClick={() => handleSupportClick('shipping')} className="hover:text-[#F4C9D6] transition-colors text-left text-nowrap opacity-90 hover:opacity-100">Shipping & Returns</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/faq')} className="hover:text-[#F4C9D6] transition-colors text-left opacity-90 hover:opacity-100">FAQ</button>
            </li>
            <li>
              <button onClick={() => onNavigate('/faq')} className="hover:text-[#F4C9D6] transition-colors text-left opacity-90 hover:opacity-100">Privacy Policy</button>
            </li>
             <li>
              <a href="mailto:hello@nichema.com" className="hover:text-[#F4C9D6] transition-colors text-left opacity-90 hover:opacity-100">hello@nichema.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-[#F8F6F0]/10 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.3em] uppercase space-y-4 md:space-y-0 text-center font-bold opacity-60">
        <p>&copy; {new Date().getFullYear()} NICHEMA. All rights reserved.</p>
        <p className="hidden md:block">100% REUSABLE PACKAGING • NATURAL INGREDIENTS</p>
        <p>Handmade with love, care, and prayer</p>
      </div>
    </footer>
  );
};

export default Footer;
