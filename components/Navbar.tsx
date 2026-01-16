
import React from 'react';
import { CartItem } from '../types';

interface NavbarProps {
  onNavigate: (path: string) => void;
  cartCount: number;
  cartItems: CartItem[];
  updateQuantity: (cartId: string, delta: number) => void;
  removeFromCart: (cartId: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

import { useAuth } from '../context/AuthContext';

const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  cartCount,
  cartItems,
  updateQuantity,
  removeFromCart,
  theme,
  toggleTheme
}) => {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();

  // Prevent scrolling when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleCheckout = () => {
    const checkoutUrl = localStorage.getItem('nichema_checkout_url');
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      alert("Please add items to your cart to generate a checkout link, or check your internet connection.");
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    onNavigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] px-6 md:px-12 py-6 flex justify-between items-center transition-all">
      <div className="flex items-center space-x-4 md:space-x-8">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden text-2xl text-[var(--text-main)] p-2 hover:opacity-70 transition-opacity"
        >
          ☰
        </button>

        <button onClick={() => onNavigate('/')} className="text-2xl md:text-3xl serif tracking-[0.2em] font-medium text-[var(--text-main)] uppercase hover:text-[var(--primary-peony)] transition-colors">NICHEMA</button>
        <div className="hidden md:flex space-x-6 text-[10px] uppercase tracking-[0.3em] font-bold opacity-60">
          <button onClick={() => onNavigate('/shop')} className="hover:opacity-100 transition-opacity">Shop</button>
          <button onClick={() => onNavigate('/commitment')} className="hover:opacity-100 transition-opacity">Commitment</button>
          <button onClick={() => onNavigate('/rituals')} className="hover:opacity-100 transition-opacity">Rituals</button>
          <button onClick={() => onNavigate('/about')} className="hover:opacity-100 transition-opacity">Story</button>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button onClick={toggleTheme} className="p-2 opacity-60 hover:opacity-100 transition-transform active:scale-90">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button onClick={() => user ? setIsUserMenuOpen(!isUserMenuOpen) : onNavigate('/login')} className="p-2 opacity-60 hover:opacity-100 transition-transform active:scale-90">
            <span className="text-xl">{user ? '👤' : 'Login'}</span>
          </button>

          {user && (
            <div className={`absolute right-0 mt-4 w-48 glass-card rounded-2xl p-4 transition-all shadow-xl border-white/20 origin-top-right duration-200 ${isUserMenuOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}`}>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-2 px-2">Hi, {user.firstName}</p>
              <button onClick={handleLogout} className="w-full text-left text-[11px] uppercase tracking-widest font-bold hover:text-[var(--primary-peony)] py-2 px-2 rounded-lg hover:bg-white/10 transition-colors">
                Sign Out
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="text-[10px] uppercase tracking-[0.3em] font-bold flex items-center space-x-2"
          >
            <span>Bag</span>
            <span className="bg-[var(--primary-peony)] text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] animate-in zoom-in duration-300">{cartCount}</span>
          </button>

          <div className={`absolute right-0 mt-4 w-80 glass-card rounded-[2.5rem] p-6 transition-all shadow-2xl border-white/20 origin-top-right duration-300 ease-[var(--ease-out-expo)] ${isCartOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}`}>
            <div className="flex justify-between items-center mb-6">
              <h4 className="serif italic text-xl text-[var(--text-main)]">Your Ritual Bag</h4>
              <button onClick={() => setIsCartOpen(false)} className="text-[var(--text-main)] hover:text-[var(--primary-peony)]">&times;</button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-6 mb-8 pr-2">
              {cartItems.map(item => (
                <div key={item.cartId} className="flex justify-between items-center text-xs animate-in fade-in slide-in-from-right-2">
                  <div className="flex-grow">
                    <p className="font-bold text-[var(--text-main)]">{item.name}</p>
                    <p className="opacity-50 text-[var(--text-main)]">{item.selectedSize?.label || item.volume || item.weight}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <button onClick={() => updateQuantity(item.cartId, -1)} className="w-6 h-6 border border-[var(--border-subtle)] rounded-full flex items-center justify-center hover:bg-[var(--primary-peony)]/10">-</button>
                      <span className="font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, 1)} className="w-6 h-6 border border-[var(--border-subtle)] rounded-full flex items-center justify-center hover:bg-[var(--primary-peony)]/10">+</button>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold mb-1">₹{(item.selectedSize?.price || (typeof item.price === 'number' ? item.price : 0)) * item.quantity}</p>
                    <button onClick={() => removeFromCart(item.cartId)} className="text-[var(--primary-peony)] font-bold uppercase text-[9px] tracking-widest hover:opacity-50">Remove</button>
                  </div>
                </div>
              ))}
              {cartItems.length === 0 && (
                <div className="text-center py-12 space-y-4">
                  <p className="opacity-40 italic serif text-lg text-[var(--text-main)]">Your bag is empty</p>
                  <button onClick={() => { setIsCartOpen(false); onNavigate('/shop'); }} className="text-[9px] uppercase tracking-widest font-bold text-[var(--primary-peony)]">Start Exploring</button>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] uppercase tracking-widest opacity-60 font-bold">Total</span>
                  <span className="text-xl serif italic font-bold">₹{cartItems.reduce((acc, item) => acc + (item.selectedSize?.price || (typeof item.price === 'number' ? item.price : 0)) * item.quantity, 0)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[var(--primary-peony)] text-white py-5 rounded-full text-[10px] uppercase tracking-[0.4em] font-extrabold shadow-xl hover:bg-[var(--primary-espresso)] hover:-translate-y-1 transition-all active:scale-95"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer - Fixed Z-Index & Layout */}
      <div className={`fixed inset-0 z-[100] bg-[var(--bg-main)] transition-all duration-[var(--duration-slow)] ease-[var(--ease-out-expo)] ${isMobileMenuOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-full opacity-50 pointer-events-none'} md:hidden h-[100dvh] w-screen`}>
        <div className="p-8 flex flex-col h-full relative">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 text-3xl text-[var(--text-main)] hover:text-[var(--primary-peony)] transition-colors"
          >
            &times;
          </button>

          <div className="mt-20 flex flex-col space-y-8 text-center">
            <h2 className="text-4xl serif italic text-[var(--text-main)] mb-8">Nichema Sanctuary</h2>
            {['Shop', 'Commitment', 'Rituals', 'Story'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  onNavigate(item === 'Story' ? '/about' : `/${item.toLowerCase()}`);
                  setIsMobileMenuOpen(false);
                }}
                className="text-xl uppercase tracking-[0.3em] font-bold text-[var(--text-main)] hover:text-[var(--primary-peony)] transition-colors py-4 border-b border-[var(--border-subtle)]"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-auto items-center justify-center flex space-x-8 pb-12 opacity-50">
            <span>Instagram</span>
            <span>•</span>
            <span>Contact</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
