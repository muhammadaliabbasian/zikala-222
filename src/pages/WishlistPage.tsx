import React from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { Product } from '../types.ts';

interface WishlistPageProps {
  onNavigate: (page: string) => void;
  onSelectProduct: (id: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate, onSelectProduct }) => {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#161616] border border-[#262626] flex items-center justify-center text-gray-500 mx-auto mb-6">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-white mb-3">Your Wishlist is Empty</h1>
        <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
          Save your favorite luxury timepieces to track pricing, stock availability, and special promotions.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="gold-button px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg"
        >
          Explore Watch Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="border-b border-[#222222] pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
            Personal Curation
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Saved Timepieces ({wishlist.length})
          </h1>
        </div>
        <button
          onClick={() => onNavigate('shop')}
          className="text-xs text-[#D4AF37] hover:underline"
        >
          + Add More Watches
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product: Product) => {
          const currentPrice = product.discountPrice || product.price;
          return (
            <div
              key={product.id}
              className="group relative bg-[#131313] border border-[#222222] hover:border-[#D4AF37]/60 rounded-xl overflow-hidden flex flex-col justify-between"
            >
              {/* Image */}
              <div
                onClick={() => onSelectProduct(product.id)}
                className="relative aspect-square w-full overflow-hidden bg-[#181818] cursor-pointer"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-red-950 text-red-400 rounded-full transition-colors"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                    {product.categoryLabel}
                  </span>
                  <h3
                    onClick={() => onSelectProduct(product.id)}
                    className="text-sm font-serif font-bold text-white hover:text-[#D4AF37] cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{product.shortDescription}</p>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-[#1F1F1F]">
                  <div>
                    <span className="text-xs text-gray-400 mr-1">PKR</span>
                    <span className="text-base font-bold text-white">
                      {currentPrice.toLocaleString('en-PK')}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="gold-button px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
