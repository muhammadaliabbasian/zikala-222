import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Package,
  Search,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { api } from '../services/api.ts';
import { Order, OrderStatus } from '../types.ts';

interface OrderTrackingPageProps {
  initialTrackingId?: string;
  onNavigate: (page: string) => void;
  onSelectProduct: (id: string) => void;
}

const ORDER_STEPS: { id: OrderStatus; label: string; desc: string }[] = [
  { id: 'Order Placed', label: 'Order Placed', desc: 'Securely recorded in system' },
  { id: 'Confirmed', label: 'Quality Inspection', desc: 'Atelier movement testing' },
  { id: 'Dispatched', label: 'Dispatched', desc: 'Handed over to TCS Vault Express' },
  { id: 'Out for Delivery', label: 'Out for Delivery', desc: 'With local delivery agent' },
  { id: 'Delivered', label: 'Delivered', desc: 'Handed over to recipient' },
];

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialTrackingId = '',
  onNavigate,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState(initialTrackingId || 'ZIK-94821');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (searchId: string) => {
    if (!searchId.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await api.trackOrder(searchId);
      setOrder(data);
    } catch (err: any) {
      setError(
        `No timepiece order located with reference "${searchId}". Please check your order confirmation SMS or try demo ID "ZIK-94821".`
      );
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialTrackingId) {
      setQuery(initialTrackingId);
      fetchOrder(initialTrackingId);
    } else {
      // Fetch the default demo order
      fetchOrder('ZIK-94821');
    }
  }, [initialTrackingId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(query);
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Order Placed':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Dispatched':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
          Live Logistics Telemetry
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
          Track Your Timepiece Order
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Enter your Zikala Order Reference (e.g. ZIK-94821) or TCS Courier Consignment Number to monitor live fulfillment status.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Order ID (e.g. ZIK-94821) or TCS Tracking..."
            className="w-full bg-[#141414] border border-[#2B2B2B] pl-10 pr-3 py-3 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] shadow-lg"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="gold-button px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg disabled:opacity-50"
        >
          {isLoading ? 'Locating...' : 'Track'}
        </button>
      </form>

      {/* Error display */}
      {error && (
        <div className="max-w-xl mx-auto p-4 bg-red-950/40 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="bg-[#121212] border border-[#242424] rounded-2xl p-6 sm:p-8 space-y-8 shadow-2xl">
          {/* Order Overview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1E1E1E] gap-4">
            <div>
              <span className="text-xs text-gray-500 block">Zikala Reference</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#D4AF37]">
                {order.id}
              </span>
            </div>

            <div>
              <span className="text-xs text-gray-500 block">TCS Consignment</span>
              <span className="text-sm font-semibold text-white flex items-center">
                <Truck className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" /> {order.trackingNumber}
              </span>
            </div>

            <div>
              <span className="text-xs text-gray-500 block">Current Status</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full inline-block">
                {order.orderStatus}
              </span>
            </div>

            <div>
              <span className="text-xs text-gray-500 block">Expected Delivery</span>
              <span className="text-xs sm:text-sm font-medium text-gray-200">
                2 - 4 Business Days
              </span>
            </div>
          </div>

          {/* Stepper (Horizontal on desktop, vertical on mobile) */}
          <div className="py-4">
            <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-0">
              {/* Desktop Progress Line */}
              <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-[#222222] z-0">
                <div
                  className="h-full bg-gradient-to-r from-[#DFBA54] to-[#D4AF37] transition-all duration-700"
                  style={{
                    width: `${(currentStepIdx / (ORDER_STEPS.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {ORDER_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={step.id}
                    className="relative z-10 flex md:flex-col items-center md:text-center space-x-3 md:space-x-0 group"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                          : 'bg-[#1C1C1C] border border-[#333333] text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 font-bold" />
                      ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>

                    <div className="md:mt-3">
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-[#D4AF37]'
                            : isCompleted
                            ? 'text-white'
                            : 'text-gray-500'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-gray-500 max-w-[130px]">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Timeline Events */}
          <div className="pt-6 border-t border-[#1E1E1E]">
            <h3 className="text-sm font-serif font-bold text-white mb-4">
              Real-Time Checkpoint Logs
            </h3>
            <div className="space-y-3">
              {order.timeline.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 text-xs p-3 rounded-xl bg-[#161616] border border-[#242424]"
                >
                  <Clock className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{event.status}</span>
                      <span className="text-[11px] text-gray-500">{event.timestamp}</span>
                    </div>
                    <p className="text-gray-400 text-[11px] mt-0.5">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package Contents & Shipping Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#1E1E1E] text-xs">
            {/* Delivery address */}
            <div className="p-4 rounded-xl bg-[#161616] border border-[#222222] space-y-2">
              <h4 className="font-serif font-bold text-white flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" /> Destination
              </h4>
              <p className="text-gray-300">
                <strong>Recipient:</strong> {order.customer?.fullName}
              </p>
              <p className="text-gray-400">
                <strong>Address:</strong> {order.customer?.address}, {order.customer?.city},{' '}
                {order.customer?.province} {order.customer?.postalCode}
              </p>
              <p className="text-gray-400">
                <strong>Contact:</strong> {order.customer?.phone}
              </p>
            </div>

            {/* Courier & Payment */}
            <div className="p-4 rounded-xl bg-[#161616] border border-[#222222] space-y-2">
              <h4 className="font-serif font-bold text-white flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" /> Verification
              </h4>
              <p className="text-gray-300 uppercase">
                <strong>Payment Method:</strong> {order.paymentMethod} ({order.paymentStatus})
              </p>
              <p className="text-gray-400">
                <strong>Logistics Provider:</strong> TCS Vault Secured Pakistan
              </p>
              <p className="text-gray-400">
                <strong>Total Declared Value:</strong> PKR {order.total.toLocaleString('en-PK')}
              </p>
            </div>
          </div>

          {/* WhatsApp Support CTA */}
          <div className="p-4 rounded-xl bg-[#102014] border border-emerald-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h5 className="font-semibold text-emerald-300">Need immediate dispatch assistance?</h5>
              <p className="text-gray-400 text-[11px]">
                Speak directly with the Zikala Karachi Horology Concierge regarding your parcel.
              </p>
            </div>
            <a
              href={`https://wa.me/923001122334?text=${encodeURIComponent(
                `Hello Zikala Concierge, I am inquiring about Order ID: ${order.id}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            >
              <MessageCircle className="w-4 h-4 mr-1.5" /> WhatsApp Concierge
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
