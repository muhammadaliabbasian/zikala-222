import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface CartPageProps {
  onNavigate: (page: string) => void;
  onSelectProduct: (id: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate, onSelectProduct }) => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    freeShippingThreshold,
    shippingCharges,
    discount,
    couponCode,
    applyCoupon,
    removeCoupon,
    total,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!inputCoupon.trim()) return;
    const ok = applyCoupon(inputCoupon);
    if (ok) {
      setCouponSuccess(true);
      setInputCoupon('');
      setTimeout(() => setCouponSuccess(false), 3000);
    } else {
      setCouponError('Invalid promo code. Try "ZIKALA10" for 10% off.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#161616] border border-[#262626] flex items-center justify-center text-gray-500 mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-white mb-3">
          Your Shopping Vault is Empty
        </h1>
        <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
          You haven't selected any watches yet. Browse our curated horology collection to choose your signature timepiece.
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
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-gray-400">
        <button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37]">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-white font-medium">Shopping Cart</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[#222222] pb-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-red-400 transition-colors mt-2 sm:mt-0 flex items-center"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear Entire Cart
        </button>
      </div>

      {/* Free Shipping Progress */}
      <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center text-gray-200 font-medium">
            <Truck className="w-4 h-4 mr-2 text-[#D4AF37]" />
            {subtotal >= freeShippingThreshold ? (
              <span className="text-emerald-400 font-bold">
                ✓ Free Express TCS Shipping Unlocked across Pakistan!
              </span>
            ) : (
              <span>
                Add <strong className="text-[#D4AF37]">PKR {remainingForFreeShipping.toLocaleString('en-PK')}</strong> more to qualify for Free Express Shipping
              </span>
            )}
          </span>
          <span className="text-[#D4AF37] font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-[#242424] h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#DFBA54] to-[#D4AF37] h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-[#202020] bg-[#121212] border border-[#222222] rounded-2xl overflow-hidden p-4 sm:p-6">
            {cart.map((item) => {
              const unitPrice = item.product.discountPrice || item.product.price;
              return (
                <div
                  key={`${item.product.id}-${item.selectedColor}`}
                  className="py-4 sm:py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      onClick={() => onSelectProduct(item.product.id)}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#181818] border border-[#2A2A2A] flex-shrink-0 cursor-pointer"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold">
                        {item.product.categoryLabel}
                      </span>
                      <h3
                        onClick={() => onSelectProduct(item.product.id)}
                        className="text-sm sm:text-base font-serif font-bold text-white hover:text-[#D4AF37] cursor-pointer"
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Finish: <span className="text-gray-200 font-medium">{item.selectedColor}</span>
                      </p>
                      <p className="text-xs text-[#D4AF37] font-semibold mt-1">
                        PKR {unitPrice.toLocaleString('en-PK')} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end sm:space-x-8 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1E1E1E]">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-[#333333] rounded-lg bg-[#181818] px-1 py-0.5">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)
                        }
                        className="p-1.5 text-gray-400 hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-white min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)
                        }
                        className="p-1.5 text-gray-400 hover:text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total for line */}
                    <div className="text-right min-w-[100px]">
                      <span className="text-xs text-gray-400 mr-1">PKR</span>
                      <span className="text-base font-bold text-white">
                        {(unitPrice * item.quantity).toLocaleString('en-PK')}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                      className="text-gray-500 hover:text-red-400 p-1.5 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="text-xs text-[#D4AF37] hover:underline flex items-center font-medium"
          >
            ← Continue Browsing Timepieces
          </button>
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#262626] shadow-xl space-y-4">
            <h2 className="text-lg font-serif font-bold text-white border-b border-[#242424] pb-3">
              Order Summary
            </h2>

            {/* Coupon Code */}
            <div>
              <label className="text-xs text-gray-400 block mb-1.5">Privilege Coupon Code</label>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="e.g. ZIKALA10"
                    className="w-full bg-[#1C1C1C] border border-[#333333] text-xs text-white pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#262626] hover:bg-[#333333] text-white text-xs px-3.5 py-2 rounded-lg font-semibold"
                >
                  Apply
                </button>
              </form>

              {couponSuccess && (
                <p className="text-[11px] text-emerald-400 flex items-center mt-1.5">
                  <Check className="w-3.5 h-3.5 mr-1" /> 10% Discount applied!
                </p>
              )}
              {couponError && <p className="text-[11px] text-red-400 mt-1.5">{couponError}</p>}

              {couponCode && (
                <div className="flex items-center justify-between text-xs bg-[#1A2619] border border-emerald-800/40 text-emerald-300 p-2 rounded-lg mt-2">
                  <span>Applied code: {couponCode} (-10%)</span>
                  <button onClick={removeCoupon} className="text-gray-400 hover:text-white underline text-[10px]">
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-gray-400 pt-2 border-t border-[#222222]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">PKR {subtotal.toLocaleString('en-PK')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Privilege Discount</span>
                  <span>- PKR {discount.toLocaleString('en-PK')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Pakistan Express Delivery (TCS)</span>
                <span className={shippingCharges === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                  {shippingCharges === 0 ? 'FREE' : `PKR ${shippingCharges.toLocaleString('en-PK')}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-[#262626]">
                <span>Total Amount</span>
                <span className="text-[#D4AF37]">PKR {total.toLocaleString('en-PK')}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => onNavigate('checkout')}
              className="w-full gold-button py-3.5 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-widest flex items-center justify-center shadow-lg transition-transform active:scale-95"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
            </button>

            <div className="pt-2 text-[11px] text-gray-500 text-center space-y-1">
              <p className="flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] mr-1" />
                256-Bit SSL Encrypted & Fraud Protected
              </p>
              <p>Cash on Delivery • Easypaisa • JazzCash • Bank Wire</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
