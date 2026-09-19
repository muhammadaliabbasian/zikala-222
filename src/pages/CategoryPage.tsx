import React from 'react';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/ProductCard.tsx';
import { useProducts } from '../context/ProductsContext.tsx';
import { ProductCategory } from '../types.ts';

interface CategoryPageProps {
  category: ProductCategory;
  title: string;
  subtitle: string;
  heroImage: string;
  onNavigate: (page: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  title,
  subtitle,
  heroImage,
  onNavigate,
  onSelectProduct,
}) => {
  const { products } = useProducts();

  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Category Hero Banner */}
      <div className="relative min-h-[40vh] sm:min-h-[45vh] flex items-center justify-center overflow-hidden border-b border-[#1E1E1E]">
        <img
          src={heroImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.35] contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center py-12">
          {/* Breadcrumb */}
          <nav className="inline-flex items-center space-x-2 text-xs text-gray-400 mb-4 bg-black/60 px-3 py-1 rounded-full border border-white/10">
            <button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37]">
              Home
            </button>
            <ChevronRight className="w-3 h-3 text-gray-500" />
            <button onClick={() => onNavigate('shop')} className="hover:text-[#D4AF37]">
              Shop
            </button>
            <ChevronRight className="w-3 h-3 text-gray-500" />
            <span className="text-[#D4AF37] font-semibold">{title}</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white mb-3">
            {title}
          </h1>
          <p className="text-xs sm:text-base text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            {subtitle}
          </p>
          <span className="inline-block text-xs uppercase tracking-widest text-[#D4AF37] font-semibold mt-4">
            {categoryProducts.length} Dedicated Models in Collection
          </span>
        </div>
      </div>

      {/* Grid of watches */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-[#222222] pb-4 mb-8">
          <p className="text-xs text-gray-400">
            Showing all <strong className="text-white">{categoryProducts.length}</strong> timepieces
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs text-[#D4AF37] hover:underline flex items-center font-medium"
          >
            Explore Full 30-Watch Catalog <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
          ))}
        </div>
      </div>
    </div>
  );
};
