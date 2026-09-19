import React, { useState } from 'react';
import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { Product } from '../types.ts';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentPrice = product.discountPrice || product.price;
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group relative bg-[#131313] border border-[#222222] hover:border-[#D4AF37]/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-[#D4AF37] text-black font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow">
            SAVE {discountPercent}%
          </span>
        )}
        {product.isNewArrival && (
          <span className="bg-[#1C1C1C] text-[#D4AF37] border border-[#D4AF37]/50 font-semibold text-[9px] tracking-widest uppercase px-2 py-0.5 rounded">
            NEW
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-amber-950/80 text-amber-300 border border-amber-600/40 font-semibold text-[9px] tracking-widest uppercase px-2 py-0.5 rounded">
            BESTSELLER
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-colors ${
          isWishlisted
            ? 'bg-[#D4AF37] text-black shadow-md'
            : 'bg-black/50 text-gray-300 hover:text-white hover:bg-black/80'
        }`}
        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        aria-label="Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-black' : ''}`} />
      </button>

      {/* Watch Image with Hover Zoom */}
      <div
        onClick={() => onSelect(product.id)}
        className="relative aspect-square w-full overflow-hidden bg-[#181818] cursor-pointer"
      >
        <img
          src={product.images[activeImageIdx] || product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product.id);
            }}
            className="bg-white/90 hover:bg-[#D4AF37] text-black font-semibold text-xs tracking-wider uppercase px-4 py-2 rounded-full flex items-center shadow-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="uppercase tracking-wider text-[11px] text-[#D4AF37]/90 font-medium">
              {product.categoryLabel}
            </span>
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-amber-400 mr-1" />
              <span className="font-semibold text-gray-200">{product.rating}</span>
              <span className="text-gray-500 text-[10px] ml-1">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(product.id)}
            className="text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-1 mb-1 font-serif"
          >
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-gray-400 line-clamp-2 mb-3 min-h-[32px]">
            {product.shortDescription}
          </p>
        </div>

        <div>
          {/* Color Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1.5 mb-3">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider mr-1">Shades:</span>
              {product.colors.map((color, idx) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColorIdx(idx)}
                  className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                    selectedColorIdx === idx
                      ? 'border-[#D4AF37] scale-125 ring-1 ring-[#D4AF37]'
                      : 'border-neutral-600 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          )}

          {/* Pricing in PKR */}
          <div className="flex items-baseline justify-between pt-2 border-t border-[#1F1F1F]">
            <div>
              <span className="text-xs text-gray-400 mr-1">PKR</span>
              <span className="text-lg font-bold text-white tracking-tight">
                {currentPrice.toLocaleString('en-PK')}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-gray-500 line-through ml-2">
                  PKR {product.price.toLocaleString('en-PK')}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => addToCart(product, 1, product.colors[selectedColorIdx]?.name)}
              className="gold-button px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase flex items-center shadow-sm"
              title="Add to Shopping Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5 mr-1" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
