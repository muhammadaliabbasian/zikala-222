import React, { useState } from 'react';
import {
  Clock,
  Heart,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useProducts } from '../context/ProductsContext.tsx';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenSearch }) => {
  const { cartCount, setIsCartOpen, wishlist } = useCart();
  const { user, isAdmin } = useAuth();
  const { setSelectedCategory } = useProducts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (pageName: string, category: string) => {
    setSelectedCategory(category);
    onNavigate(pageName);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#222222]">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#121212] border-b border-[#1E1E1E] text-xs py-1.5 px-4 text-gray-400">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-[#D4AF37] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> 100% Authentic Swiss & Japanese Movements
            </span>
            <span className="hidden md:inline text-gray-400">
              Free Express Delivery across Pakistan on orders above PKR 25,000
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://wa.me/923001122334"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-[#D4AF37] transition-colors"
            >
              <Phone className="w-3 h-3 mr-1 text-[#D4AF37]" />
              <span className="hidden sm:inline">Concierge:</span> +92 300 1122334
            </a>
            <button
              onClick={() => onNavigate('order-tracking')}
              className="text-gray-300 hover:text-[#D4AF37] transition-colors underline decoration-[#D4AF37]/50"
            >
              Track Order
            </button>
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded text-[11px] font-semibold hover:bg-[#D4AF37] hover:text-black transition-colors flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" /> Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-[#D4AF37] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={onOpenSearch}
              className="p-2 ml-1 text-gray-300 hover:text-[#D4AF37]"
              aria-label="Search watches"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo & Tagline */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <button
              onClick={() => onNavigate('home')}
              className="group text-left inline-flex flex-col items-center lg:items-start"
            >
              <div className="flex items-center space-x-2">
                <span className="font-serif tracking-[0.25em] text-2xl sm:text-3xl font-extrabold text-white group-hover:text-[#D4AF37] transition-colors">
                  ZIKALA
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] inline-block mb-1"></span>
              </div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-medium group-hover:text-gray-300 transition-colors">
                Time Defines Your Style
              </span>
            </button>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentPage === 'home' ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-[#D4AF37]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setSelectedCategory('All');
                onNavigate('shop');
              }}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentPage === 'shop' ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-[#D4AF37]'
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => handleCategoryClick('mens-watches', 'Mens')}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentPage === 'mens-watches' ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-[#D4AF37]'
              }`}
            >
              Men's
            </button>
            <button
              onClick={() => handleCategoryClick('womens-watches', 'Womens')}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentPage === 'womens-watches' ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-[#D4AF37]'
              }`}
            >
              Women's
            </button>
            <button
              onClick={() => handleCategoryClick('automatic-watches', 'Automatic')}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentPage === 'automatic-watches' ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-[#D4AF37]'
              }`}
            >
              Automatic
            </button>
            <button
              onClick={() => handleCategoryClick('chronograph-watches', 'Chronograph')}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentPage === 'chronograph-watches' ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-[#D4AF37]'
              }`}
            >
              Chronograph
            </button>
            <button
              onClick={() => handleCategoryClick('luxury-watches', 'Luxury')}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentPage === 'luxury-watches' ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-[#D4AF37]'
              }`}
            >
              Luxury
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentPage === 'about' ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-[#D4AF37]'
              }`}
            >
              Heritage
            </button>
            <button
              onClick={() => onNavigate('blog')}
              className={`text-sm font-medium tracking-wide transition-colors ${
                currentPage === 'blog' ? 'text-[#D4AF37]' : 'text-gray-300 hover:text-[#D4AF37]'
              }`}
            >
              Journal
            </button>
          </nav>

          {/* Action Icons: Search, Wishlist, User, Cart */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={onOpenSearch}
              className="hidden lg:flex p-2 text-gray-300 hover:text-[#D4AF37] transition-colors"
              title="Search Catalog"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 text-gray-300 hover:text-[#D4AF37] transition-colors"
              title="Your Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#D4AF37] text-black font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                if (user) {
                  onNavigate(user.role === 'admin' ? 'admin' : 'dashboard');
                } else {
                  onNavigate('login');
                }
              }}
              className="p-2 text-gray-300 hover:text-[#D4AF37] transition-colors"
              title={user ? `Signed in as ${user.name}` : 'Login / Register'}
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center bg-[#181818] border border-[#2D2D2D] hover:border-[#D4AF37] px-3.5 py-2 rounded-full text-white hover:text-[#D4AF37] transition-all group shadow-sm"
              aria-label="Open Cart Drawer"
            >
              <ShoppingBag className="w-5 h-5 mr-1.5 text-[#D4AF37] group-hover:scale-105 transition-transform" />
              <span className="text-xs font-semibold tracking-wider">CART</span>
              {cartCount > 0 && (
                <span className="ml-2 bg-[#D4AF37] text-black font-bold text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111111] border-b border-[#222222] px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          <div className="py-2 border-b border-[#222222] text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Collections
          </div>
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-base text-gray-200 hover:text-[#D4AF37]"
          >
            Home
          </button>
          <button
            onClick={() => {
              setSelectedCategory('All');
              onNavigate('shop');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-base text-gray-200 hover:text-[#D4AF37]"
          >
            All Watches (30 Models)
          </button>
          <button
            onClick={() => handleCategoryClick('mens-watches', 'Mens')}
            className="block w-full text-left py-2 text-base text-gray-200 hover:text-[#D4AF37]"
          >
            Men's Watches (10)
          </button>
          <button
            onClick={() => handleCategoryClick('womens-watches', 'Womens')}
            className="block w-full text-left py-2 text-base text-gray-200 hover:text-[#D4AF37]"
          >
            Women's Watches (5)
          </button>
          <button
            onClick={() => handleCategoryClick('automatic-watches', 'Automatic')}
            className="block w-full text-left py-2 text-base text-gray-200 hover:text-[#D4AF37]"
          >
            Automatic Watches (5)
          </button>
          <button
            onClick={() => handleCategoryClick('chronograph-watches', 'Chronograph')}
            className="block w-full text-left py-2 text-base text-gray-200 hover:text-[#D4AF37]"
          >
            Chronograph Watches (5)
          </button>
          <button
            onClick={() => handleCategoryClick('luxury-watches', 'Luxury')}
            className="block w-full text-left py-2 text-base text-gray-200 hover:text-[#D4AF37]"
          >
            Luxury Watches (5)
          </button>
          <div className="pt-2 border-t border-[#222222] space-y-2">
            <button
              onClick={() => {
                onNavigate('order-tracking');
                setMobileMenuOpen(false);
              }}
              className="flex items-center w-full text-left py-2 text-sm text-[#D4AF37]"
            >
              <Clock className="w-4 h-4 mr-2" /> Track My Order
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm text-gray-300 hover:text-[#D4AF37]"
            >
              About Zikala Heritage
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm text-gray-300 hover:text-[#D4AF37]"
            >
              Boutique & Contact Us
            </button>
            <button
              onClick={() => {
                onNavigate('blog');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm text-gray-300 hover:text-[#D4AF37]"
            >
              Horology Journal
            </button>
            {user ? (
              <button
                onClick={() => {
                  onNavigate(user.role === 'admin' ? 'admin' : 'dashboard');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-[#D4AF37] font-semibold"
              >
                Dashboard ({user.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-sm text-[#D4AF37] font-semibold"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
