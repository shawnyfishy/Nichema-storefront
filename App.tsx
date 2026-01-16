
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Commitment from './pages/Commitment';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Rituals from './pages/Rituals';
import Login from './pages/Login';
import Register from './pages/Register';
import { CartItem, Product } from './types';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [pathParam, setPathParam] = useState<string | undefined>(undefined);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize Theme and Cart
  useEffect(() => {
    const savedCart = localStorage.getItem('nichema_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }

    const savedTheme = localStorage.getItem('nichema_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('nichema_theme', newTheme);
  };

  useEffect(() => {
    localStorage.setItem('nichema_cart', JSON.stringify(cart));
  }, [cart]);

  const navigate = (path: string, param?: string) => {
    if (path === currentPath && !param) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setIsTransitioning(true);
    // Sync with --duration-mid (700ms)
    setTimeout(() => {
      setCurrentPath(path);
      setPathParam(param);
      window.scrollTo({ top: 0, behavior: 'instant' });
      setIsTransitioning(false);
    }, 700);
  };

  useEffect(() => {
    const handleReveal = () => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top <= (window.innerHeight * 0.9);
        if (isVisible) el.classList.add('active');
      });
    };
    window.addEventListener('scroll', handleReveal);
    handleReveal();
    return () => window.removeEventListener('scroll', handleReveal);
  }, [currentPath]);

  const addToCart = (product: Product, selectedSize?: { label: string; price: number }) => {
    setCart(prev => {
      const cartId = `${product.id}-${selectedSize?.label || 'default'}`;
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item => item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, cartId, quantity: 1, selectedSize }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const renderContent = () => {
    const content = (() => {
      switch (currentPath) {
        case '/': return <Home onNavigate={navigate} theme={theme} />;
        case '/shop': return <Shop addToCart={addToCart} initialProductId={pathParam} />;
        case '/commitment': return <Commitment />;
        case '/about': return <About />;
        case '/rituals': return <Rituals />;
        case '/faq': return <FAQ />;
        case '/login': return <Login onNavigate={navigate} />;
        case '/register': return <Register onNavigate={navigate} />;
        default: return <Home onNavigate={navigate} theme={theme} />;
      }
    })();

    return (
      <div className={`transition-all duration-700 ease-out-expo ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0 page-enter'}`}>
        {content}
      </div>
    );
  };

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar
          onNavigate={navigate}
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          cartItems={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <main className="flex-grow">
          {renderContent()}
        </main>
        <Footer onNavigate={navigate} />
        <ChatBot />
      </div>
    </AuthProvider>
  );
};

export default App;
