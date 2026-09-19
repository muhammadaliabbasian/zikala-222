import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Shield,
  Truck,
} from 'lucide-react';
import { useProducts } from '../context/ProductsContext.tsx';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { setSelectedCategory } = useProducts();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
  };

  const navigateToCategory = (page: string, category: string) => {
    setSelectedCategory(category);
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080808] border-t border-[#1C1C1C] text-gray-400">
      {/* 4 Pillars of Zikala Luxury */}
      <div className="border-b border-[#1A1A1A] py-8 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-full bg-[#181818] border border-[#262626] text-[#D4AF37]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Nationwide Express</h4>
              <p className="text-xs text-gray-400">TCS delivery across Pakistan</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-full bg-[#181818] border border-[#262626] text-[#D4AF37]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Authentic</h4>
              <p className="text-xs text-gray-400">Genuine international movements</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-full bg-[#181818] border border-[#262626] text-[#D4AF37]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">2 - 5 Year Warranty</h4>
              <p className="text-xs text-gray-400">Official certificate of warranty</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-full bg-[#181818] border border-[#262626] text-[#D4AF37]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">7-Day Inspection</h4>
              <p className="text-xs text-gray-400">Hassle-free return & refund</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Identity & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-serif tracking-[0.25em] text-2xl font-extrabold text-white">
                ZIKALA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
            </div>
            <p className="text-xs tracking-widest uppercase text-[#D4AF37] font-semibold">
              Time Defines Your Style
            </p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Zikala is Pakistan's premier horological destination, crafting and curating exquisite automatic, chronograph, and luxury dress watches for discerning individuals who appreciate timeless precision.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-white block mb-2">
                Join the Zikala Privileged Club
              </span>
              {newsletterSubscribed ? (
                <div className="flex items-center text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 p-2.5 rounded">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Thank you for subscribing! Welcome to the Privileged Club.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="bg-[#141414] border border-[#2A2A2A] text-xs text-white px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#D4AF37] flex-1"
                  />
                  <button
                    type="submit"
                    className="gold-button px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Watch Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    onNavigate('shop');
                  }}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  All Watches (30 Models)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('mens-watches', 'Mens')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Men's Watches (10)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('womens-watches', 'Womens')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Women's Watches (5)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('automatic-watches', 'Automatic')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Automatic Mechanical (5)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('chronograph-watches', 'Chronograph')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Chronograph Watches (5)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('luxury-watches', 'Luxury')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Luxury & Tourbillon (5)
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Account */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Customer Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('order-tracking')}
                  className="text-[#D4AF37] hover:underline flex items-center"
                >
                  <Clock className="w-3.5 h-3.5 mr-1" /> Track Order Status
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cart')} className="hover:text-[#D4AF37] transition-colors">
                  Shopping Cart
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('checkout')} className="hover:text-[#D4AF37] transition-colors">
                  Checkout
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wishlist')} className="hover:text-[#D4AF37] transition-colors">
                  My Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-[#D4AF37] transition-colors">
                  Customer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-[#D4AF37] transition-colors">
                  Sign In / Register
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('forgot-password')} className="hover:text-[#D4AF37] transition-colors">
                  Forgot Password
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Boutique Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Heritage & Policy
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#D4AF37] transition-colors">
                  About Zikala Heritage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#D4AF37] transition-colors">
                  Boutique Concierge & Contact
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-[#D4AF37] transition-colors">
                  Horology Journal & Guides
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy-policy')} className="hover:text-[#D4AF37] transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-[#D4AF37] transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('return-policy')} className="hover:text-[#D4AF37] transition-colors">
                  Return & Refund Policy
                </button>
              </li>
            </ul>

            <div className="mt-5 pt-4 border-t border-[#1F1F1F] text-xs space-y-1.5 text-gray-400">
              <div className="flex items-start text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] mr-1.5 mt-0.5 flex-shrink-0" />
                <span>Boutique #4, Dolmen Mall Clifton, Marine Drive, Karachi, Pakistan</span>
              </div>
              <div className="flex items-center text-[11px]">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] mr-1.5 flex-shrink-0" />
                <span>+92 300 1122334 (Mon - Sat 10am - 9pm)</span>
              </div>
              <div className="flex items-center text-[11px]">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37] mr-1.5 flex-shrink-0" />
                <span>concierge@zikala.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pakistan Payment Badges & Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-[#1C1C1C] flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <p className="text-gray-500">
              © 2026 Zikala Watches Pakistan (Pvt) Ltd. All Rights Reserved.
            </p>
          </div>

          {/* Payment Methods Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-gray-500 mr-1">Accepted Payment:</span>
            <span className="bg-[#171717] border border-[#2B2B2B] text-gray-300 font-medium px-2 py-1 rounded text-[10px]">
              Cash on Delivery (COD)
            </span>
            <span className="bg-[#171717] border border-emerald-900/60 text-emerald-400 font-semibold px-2 py-1 rounded text-[10px]">
              Easypaisa
            </span>
            <span className="bg-[#171717] border border-red-900/60 text-red-400 font-semibold px-2 py-1 rounded text-[10px]">
              JazzCash
            </span>
            <span className="bg-[#171717] border border-amber-900/60 text-amber-300 font-semibold px-2 py-1 rounded text-[10px]">
              Meezan Bank Wire
            </span>
            <span className="bg-[#171717] border border-[#2B2B2B] text-gray-300 px-2 py-1 rounded text-[10px]">
              Visa / Mastercard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
