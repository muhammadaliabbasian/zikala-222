import React, { useState } from 'react';
import {
  AlertCircle,
  Building,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  ExternalLink,
  HelpCircle,
  Lock,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smartphone,
  Truck,
  User,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { ALL_PAKISTANI_CITIES, PAKISTAN_PROVINCES, validatePakistaniPhone } from '../data/pakistan.ts';
import { api } from '../services/api.ts';
import { Order, PaymentMethod } from '../types.ts';

interface CheckoutPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, subtotal, shippingCharges, discount, couponCode, total, clearCart } = useCart();
  const { user } = useAuth();

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.addresses?.[0]?.address || '');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'Karachi');
  const [province, setProvince] = useState(
    user?.addresses?.[0]?.province || 'Sindh'
  );
  const [postalCode, setPostalCode] = useState(user?.addresses?.[0]?.postalCode || '');
  const [notes, setNotes] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionId, setTransactionId] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // When city changes, optionally set default province
  const handleCityChange = (selectedCity: string) => {
    setCity(selectedCity);
    const foundProv = PAKISTAN_PROVINCES.find((p) => p.cities.includes(selectedCity));
    if (foundProv) {
      setProvince(foundProv.province);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add watches before checking out.');
      return;
    }

    if (!fullName.trim() || !email.trim() || !address.trim() || !city.trim()) {
      setErrorMessage('Please complete all mandatory delivery fields.');
      return;
    }

    if (!validatePakistaniPhone(phone)) {
      setErrorMessage('Please provide a valid Pakistani mobile number (e.g. 03001234567).');
      return;
    }

    if (paymentMethod !== 'cod' && !transactionId.trim()) {
      setErrorMessage('Please enter your transaction reference ID / Sender mobile.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          fullName,
          phone,
          email,
          address,
          city,
          province,
          postalCode,
          orderNotes: notes.trim() || undefined,
        },
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          image: item.product.images[0],
          color: item.selectedColor,
          price: item.product.discountPrice || item.product.price,
          quantity: item.quantity,
          subtotal: (item.product.discountPrice || item.product.price) * item.quantity,
        })),
        paymentMethod,
        paymentTransactionId: transactionId.trim() || undefined,
        couponCode: couponCode || undefined,
      };

      const created = await api.createOrder(orderPayload);
      clearCart();
      setCompletedOrder(created);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20 text-center space-y-8">
        <div className="w-20 h-20 bg-[#152414] border border-emerald-700/50 rounded-full flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
            Order Confirmed & Secured
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
            Thank You for Choosing Zikala
          </h1>
          <p className="text-sm text-gray-300 max-w-lg mx-auto">
            Your timepiece has entered the priority horology preparation and quality-testing queue at our Karachi atelier.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#121212] border border-[#242424] rounded-2xl p-6 text-left space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202020] gap-2">
            <div>
              <span className="text-xs text-gray-500 block">Zikala Reference Number</span>
              <span className="text-lg font-serif font-bold text-[#D4AF37]">
                {completedOrder.id}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">TCS Vault Express Tracking</span>
              <span className="text-sm font-semibold text-white">
                {completedOrder.trackingNumber}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 block">Payment Method</span>
              <span className="text-sm font-semibold text-emerald-400 uppercase">
                {completedOrder.paymentMethod}
              </span>
            </div>
          </div>

          <div className="text-xs text-gray-300 space-y-1.5">
            <p>
              <strong>Recipient:</strong> {completedOrder.customer.fullName} ({completedOrder.customer.phone})
            </p>
            <p>
              <strong>Delivery Destination:</strong> {completedOrder.customer.address}, {completedOrder.customer.city}, {completedOrder.customer.province}
            </p>
            <p>
              <strong>Order Total:</strong>{' '}
              <span className="text-[#D4AF37] font-bold text-sm">
                PKR {completedOrder.total.toLocaleString('en-PK')}
              </span>
            </p>
          </div>

          <div className="p-3 bg-[#181818] rounded-xl border border-[#2A2A2A] flex items-center space-x-3 text-xs text-gray-400">
            <Truck className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
            <span>
              Expected delivery: <strong>2 - 4 business days</strong>. A dispatch SMS and email confirmation has been dispatched.
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('order-tracking', { trackingId: completedOrder.id })}
            className="gold-button w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            Track Live Shipment Status
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-semibold text-gray-300 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2F2F2F] hover:text-white transition-colors"
          >
            Continue Browsing Watches
          </button>
        </div>
      </div>
    );
  }

  // EMPTY CART GUARD
  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-serif font-bold text-white mb-4">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-gray-400 mb-8">
          Please add a watch to your shopping bag before proceeding to checkout.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="gold-button px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-gray-400 mb-8">
        <button onClick={() => onNavigate('home')} className="hover:text-[#D4AF37]">
          Home
        </button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => onNavigate('cart')} className="hover:text-[#D4AF37]">
          Shopping Bag
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white font-medium">Secured Checkout</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left column: Checkout form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Header */}
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
              Final Verification
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Secured Delivery & Payment
            </h1>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Step 1: Customer & Address */}
            <div className="bg-[#121212] border border-[#242424] rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-[#1E1E1E]">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <h2 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
                  1. Nationwide Delivery Address (Pakistan)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Asad Farooq"
                    className="w-full bg-[#181818] border border-[#2B2B2B] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#181818] border border-[#2B2B2B] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-gray-300 mb-1 font-medium">
                  Pakistani Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567 or +923001234567"
                  className="w-full bg-[#181818] border border-[#2B2B2B] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Our courier requires an active Pakistani mobile number for delivery confirmation SMS.
                </p>
              </div>

              <div className="text-xs">
                <label className="block text-gray-300 mb-1 font-medium">
                  Street Address / House / Apartment / Sector *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House # 12, Street 4, Sector F-7/2 or DHA Phase 5"
                  className="w-full bg-[#181818] border border-[#2B2B2B] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1 font-medium">City *</label>
                  <select
                    value={city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2B2B2B] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {ALL_PAKISTANI_CITIES.map((c: string) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Province *</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2B2B2B] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {PAKISTAN_PROVINCES.map((pr) => (
                      <option key={pr.province} value={pr.province}>
                        {pr.province}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 font-medium">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 75500"
                    className="w-full bg-[#181818] border border-[#2B2B2B] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-gray-300 mb-1 font-medium">
                  Special Delivery Instructions / Gate Code (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Call before arrival, leave at reception, etc."
                  className="w-full bg-[#181818] border border-[#2B2B2B] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-[#121212] border border-[#242424] rounded-2xl p-6 space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-[#1E1E1E]">
                <Wallet className="w-4 h-4 text-[#D4AF37]" />
                <h2 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
                  2. Pakistani Payment Gateway
                </h2>
              </div>

              <div className="space-y-3 text-xs">
                {/* 1. Cash on Delivery */}
                <label
                  className={`flex items-start p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-[#D4AF37] bg-[#1E1A11]'
                      : 'border-[#242424] bg-[#161616] hover:border-[#333333]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 text-[#D4AF37] focus:ring-0"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">Cash on Delivery (COD)</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                        Most Popular
                      </span>
                    </div>
                    <p className="text-gray-400 mt-1">
                      Pay cash to the TCS Vault courier upon physical delivery and parcel inspection at your doorstep.
                    </p>
                  </div>
                </label>

                {/* 2. Easypaisa */}
                <label
                  className={`flex items-start p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'easypaisa'
                      ? 'border-[#D4AF37] bg-[#1E1A11]'
                      : 'border-[#242424] bg-[#161616] hover:border-[#333333]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="easypaisa"
                    checked={paymentMethod === 'easypaisa'}
                    onChange={() => setPaymentMethod('easypaisa')}
                    className="mt-0.5 text-[#D4AF37] focus:ring-0"
                  />
                  <div className="ml-3 flex-1">
                    <span className="font-semibold text-white">Easypaisa Mobile Wallet</span>
                    <p className="text-gray-400 mt-1">
                      Transfer directly to Zikala official merchant account: <strong>0300-1122334</strong> (Title: Zikala Luxury Watches).
                    </p>
                  </div>
                </label>

                {/* 3. JazzCash */}
                <label
                  className={`flex items-start p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'jazzcash'
                      ? 'border-[#D4AF37] bg-[#1E1A11]'
                      : 'border-[#242424] bg-[#161616] hover:border-[#333333]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="jazzcash"
                    checked={paymentMethod === 'jazzcash'}
                    onChange={() => setPaymentMethod('jazzcash')}
                    className="mt-0.5 text-[#D4AF37] focus:ring-0"
                  />
                  <div className="ml-3 flex-1">
                    <span className="font-semibold text-white">JazzCash Mobile Wallet</span>
                    <p className="text-gray-400 mt-1">
                      Transfer directly to Zikala account: <strong>0300-1122334</strong> (Title: Zikala Luxury Watches).
                    </p>
                  </div>
                </label>

                {/* 4. Bank Transfer */}
                <label
                  className={`flex items-start p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#D4AF37] bg-[#1E1A11]'
                      : 'border-[#242424] bg-[#161616] hover:border-[#333333]'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-0.5 text-[#D4AF37] focus:ring-0"
                  />
                  <div className="ml-3 flex-1">
                    <span className="font-semibold text-white">Direct Bank Wire / Online Transfer (Meezan Bank)</span>
                    <p className="text-gray-400 mt-1">
                      Bank: Meezan Bank Ltd • Clifton Branch Karachi • Title: Zikala Watches (Pvt) Ltd • IBAN: PK36MEZN0001234567890123.
                    </p>
                  </div>
                </label>
              </div>

              {/* Transaction Reference Input if Digital */}
              {paymentMethod !== 'cod' && (
                <div className="p-4 bg-[#181818] rounded-xl border border-[#2B2B2B] space-y-2 text-xs">
                  <label className="block text-gray-200 font-semibold">
                    Transaction ID / Reference Number / Sender Mobile *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. TID 9876543210 or 0300-XXXXXXX"
                    className="w-full bg-[#121212] border border-[#333333] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                  <p className="text-[11px] text-gray-400">
                    Our accounts department will verify this reference code before releasing dispatch.
                  </p>
                </div>
              )}
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full gold-button py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center justify-center shadow-xl disabled:opacity-50"
            >
              <Lock className="w-4 h-4 mr-2" />
              {isSubmitting
                ? 'Securing Your Timepiece...'
                : `Place Order (PKR ${total.toLocaleString('en-PK')})`}
            </button>
          </form>
        </div>

        {/* Right column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#121212] border border-[#242424] rounded-2xl p-6 space-y-6 sticky top-28">
            <h2 className="text-base font-serif font-bold text-white border-b border-[#202020] pb-3">
              Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h2>

            {/* List of items */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor}`}
                  className="flex items-center space-x-3 text-xs"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-lg object-cover bg-black flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-white truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-gray-400 text-[11px]">
                      {item.selectedColor} • Qty: {item.quantity}
                    </p>
                    <p className="text-[#D4AF37] font-semibold">
                      PKR {((item.product.discountPrice || item.product.price) * item.quantity).toLocaleString('en-PK')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="pt-4 border-t border-[#202020] space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">PKR {subtotal.toLocaleString('en-PK')}</span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Nationwide Shipping</span>
                <span className="text-white">
                  {shippingCharges === 0 ? (
                    <span className="text-emerald-400 uppercase font-semibold">Free Express</span>
                  ) : (
                    `PKR ${shippingCharges.toLocaleString('en-PK')}`
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>VIP Discount ({couponCode})</span>
                  <span>- PKR {discount.toLocaleString('en-PK')}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#222222] flex justify-between items-baseline">
                <span className="text-sm font-serif font-bold text-white">Total Amount</span>
                <span className="text-lg sm:text-xl font-serif font-bold text-[#D4AF37]">
                  PKR {total.toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-[#1F1F1F] space-y-2 text-[11px] text-gray-400">
              <p className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] mr-2 flex-shrink-0" />
                2 to 5 Years Official Zikala Warranty Included
              </p>
              <p className="flex items-center">
                <Truck className="w-3.5 h-3.5 text-[#D4AF37] mr-2 flex-shrink-0" />
                Insured TCS Express Delivery across all cities in Pakistan
              </p>
              <p className="flex items-center">
                <Check className="w-3.5 h-3.5 text-emerald-400 mr-2 flex-shrink-0" />
                7-Day Inspection Guarantee & Easy Exchange
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
