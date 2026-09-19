import React, { useEffect, useState } from 'react';
import {
  Clock,
  ExternalLink,
  Heart,
  LogOut,
  MapPin,
  Package,
  Phone,
  Plus,
  ShieldCheck,
  Truck,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { ALL_PAKISTANI_CITIES, PAKISTAN_PROVINCES } from '../data/pakistan.ts';
import { api } from '../services/api.ts';
import { Address, Order } from '../types.ts';

interface UserDashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectProduct: (id: string) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  onNavigate,
  onSelectProduct,
}) => {
  const { user, logout, updateProfile } = useAuth();
  const { wishlist } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Address modal
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrFullName, setAddrFullName] = useState(user?.name || '');
  const [addrPhone, setAddrPhone] = useState(user?.phone || '');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('Karachi');
  const [addrProvince, setAddrProvince] = useState('Sindh');
  const [addrPostal, setAddrPostal] = useState('');

  // Profile edit
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      onNavigate('login');
      return;
    }

    const fetchUserOrders = async () => {
      setIsLoadingOrders(true);
      try {
        const data = await api.getOrders(user.email);
        setOrders(data);
      } catch (e) {
        console.warn('Orders fetch error', e);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchUserOrders();
  }, [user]);

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name: editName, phone: editPhone });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      fullName: addrFullName,
      phone: addrPhone,
      address: addrStreet,
      city: addrCity,
      province: addrProvince,
      postalCode: addrPostal,
      isDefault: (user.addresses || []).length === 0,
    };
    const updated = [...(user.addresses || []), newAddress];
    await updateProfile({ addresses: updated });
    setShowAddressModal(false);
    setAddrStreet('');
  };

  const handleDeleteAddress = async (addrId: string) => {
    const updated = (user.addresses || []).filter((a) => a.id !== addrId);
    await updateProfile({ addresses: updated });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#131313] border border-[#242424] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-[#1F1F1F] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] font-serif text-xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {user.name}
              </h1>
              <span className="text-[10px] uppercase tracking-wider bg-[#221B0C] text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded font-semibold">
                Privileged Patron
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {user.email} • {user.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('wishlist')}
            className="px-4 py-2 rounded-lg bg-[#1C1C1C] border border-[#2E2E2E] text-xs text-gray-300 hover:text-white flex items-center"
          >
            <Heart className="w-3.5 h-3.5 mr-1.5 text-[#D4AF37]" /> Wishlist ({wishlist.length})
          </button>
          <button
            onClick={() => {
              logout();
              onNavigate('home');
            }}
            className="px-4 py-2 rounded-lg bg-[#1C1C1C] hover:bg-red-950/40 border border-[#2E2E2E] hover:border-red-800/40 text-xs text-gray-300 hover:text-red-300 flex items-center transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#222222] space-x-8 text-sm">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 font-serif font-semibold transition-colors flex items-center ${
            activeTab === 'orders'
              ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4 mr-2" /> Order History ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 font-serif font-semibold transition-colors flex items-center ${
            activeTab === 'addresses'
              ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4 mr-2" /> Delivery Addresses ({(user.addresses || []).length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 font-serif font-semibold transition-colors flex items-center ${
            activeTab === 'profile'
              ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4 mr-2" /> Account Settings
        </button>
      </div>

      {/* Content */}
      <div>
        {/* ==========================================
            ORDERS TAB
            ========================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {isLoadingOrders ? (
              <div className="py-12 text-center text-xs text-gray-500">
                Loading your horology portfolio...
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center bg-[#111111] border border-[#222222] rounded-2xl p-6">
                <Package className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <h3 className="text-base font-serif font-bold text-white mb-1">
                  No Orders Placed Yet
                </h3>
                <p className="text-xs text-gray-400 mb-6">
                  Browse our catalog and commission your first Zikala timepiece.
                </p>
                <button
                  onClick={() => onNavigate('shop')}
                  className="gold-button px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  Explore Watches
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#121212] border border-[#222222] hover:border-[#2D2D2D] transition-colors space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E1E1E] gap-2">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                        Order Reference
                      </span>
                      <span className="text-base font-serif font-bold text-[#D4AF37]">
                        {order.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                        Placed On
                      </span>
                      <span className="text-xs text-gray-300">{order.createdAt}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                        Total Amount
                      </span>
                      <span className="text-sm font-bold text-white">
                        PKR {order.total.toLocaleString('en-PK')}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold inline-block ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : order.orderStatus === 'Dispatched'
                            ? 'bg-blue-950/60 text-blue-400 border border-blue-800/40'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <button
                      onClick={() => onNavigate('order-tracking', { trackingId: order.id })}
                      className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] hover:border-[#D4AF37] text-white text-xs rounded-lg font-medium flex items-center transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5 mr-1 text-[#D4AF37]" /> Track Live
                    </button>
                  </div>

                  {/* Order Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-2.5 rounded-xl bg-[#171717] border border-[#252525]"
                      >
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-12 h-12 rounded-lg object-cover bg-black cursor-pointer"
                          onClick={() => onSelectProduct(item.productId)}
                        />
                        <div className="flex-1 min-w-0">
                          <h4
                            onClick={() => onSelectProduct(item.productId)}
                            className="text-xs font-serif font-bold text-white truncate hover:text-[#D4AF37] cursor-pointer"
                          >
                            {item.productName}
                          </h4>
                          <p className="text-[10px] text-gray-400">
                            Finish: {item.color} • Qty: {item.quantity}
                          </p>
                          <p className="text-[11px] font-semibold text-[#D4AF37]">
                            PKR {(item.price * item.quantity).toLocaleString('en-PK')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-gray-500 pt-2 flex items-center justify-between border-t border-[#1C1C1C]">
                    <span>
                      Courier: <strong>TCS Vault Express ({order.trackingNumber})</strong>
                    </span>
                    <span className="uppercase">Payment: {order.paymentMethod} ({order.paymentStatus})</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ==========================================
            ADDRESSES TAB
            ========================================== */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400">
                Manage your saved delivery destinations in Pakistan for rapid checkout.
              </p>
              <button
                onClick={() => setShowAddressModal(true)}
                className="gold-button px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add New Address
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(user.addresses || []).map((addr) => (
                <div
                  key={addr.id}
                  className="p-5 rounded-2xl bg-[#121212] border border-[#222222] flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-serif">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded font-semibold">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{addr.address}</p>
                    <p className="text-xs text-[#D4AF37]">
                      {addr.city}, {addr.province} {addr.postalCode && `(${addr.postalCode})`}
                    </p>
                    <p className="text-[11px] text-gray-400">Phone: {addr.phone}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#1F1F1F] flex justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-[11px] text-gray-500 hover:text-red-400 underline"
                    >
                      Delete Address
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            PROFILE TAB
            ========================================== */}
        {activeTab === 'profile' && (
          <div className="max-w-md bg-[#121212] border border-[#222222] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-serif font-bold text-white">Profile Information</h3>

            {profileSuccess && (
              <p className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded">
                Profile changes saved successfully!
              </p>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2B2B2B] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-[#181818] border border-[#2B2B2B] p-2.5 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Pakistani Mobile Phone</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2B2B2B] p-2.5 rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="gold-button w-full py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs"
              >
                Update Profile
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddressModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative bg-[#141414] border border-[#2E2E2E] rounded-2xl p-6 max-w-md w-full shadow-2xl z-10 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
              <h3 className="text-base font-serif font-bold text-white">Add Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="block text-gray-300 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={addrFullName}
                  onChange={(e) => setAddrFullName(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  placeholder="House #, Street name, Sector / Phase"
                  className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-300 mb-1">City</label>
                  <select
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                  >
                    {ALL_PAKISTANI_CITIES.map((c: string) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Province</label>
                  <select
                    value={addrProvince}
                    onChange={(e) => setAddrProvince(e.target.value)}
                    className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                  >
                    {PAKISTAN_PROVINCES.map((pr) => (
                      <option key={pr.province} value={pr.province}>
                        {pr.province}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Postal Code</label>
                <input
                  type="text"
                  value={addrPostal}
                  onChange={(e) => setAddrPostal(e.target.value)}
                  placeholder="e.g. 75500"
                  className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full gold-button py-2.5 rounded font-bold uppercase tracking-wider text-xs mt-2"
              >
                Save Delivery Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
