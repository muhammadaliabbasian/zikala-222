import React, { useState } from 'react';
import { Filter, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard.tsx';
import { useProducts } from '../context/ProductsContext.tsx';
import { ProductCategory } from '../types.ts';

interface ShopPageProps {
  onSelectProduct: (productId: string) => void;
  initialCategory?: string;
}

const CATEGORIES: { label: string; value: string; count: number }[] = [
  { label: 'All Collections', value: 'All', count: 30 },
  { label: "Men's Watches", value: 'Mens', count: 10 },
  { label: "Women's Watches", value: 'Womens', count: 5 },
  { label: 'Automatic Watches', value: 'Automatic', count: 5 },
  { label: 'Chronograph Watches', value: 'Chronograph', count: 5 },
  { label: 'Luxury & Tourbillon', value: 'Luxury', count: 5 },
];

export const ShopPage: React.FC<ShopPageProps> = ({ onSelectProduct }) => {
  const {
    products,
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
  } = useProducts();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  const displayedProducts = onlyInStock
    ? filteredProducts.filter((p) => p.stockStatus === 'In Stock')
    : filteredProducts;

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange([15000, 200000]);
    setSortBy('featured');
    setOnlyInStock(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="border-b border-[#222222] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
            Complete Horology Catalog
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            {selectedCategory === 'All'
              ? 'All Masterpiece Watches'
              : CATEGORIES.find((c) => c.value === selectedCategory)?.label || selectedCategory}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Showing {displayedProducts.length} of {products.length} bespoke timepieces in stock
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center bg-[#1C1C1C] border border-[#333333] hover:border-[#D4AF37] px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2 text-[#D4AF37]" />
            Filters & Price
          </button>

          {/* Sorting Dropdown */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#181818] border border-[#2E2E2E] text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="featured">Featured Collection</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ==========================================
            DESKTOP & MOBILE SIDEBAR FILTERS
            ========================================== */}
        <aside
          className={`lg:block ${
            mobileFiltersOpen
              ? 'fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-6 overflow-y-auto'
              : 'hidden'
          }`}
        >
          <div className="space-y-6 bg-[#121212] border border-[#222222] p-5 rounded-2xl">
            {/* Header for mobile filter drawer */}
            <div className="flex items-center justify-between lg:hidden pb-3 border-b border-[#222222]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center">
                <Filter className="w-4 h-4 mr-2 text-[#D4AF37]" /> Filters
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-2">
                Search Catalog
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Watch model or keyword..."
                  className="w-full bg-[#181818] border border-[#2B2B2B] text-xs text-white pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-gray-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-2">
                Categories
              </label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setSelectedCategory(cat.value);
                      if (mobileFiltersOpen) setMobileFiltersOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedCategory === cat.value
                        ? 'bg-[#D4AF37] text-black font-bold'
                        : 'text-gray-300 hover:bg-[#1C1C1C] hover:text-[#D4AF37]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        selectedCategory === cat.value
                          ? 'bg-black/20 text-black'
                          : 'bg-[#222222] text-gray-400'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range in PKR */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Price Range (PKR)
                </label>
                <span className="text-xs text-[#D4AF37] font-bold">
                  PKR {priceRange[1].toLocaleString('en-PK')}
                </span>
              </div>
              <input
                type="range"
                min="15000"
                max="200000"
                step="5000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-[#D4AF37] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                <span>PKR 15,000</span>
                <span>PKR 200,000</span>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-[#222222]">
              <label className="flex items-center space-x-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded bg-[#202020] border-[#333333] text-[#D4AF37] focus:ring-0 accent-[#D4AF37]"
                />
                <span>Only Show Available in Stock</span>
              </label>
            </div>

            {/* Reset Filters */}
            <button
              onClick={handleResetFilters}
              className="w-full py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2E2E2E] rounded-lg text-xs text-gray-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" />
              Reset All Filters
            </button>
          </div>
        </aside>

        {/* ==========================================
            PRODUCTS GRID
            ========================================== */}
        <div className="lg:col-span-3">
          {displayedProducts.length === 0 ? (
            <div className="py-20 text-center bg-[#111111] border border-[#222222] rounded-2xl p-8">
              <p className="text-base text-gray-300 font-serif mb-2">
                No timepieces match your current filter criteria.
              </p>
              <p className="text-xs text-gray-500 mb-6">
                Try widening your price range or clearing the search query.
              </p>
              <button
                onClick={handleResetFilters}
                className="gold-button px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Show All 30 Watches
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
