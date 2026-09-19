import React from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard.tsx';
import { useProducts } from '../context/ProductsContext.tsx';
import { Product } from '../types.ts';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectProduct: (productId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const { products, setSelectedCategory } = useProducts();

  const featuredWatches = products.filter((p) => p.featured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  const handleCategorySelect = (category: string, page: string) => {
    setSelectedCategory(category);
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* ==========================================
          1. HERO SECTION
          ========================================== */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[#1E1E1E]">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2000&q=85"
            alt="Luxury Watch Movement Background"
            className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-125 scale-105 transition-transform duration-10000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-transparent" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#0B0B0B]/60 to-[#0B0B0B]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-16">
          {/* Subtle Tagline */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#181818]/90 border border-[#D4AF37]/30 text-xs sm:text-sm text-[#D4AF37] tracking-[0.25em] uppercase font-semibold mb-6 shadow-lg backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Haute Horlogerie in Pakistan</span>
          </div>

          {/* Animated Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold tracking-tight text-white leading-tight sm:leading-none mb-6">
            Timeless Elegance. <br />
            <span className="gold-gradient-text">Modern Style.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Discover premium watches designed for every moment. Engineered with sapphire crystal, surgical steel, and genuine automatic movements.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <button
              onClick={() => {
                setSelectedCategory('All');
                onNavigate('shop');
              }}
              className="w-full sm:w-auto gold-button px-8 py-4 rounded-full text-xs sm:text-sm font-extrabold tracking-[0.15em] uppercase flex items-center justify-center shadow-[0_4px_25px_rgba(212,175,55,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              Shop Now <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button
              onClick={() => handleCategorySelect('Luxury', 'luxury-watches')}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-xs sm:text-sm font-bold tracking-[0.15em] uppercase text-white bg-transparent hover:bg-white/10 border border-[#444444] hover:border-[#D4AF37] transition-all"
            >
              Explore Tourbillon & Luxury
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <span className="block text-xl sm:text-2xl font-serif font-bold text-[#D4AF37]">
                30+ Models
              </span>
              <span className="text-[11px] uppercase tracking-wider text-gray-400">
                Curated Timepieces
              </span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-serif font-bold text-[#D4AF37]">
                100% Sapphire
              </span>
              <span className="text-[11px] uppercase tracking-wider text-gray-400">
                Scratch-Proof Glass
              </span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-serif font-bold text-[#D4AF37]">
                5 Years
              </span>
              <span className="text-[11px] uppercase tracking-wider text-gray-400">
                Master Warranty
              </span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-serif font-bold text-[#D4AF37]">
                48hr Delivery
              </span>
              <span className="text-[11px] uppercase tracking-wider text-gray-400">
                Nationwide in Pakistan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. CATEGORY CARDS SECTION
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              Discover by Horology Category
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              onNavigate('shop');
            }}
            className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center mt-2 sm:mt-0 tracking-wider uppercase"
          >
            View All 30 Models <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Men's Watches */}
          <div
            onClick={() => handleCategorySelect('Mens', 'mens-watches')}
            className="group relative h-72 rounded-xl overflow-hidden cursor-pointer border border-[#222222] hover:border-[#D4AF37] transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
              alt="Men's Watches"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                10 Timepieces
              </span>
              <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                Men's Watches
              </h3>
              <p className="text-xs text-gray-300 mt-1 line-clamp-1">
                Executive steel & aviation designs
              </p>
            </div>
          </div>

          {/* Women's Watches */}
          <div
            onClick={() => handleCategorySelect('Womens', 'womens-watches')}
            className="group relative h-72 rounded-xl overflow-hidden cursor-pointer border border-[#222222] hover:border-[#D4AF37] transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=80"
              alt="Women's Watches"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                5 Timepieces
              </span>
              <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                Women's Watches
              </h3>
              <p className="text-xs text-gray-300 mt-1 line-clamp-1">
                Mother-of-pearl & pavé diamonds
              </p>
            </div>
          </div>

          {/* Automatic Watches */}
          <div
            onClick={() => handleCategorySelect('Automatic', 'automatic-watches')}
            className="group relative h-72 rounded-xl overflow-hidden cursor-pointer border border-[#222222] hover:border-[#D4AF37] transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
              alt="Automatic Watches"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                5 Timepieces
              </span>
              <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                Automatic
              </h3>
              <p className="text-xs text-gray-300 mt-1 line-clamp-1">
                Open-heart & skeleton rotors
              </p>
            </div>
          </div>

          {/* Chronograph Watches */}
          <div
            onClick={() => handleCategorySelect('Chronograph', 'chronograph-watches')}
            className="group relative h-72 rounded-xl overflow-hidden cursor-pointer border border-[#222222] hover:border-[#D4AF37] transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80"
              alt="Chronograph Watches"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                5 Timepieces
              </span>
              <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                Chronograph
              </h3>
              <p className="text-xs text-gray-300 mt-1 line-clamp-1">
                Racing tachymeters & flyback stopwatches
              </p>
            </div>
          </div>

          {/* Luxury Watches */}
          <div
            onClick={() => handleCategorySelect('Luxury', 'luxury-watches')}
            className="group relative h-72 rounded-xl overflow-hidden cursor-pointer border border-[#222222] hover:border-[#D4AF37] transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80"
              alt="Luxury Watches"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                5 Timepieces
              </span>
              <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                Luxury & Haute
              </h3>
              <p className="text-xs text-gray-300 mt-1 line-clamp-1">
                Flying tourbillons & 18K gold casing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. FEATURED PRODUCTS SECTION
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
            Iconic Selections
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">
            Featured Timepieces
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Handpicked icons showcasing the pinnacle of Zikala design and mechanical precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredWatches.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* ==========================================
          4. SPECIAL DISCOUNT PROMO BANNER
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#18150D] via-[#121212] to-[#0D0D0D] border border-[#D4AF37]/40 p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block bg-[#D4AF37] text-black font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Limited Privilege Offer
            </span>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Enjoy 10% Off Your First Order <br />
              with Promo Code <span className="text-[#D4AF37]">ZIKALA10</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Experience Pakistani luxury watchmaking. Includes complimentary premium wooden presentation trunk, 2 to 5 years official international warranty, and free express courier delivery.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  onNavigate('shop');
                }}
                className="gold-button px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-md"
              >
                Claim Privilege Discount
              </button>
              <button
                onClick={() => onNavigate('order-tracking')}
                className="text-xs text-gray-300 hover:text-[#D4AF37] underline tracking-wider uppercase font-medium"
              >
                Track an Existing Order
              </button>
            </div>
          </div>

          {/* Decorative Gold Rings */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full border border-[#D4AF37]/20 pointer-events-none" />
          <div className="absolute -right-28 -bottom-28 w-96 h-96 rounded-full border border-[#D4AF37]/10 pointer-events-none" />
        </div>
      </section>

      {/* ==========================================
          5. BEST-SELLING WATCHES
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
              Customer Favorites
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              Best-Selling Watches in Pakistan
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              onNavigate('shop');
            }}
            className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center mt-2 sm:mt-0 tracking-wider uppercase"
          >
            Explore All Best-Sellers <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* ==========================================
          6. WHY CHOOSE ZIKALA
          ========================================== */}
      <section className="bg-[#0E0E0E] border-y border-[#1C1C1C] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
              Unrivaled Standards
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">
              Why Discerning Collectors Choose Zikala
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Each timepiece represents an uncompromising commitment to micro-engineering, materials purity, and Pakistani client hospitality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222222] hover:border-[#D4AF37]/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] flex items-center justify-center text-[#D4AF37] mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">
                Pure Sapphire & Surgical Steel
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We never compromise with acrylic or untreated glass. Every Zikala watch features synthetic corundum sapphire crystals rated 9 on the Mohs hardness scale and marine-grade 316L stainless steel.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222222] hover:border-[#D4AF37]/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] flex items-center justify-center text-[#D4AF37] mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">
                TCS Secure Armored Delivery
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Dispatched in tamper-evident sealed packaging directly to your doorstep in Karachi, Lahore, Islamabad, Peshawar, Quetta, and all 150+ Pakistani cities with tracking.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141414] border border-[#222222] hover:border-[#D4AF37]/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#1C1C1C] border border-[#2B2B2B] flex items-center justify-center text-[#D4AF37] mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white mb-2">
                Comprehensive 5-Year Guarantee
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Backed by our master watchmakers at our Karachi Clifton flagship service center. Includes complimentary demagnetization, movement cleaning, and pressure gasket testing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          7. NEW ARRIVALS
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
              Fresh Off The Atelier
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              New Arrivals Collection
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              onNavigate('shop');
            }}
            className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center mt-2 sm:mt-0 tracking-wider uppercase"
          >
            Explore All New Releases <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* ==========================================
          8. CUSTOMER TESTIMONIALS (Pakistan Verified)
          ========================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
            Voices of Connoisseurs
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">
            Praised by Pakistani Watch Enthusiasts
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Real feedback from gentlemen and ladies across Pakistan who wear Zikala with pride.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#121212] border border-[#222222] flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 mr-0.5" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-300 italic mb-4 leading-relaxed">
                "Ordered the Zikala Skeleton Open Heart Automatic to Lahore via Cash on Delivery. The mechanical movement and exhibition sapphire back exceeded my highest expectations. Packaged with extreme luxury."
              </p>
            </div>
            <div className="pt-4 border-t border-[#1F1F1F] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white font-serif">Shahmeer Abbasi</h4>
                <p className="text-[11px] text-gray-500">Lahore, Punjab</p>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Buyer
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#121212] border border-[#222222] flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 mr-0.5" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-300 italic mb-4 leading-relaxed">
                "The Seraphina Emerald Grace watch is simply stunning. The malachite dial pattern against the 18K gold casing has garnered compliments at every high tea in Karachi. Truly international craftsmanship."
              </p>
            </div>
            <div className="pt-4 border-t border-[#1F1F1F] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white font-serif">Dr. Mahnoor Javed</h4>
                <p className="text-[11px] text-gray-500">DHA Karachi</p>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Buyer
              </span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#121212] border border-[#222222] flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 mr-0.5" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-300 italic mb-4 leading-relaxed">
                "I bought the Royal Obsidian Heritage for my father’s retirement in Islamabad. The solid steel link bracelet and double-domed sapphire look indistinguishable from Swiss heritage brands costing 500k+."
              </p>
            </div>
            <div className="pt-4 border-t border-[#1F1F1F] flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white font-serif">Hamza Tariq</h4>
                <p className="text-[11px] text-gray-500">F-7 Islamabad</p>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Buyer
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
