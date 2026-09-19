import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { useProducts } from '../context/ProductsContext.tsx';
import { Product } from '../types.ts';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter((p: Product) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
        );
      })
    : products.slice(0, 4); // show 4 suggested items by default

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="relative max-w-2xl mx-auto bg-[#141414] border border-[#2B2B2B] rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-[#242424] bg-[#181818]">
          <Search className="w-5 h-5 text-[#D4AF37] mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search watches by name, movement, or category (e.g. Tourbillon, Automatic, GMT)..."
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-white mr-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-[#242424] text-gray-400 hover:text-white px-2 py-1 rounded"
          >
            ESC
          </button>
        </div>

        {/* Popular searches quick pills */}
        <div className="p-3 bg-[#111111] border-b border-[#1E1E1E] flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
          <span className="text-[11px] text-gray-500 mr-1">Popular:</span>
          {['Tourbillon', 'Obsidian', 'Automatic', 'Chronograph', 'Gold', 'Titanium'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="bg-[#1C1C1C] hover:bg-[#282828] text-gray-300 hover:text-[#D4AF37] px-2.5 py-0.5 rounded-full border border-[#2E2E2E] transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 divide-y divide-[#1F1F1F]">
          <div className="px-2 py-1.5 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
            {query.trim() ? `Search Results (${results.length})` : 'Featured Watch Picks'}
          </div>

          {results.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No timepieces found matching "{query}". Try checking the spelling or searching another category.
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product.id);
                  onClose();
                }}
                className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-[#1C1C1C] cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded bg-[#222222] overflow-hidden flex-shrink-0 border border-[#2C2C2C]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-[#D4AF37] font-serif transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      {product.categoryLabel} • {product.specifications.movement}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#D4AF37]">
                      PKR {(product.discountPrice || product.price).toLocaleString('en-PK')}
                    </span>
                    {product.discountPrice && (
                      <div className="text-[10px] text-gray-500 line-through">
                        PKR {product.price.toLocaleString('en-PK')}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
