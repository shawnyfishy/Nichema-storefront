
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
import { addToCartApi, updateCartLine, removeCartLine, getCart } from './api';

const mapShopifyLineToCartItem = (line: any): CartItem => {
  const variant = line.merchandise;
  const product = variant.product;
  return {
    id: product.id,
    name: product.title,
    category: 'skincare', // Default as we don't fetch full details in cart
    price: parseFloat(variant.price?.amount || '0'),
    image: product.images?.nodes?.[0]?.url || '',
    description: '',
    ingredients: [],
    usage: '',
    storage: '',
    packaging: '',
    cartId: line.id, // Use Shopify Line ID as the key
    lineId: line.id,
    quantity: line.quantity,
    selectedSize: {
      label: variant.title === 'Default Title' ? 'One Size' : variant.title,
      price: parseFloat(variant.price?.amount || '0')
    },
    badge: ''
  };
};

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [pathParam, setPathParam] = useState<string | undefined>(undefined);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize Theme and Cart
  useEffect(() => {
    const initCart = async () => {
      try {
        const shopifyCart = await getCart();
        if (shopifyCart && shopifyCart.lines?.nodes) {
          const items = shopifyCart.lines.nodes.map(mapShopifyLineToCartItem);
          setCart(items);
        } else {
          // Fallback to local storage if no existing online cart, but generally we rely on API
          // Only use local storage to maybe recover lost cart ID if needed, but api.ts handles that.
        }
      } catch (e) {
        console.error("Failed to sync cart:", e);
      }
    };
    initCart();

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

  const addToCart = async (product: Product, selectedSize?: { label: string; price: number }) => {
    // Optimistically update UI could be complex with Line IDs, so we'll wait for API for now to ensure correctness
    try {
      const updatedCart = await addToCartApi(product.id, 1, selectedSize);
      if (updatedCart?.lines?.nodes) {
        setCart(updatedCart.lines.nodes.map(mapShopifyLineToCartItem));
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Could not add to cart. Please try again.");
    }
  };

  const removeFromCart = async (cartId: string) => {
    // CartId is mapped to LineId in our helper
    try {
      const updatedCart = await removeCartLine(cartId);
      if (updatedCart?.lines?.nodes) {
        setCart(updatedCart.lines.nodes.map(mapShopifyLineToCartItem));
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const updateQuantity = async (cartId: string, delta: number) => {
    const item = cart.find(c => c.cartId === cartId);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    try {
      const updatedCart = await updateCartLine(cartId, newQty);
      if (updatedCart?.lines?.nodes) {
        setCart(updatedCart.lines.nodes.map(mapShopifyLineToCartItem));
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
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
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
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
