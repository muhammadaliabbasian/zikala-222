import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
  Zap,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useProducts } from '../context/ProductsContext.tsx';
import { Product } from '../types.ts';

interface ProductDetailsPageProps {
  productId: string;
  onNavigate: (page: string, params?: any) => void;
  onSelectProduct: (productId: string) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  productId,
  onNavigate,
  onSelectProduct,
}) => {
  const { products, submitReview } = useProducts();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'reviews'>('specs');

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentPrice = product.discountPrice || product.price;
  const isWishlisted = isInWishlist(product.id);

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, product.colors[selectedColorIdx]?.name);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, product.colors[selectedColorIdx]?.name);
    onNavigate('checkout');
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hello Zikala Horology! I am interested in purchasing the "${product.name}" (ID: ${product.id}) priced at PKR ${currentPrice.toLocaleString('en-PK')}. Please advise on delivery to my city.`
    );
    window.open(`https://wa.me/923001122334?text=${text}`, '_blank');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    await submitReview(product.id, {
      userName: reviewName,
      city: reviewCity || 'Karachi, Pakistan',
      rating: reviewRating,
      comment: reviewComment,
    });
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setShowReviewModal(false);
      setReviewComment('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-gray-400">
        <button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37]">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <button onClick={() => onNavigate('shop')} className="hover:text-[#D4AF37]">
          Shop
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-[#D4AF37] uppercase tracking-wider">{product.categoryLabel}</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-300 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Hero: Images (Left) + Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Interactive Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Display Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#151515] border border-[#242424] shadow-2xl group">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#D4AF37] text-black font-extrabold text-xs px-3 py-1 rounded-md uppercase tracking-wider shadow">
                Save {discountPercent}%
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-colors ${
                isWishlisted
                  ? 'bg-[#D4AF37] text-black shadow-lg'
                  : 'bg-black/60 text-gray-300 hover:text-white'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-black' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Selector Strip */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImageIdx === idx
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 scale-105'
                      : 'border-[#282828] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="p-4 rounded-xl bg-[#121212] border border-[#202020] grid grid-cols-2 gap-3 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              <span>Express Delivery across Pakistan</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>{product.specifications.warranty}</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
              <span>7-Day Inspection & Exchange</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>100% Genuine Certified</span>
            </div>
          </div>
        </div>

        {/* Right: Buy Controls & Specs */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold bg-[#1C1C1C] px-2.5 py-1 rounded">
                {product.categoryLabel}
              </span>
              <span className="text-xs text-gray-500">Ref: {product.id}</span>
              <span className="text-xs text-emerald-400 flex items-center font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {product.stockStatus}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-white">{product.rating}</span>
              <span className="text-xs text-gray-500">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-[#141414] border border-[#222222] flex items-baseline space-x-4">
              <div>
                <span className="text-xs text-gray-400 mr-1">PKR</span>
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {currentPrice.toLocaleString('en-PK')}
                </span>
              </div>
              {product.discountPrice && (
                <div className="text-sm text-gray-500 line-through">
                  PKR {product.price.toLocaleString('en-PK')}
                </div>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-[#D4AF37] bg-[#221B0C] border border-[#D4AF37]/40 px-2 py-0.5 rounded">
                  Save PKR {(product.price - product.discountPrice!).toLocaleString('en-PK')}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">{product.description}</p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
                Available Dial & Case Finish:{' '}
                <span className="text-white">{product.colors[selectedColorIdx]?.name}</span>
              </label>
              <div className="flex items-center space-x-3">
                {product.colors.map((color, idx) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`group flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                      selectedColorIdx === idx
                        ? 'border-[#D4AF37] bg-[#1A1A1A] text-white shadow'
                        : 'border-[#2E2E2E] text-gray-400 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/40"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-4">
              {/* Quantity Counter */}
              <div className="flex items-center border border-[#333333] rounded-xl bg-[#161616] px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-400 hover:text-white"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-bold text-white min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-400 hover:text-white"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 gold-button py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center shadow-lg transition-transform active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 mr-2" /> Add to Shopping Bag
              </button>
            </div>

            {/* Buy Now & WhatsApp Concierge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleBuyNow}
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#222222] hover:bg-[#2C2C2C] border border-[#3A3A3A] hover:border-[#D4AF37] flex items-center justify-center transition-colors"
              >
                <Zap className="w-4 h-4 mr-1.5 text-[#D4AF37]" /> Instant Checkout
              </button>
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-emerald-300 bg-[#0E2014] hover:bg-[#132A1B] border border-emerald-800/60 flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-1.5 text-emerald-400" /> Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications, Features, Reviews */}
      <div className="border-t border-[#222222] pt-8">
        <div className="flex border-b border-[#222222] space-x-8 text-sm font-serif">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 border-b-2 font-semibold transition-colors ${
              activeTab === 'specs'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 border-b-2 font-semibold transition-colors ${
              activeTab === 'features'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Artisanal Features ({product.features.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 font-semibold transition-colors ${
              activeTab === 'reviews'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Verified Client Reviews ({product.reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === 'specs' && (
            <div className="max-w-3xl">
              <div className="divide-y divide-[#202020] bg-[#121212] border border-[#222222] rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 p-3.5 text-xs">
                  <span className="text-gray-400 font-medium">Movement Calibre</span>
                  <span className="text-white font-semibold">{product.specifications.movement}</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs bg-[#151515]">
                  <span className="text-gray-400 font-medium">Crystal Glass</span>
                  <span className="text-white font-semibold">{product.specifications.glass}</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs">
                  <span className="text-gray-400 font-medium">Case Diameter</span>
                  <span className="text-white font-semibold">{product.specifications.caseDiameter}</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs bg-[#151515]">
                  <span className="text-gray-400 font-medium">Case Thickness</span>
                  <span className="text-white font-semibold">{product.specifications.caseThickness}</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs">
                  <span className="text-gray-400 font-medium">Case Material</span>
                  <span className="text-white font-semibold">{product.specifications.caseMaterial}</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs bg-[#151515]">
                  <span className="text-gray-400 font-medium">Strap / Bracelet</span>
                  <span className="text-white font-semibold">{product.specifications.strapMaterial}</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs">
                  <span className="text-gray-400 font-medium">Water Resistance</span>
                  <span className="text-white font-semibold">{product.specifications.waterResistance}</span>
                </div>
                <div className="grid grid-cols-2 p-3.5 text-xs bg-[#151515]">
                  <span className="text-gray-400 font-medium">Official Warranty</span>
                  <span className="text-[#D4AF37] font-semibold">{product.specifications.warranty}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="max-w-3xl space-y-3">
              {product.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#131313] border border-[#222222]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif font-bold text-white">Client Testimonials</h3>
                  <p className="text-xs text-gray-400">All reviews are from verified Pakistani deliveries</p>
                </div>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="gold-button px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Write a Review
                </button>
              </div>

              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-[#131313] border border-[#222222]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white font-serif">{rev.userName}</span>
                        <span className="text-[10px] text-gray-500">• {rev.city}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[9px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400' : 'text-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-gray-500 block mt-2">{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div onClick={() => setShowReviewModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative bg-[#141414] border border-[#2E2E2E] rounded-2xl p-6 max-w-md w-full shadow-2xl z-10">
            <div className="flex justify-between items-center pb-3 border-b border-[#242424] mb-4">
              <h3 className="text-base font-serif font-bold text-white">Review this Timepiece</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSuccess ? (
              <div className="py-8 text-center text-emerald-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <p className="text-sm font-semibold">Thank you for your feedback!</p>
                <p className="text-xs text-gray-400">Your review has been verified and published.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. Asad Farooq"
                    className="w-full bg-[#1C1C1C] border border-[#333333] p-2.5 rounded text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">City (in Pakistan)</label>
                  <input
                    type="text"
                    value={reviewCity}
                    onChange={(e) => setReviewCity(e.target.value)}
                    placeholder="e.g. Islamabad"
                    className="w-full bg-[#1C1C1C] border border-[#333333] p-2.5 rounded text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Star Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-amber-400 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating ? 'fill-amber-400' : 'text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Your Detailed Experience</label>
                  <textarea
                    required
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your thoughts on the finishing, weight, sapphire glass, and packaging..."
                    className="w-full bg-[#1C1C1C] border border-[#333333] p-2.5 rounded text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full gold-button py-2.5 rounded font-bold uppercase tracking-wider text-xs"
                >
                  Submit Verified Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-[#222222]">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-6">
            Related {product.categoryLabel} Timepieces
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
