import React, { useState } from 'react';
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Tag, Trash2, Truck, X } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';

interface CartDrawerProps {
  onCheckout: () => void;
  onNavigateShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onNavigateShop }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
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

  if (!isCartOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111111] border-l border-[#222222] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#222222] flex items-center justify-between bg-[#151515]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                Your Timepiece Vault
              </h2>
              <span className="text-xs text-gray-400">({cart.length})</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#222222] rounded-full transition-colors"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pakistan Free Shipping Progress Bar */}
          <div className="p-3 bg-[#181818] border-b border-[#242424] text-xs">
            <div className="flex items-center justify-between mb-1.5 text-gray-300">
              <span className="flex items-center font-medium">
                <Truck className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" />
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-400 font-semibold">
                    ✓ Free Nationwide Express Delivery Unlocked!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#D4AF37]">PKR {remainingForFreeShipping.toLocaleString('en-PK')}</strong> more for Free Delivery
                  </span>
                )}
              </span>
              <span className="font-bold text-[#D4AF37]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#292929] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#DFBA54] to-[#D4AF37] h-full transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[#202020]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center text-gray-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-gray-200 mb-1">
                  Your vault is empty
                </h3>
                <p className="text-xs text-gray-400 max-w-xs mb-6">
                  Select a bespoke watch from our curated collection to start building your legacy.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateShop();
                  }}
                  className="gold-button px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const unitPrice = item.product.discountPrice || item.product.price;
                return (
                  <div key={`${item.product.id}-${item.selectedColor}`} className="py-4 flex gap-3 sm:gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-[#1A1A1A] rounded-lg border border-[#282828] overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-semibold text-white line-clamp-1 font-serif">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                            className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#D4AF37]">
                          Color: <span className="text-gray-300 font-medium">{item.selectedColor}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Adjuster */}
                        <div className="flex items-center border border-[#333333] rounded-md bg-[#171717]">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)
                            }
                            className="p-1 text-gray-400 hover:text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)
                            }
                            className="p-1 text-gray-400 hover:text-white"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Price */}
                        <div className="text-right">
                          <span className="text-xs text-gray-400 mr-1">PKR</span>
                          <span className="text-sm font-bold text-white">
                            {(unitPrice * item.quantity).toLocaleString('en-PK')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#141414] border-t border-[#222222] space-y-3">
              {/* Promo code form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Coupon (e.g. ZIKALA10)"
                    className="w-full bg-[#1F1F1F] border border-[#333333] text-xs text-white pl-8 pr-3 py-2 rounded focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#262626] hover:bg-[#333333] text-gray-200 text-xs px-3 py-2 rounded font-medium transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponSuccess && (
                <p className="text-[11px] text-emerald-400 flex items-center">
                  <Check className="w-3.5 h-3.5 mr-1" /> 10% Zikala Privilege discount applied!
                </p>
              )}
              {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}

              {couponCode && (
                <div className="flex items-center justify-between text-xs bg-[#1D2A1C] border border-emerald-800/40 text-emerald-300 px-3 py-1.5 rounded">
                  <span>Coupon {couponCode} applied (-10%)</span>
                  <button onClick={removeCoupon} className="text-gray-400 hover:text-white text-[11px] underline">
                    Remove
                  </button>
                </div>
              )}

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-gray-400 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">
                    PKR {subtotal.toLocaleString('en-PK')}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>- PKR {discount.toLocaleString('en-PK')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery (Pakistan)</span>
                  <span className={shippingCharges === 0 ? 'text-emerald-400 font-semibold' : 'text-white'}>
                    {shippingCharges === 0 ? 'FREE' : `PKR ${shippingCharges.toLocaleString('en-PK')}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#242424]">
                  <span>Total Amount</span>
                  <span className="text-[#D4AF37] text-base">
                    PKR {total.toLocaleString('en-PK')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full gold-button py-3 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-widest flex items-center justify-center shadow-lg transition-transform active:scale-95"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
              </button>

              <p className="text-center text-[10px] text-gray-500">
                Encrypted Checkout • Cash on Delivery & Mobile Wallets Available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
