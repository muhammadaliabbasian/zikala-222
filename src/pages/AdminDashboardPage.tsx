import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Building,
  CheckCircle2,
  DollarSign,
  Edit2,
  Eye,
  Package,
  Plus,
  Save,
  Search,
  Settings,
  ShoppingBag,
  Trash2,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useProducts } from '../context/ProductsContext.tsx';
import { api } from '../services/api.ts';
import { Order, OrderStatus, PaymentStatus, Product, ProductCategory, StoreSettings } from '../types.ts';

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
  onSelectProduct: (id: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
  onSelectProduct,
}) => {
  const { user, isAdmin, loginAsAdmin } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search in tables
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Product modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('Mens');
  const [prodPrice, setProdPrice] = useState(35000);
  const [prodDiscountPrice, setProdDiscountPrice] = useState<number | undefined>(undefined);
  const [prodQuantity, setProdQuantity] = useState(10);
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodMovement, setProdMovement] = useState('Automatic Miyota 8215');

  // Settings form
  const [shippingFee, setShippingFee] = useState(450);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(25000);
  const [easypaisaTitle, setEasypaisaTitle] = useState('');
  const [easypaisaNumber, setEasypaisaNumber] = useState('');
  const [jazzcashTitle, setJazzcashTitle] = useState('');
  const [jazzcashNumber, setJazzcashNumber] = useState('');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ordersData, settingsData] = await Promise.all([
        api.getOrders(),
        api.getSettings(),
      ]);
      setOrders(ordersData);
      setSettings(settingsData);
      if (settingsData) {
        setShippingFee(settingsData.shippingFee);
        setFreeShippingThreshold(settingsData.freeShippingThreshold);
        setEasypaisaTitle(settingsData.easypaisaAccount.title);
        setEasypaisaNumber(settingsData.easypaisaAccount.number);
        setJazzcashTitle(settingsData.jazzcashAccount.title);
        setJazzcashNumber(settingsData.jazzcashAccount.number);
      }
    } catch (e) {
      console.warn('Admin load error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Not signed in as admin guard
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-950/40 border border-amber-700/50 flex items-center justify-center text-[#D4AF37] mx-auto">
          <Settings className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">
            Administrator Authentication Required
          </h1>
          <p className="text-xs text-gray-400">
            Access to the Zikala store management suite, customer orders, and catalog pricing requires verified staff credentials.
          </p>
        </div>
        <button
          onClick={async () => {
            await loginAsAdmin();
            loadData();
          }}
          className="gold-button w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg"
        >
          Sign In as Store Administrator (admin@zikala.com)
        </button>
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockProducts = products.filter((p) => p.quantity <= 3);

  // Filter products
  const displayedProducts = products.filter((p) => {
    const q = productSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  // Filter orders
  const displayedOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer?.fullName?.toLowerCase().includes(q) ||
      o.customer?.phone?.toLowerCase().includes(q) ||
      o.customer?.city?.toLowerCase().includes(q)
    );
  });

  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('Mens');
    setProdPrice(35000);
    setProdDiscountPrice(undefined);
    setProdQuantity(10);
    setProdShortDesc('Luxury precision timepiece crafted with surgical stainless steel and sapphire.');
    setProdDesc('Engineered with meticulous attention to horological detail.');
    setProdImage('https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80');
    setProdMovement('Precision Japanese Automatic');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdPrice(prod.price);
    setProdDiscountPrice(prod.discountPrice);
    setProdQuantity(prod.quantity);
    setProdShortDesc(prod.shortDescription);
    setProdDesc(prod.description);
    setProdImage(prod.images[0]);
    setProdMovement(prod.specifications.movement);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      await updateProduct(editingProductId, {
        name: prodName,
        category: prodCategory,
        price: Number(prodPrice),
        discountPrice: prodDiscountPrice ? Number(prodDiscountPrice) : undefined,
        quantity: Number(prodQuantity),
        stockStatus: Number(prodQuantity) > 0 ? 'In Stock' : 'Out of Stock',
        shortDescription: prodShortDesc,
        description: prodDesc,
        images: [prodImage],
        specifications: {
          caseDiameter: '41 mm',
          caseThickness: '11 mm',
          glass: 'Scratch-Proof Sapphire Crystal',
          movement: prodMovement,
          waterResistance: '50m (5 ATM)',
          strapMaterial: 'Solid 316L Stainless Steel',
          caseMaterial: '316L Surgical Steel',
          warranty: '2 Years Zikala International Warranty',
        },
      });
    } else {
      await addProduct({
        name: prodName,
        category: prodCategory,
        categoryLabel: `${prodCategory} Watches`,
        price: Number(prodPrice),
        discountPrice: prodDiscountPrice ? Number(prodDiscountPrice) : undefined,
        quantity: Number(prodQuantity),
        stockStatus: Number(prodQuantity) > 0 ? 'In Stock' : 'Out of Stock',
        shortDescription: prodShortDesc,
        description: prodDesc,
        images: [prodImage],
        specifications: {
          caseDiameter: '41 mm',
          caseThickness: '11 mm',
          glass: 'Scratch-Proof Sapphire Crystal',
          movement: prodMovement,
          waterResistance: '50m (5 ATM)',
          strapMaterial: 'Solid 316L Stainless Steel',
          caseMaterial: '316L Surgical Steel',
          warranty: '2 Years Zikala International Warranty',
        },
      });
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete timepiece "${name}"?`)) {
      await deleteProduct(id);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const current = orders.find((o) => o.id === orderId);
      const updated = await api.updateOrderStatus(orderId, status, current?.paymentStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (e) {
      console.warn('Status update error', e);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, pStatus: PaymentStatus) => {
    try {
      const current = orders.find((o) => o.id === orderId);
      if (!current) return;
      const updated = await api.updateOrderStatus(orderId, current.orderStatus, pStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (e) {
      console.warn('Payment update error', e);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateSettings({
        shippingFee: Number(shippingFee),
        freeShippingThreshold: Number(freeShippingThreshold),
        easypaisaAccount: { title: easypaisaTitle, number: easypaisaNumber },
        jazzcashAccount: { title: jazzcashTitle, number: jazzcashNumber },
      });
      setSettings(updated);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (e) {
      console.warn('Settings save error', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#121212] border border-[#242424] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              Admin Control Suite
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Zikala Store Management
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Logged in as <strong>{user?.name}</strong> ({user?.email})
          </p>
        </div>

        <button
          onClick={handleOpenNewProduct}
          className="gold-button px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center shadow-lg"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add New Watch
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#222222] space-x-8 text-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 font-serif font-semibold transition-colors flex items-center ${
            activeTab === 'overview'
              ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4 mr-1.5" /> Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 font-serif font-semibold transition-colors flex items-center ${
            activeTab === 'products'
              ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4 mr-1.5" /> Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 font-serif font-semibold transition-colors flex items-center ${
            activeTab === 'orders'
              ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4 mr-1.5" /> Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 font-serif font-semibold transition-colors flex items-center ${
            activeTab === 'settings'
              ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 mr-1.5" /> Store Settings
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 4 Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#131313] border border-[#222222] space-y-1">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Total Revenue
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-[#D4AF37]">
                PKR {totalRevenue.toLocaleString('en-PK')}
              </p>
              <span className="text-[11px] text-emerald-400">From {orders.length} orders</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#131313] border border-[#222222] space-y-1">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Active Catalog
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {products.length} Models
              </p>
              <span className="text-[11px] text-gray-400">All 5 horology categories</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#131313] border border-[#222222] space-y-1">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Pending Delivery
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
                {orders.filter((o) => o.orderStatus !== 'Delivered').length}
              </p>
              <span className="text-[11px] text-gray-400">In TCS delivery transit</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#131313] border border-[#222222] space-y-1">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Low Inventory
              </span>
              <p className="text-2xl sm:text-3xl font-serif font-bold text-red-400">
                {lowStockProducts.length}
              </p>
              <span className="text-[11px] text-gray-400">Watches with ≤ 3 units</span>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="p-6 rounded-2xl bg-[#131313] border border-[#222222] space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-serif font-bold text-white">Recent Customer Orders</h2>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-[#D4AF37] hover:underline"
              >
                View All Orders →
              </button>
            </div>

            <div className="divide-y divide-[#202020] overflow-x-auto">
              {orders.slice(0, 5).map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs min-w-[500px]">
                  <div>
                    <span className="font-serif font-bold text-[#D4AF37]">{ord.id}</span>
                    <p className="text-gray-400 text-[11px]">
                      {ord.customer?.fullName} • {ord.customer?.city}
                    </p>
                  </div>
                  <div>
                    <span className="text-white font-semibold">
                      PKR {ord.total.toLocaleString('en-PK')}
                    </span>
                    <p className="text-gray-500 text-[10px] uppercase">{ord.paymentMethod}</p>
                  </div>
                  <div>
                    <span className="bg-[#1D1D1D] px-2 py-0.5 rounded text-[11px] text-gray-300 border border-[#303030]">
                      {ord.orderStatus}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => onNavigate('order-tracking')}
                      className="text-xs text-[#D4AF37] hover:underline"
                    >
                      Track
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS TABLE */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by model, ID, category..."
                className="w-full bg-[#161616] border border-[#282828] pl-9 pr-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <button
              onClick={handleOpenNewProduct}
              className="gold-button px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Watch
            </button>
          </div>

          <div className="bg-[#121212] border border-[#222222] rounded-2xl overflow-hidden overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#171717] border-b border-[#222222] uppercase tracking-wider text-[10px] text-gray-400">
                <tr>
                  <th className="p-3.5">Timepiece</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price (PKR)</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {displayedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#161616] transition-colors">
                    <td className="p-3.5 flex items-center space-x-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover bg-black border border-[#2A2A2A] flex-shrink-0"
                      />
                      <div>
                        <span className="font-serif font-bold text-white block">{prod.name}</span>
                        <span className="text-[10px] text-gray-500">ID: {prod.id}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-[#D4AF37] font-medium">{prod.categoryLabel}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-white">
                        {(prod.discountPrice || prod.price).toLocaleString('en-PK')}
                      </span>
                      {prod.discountPrice && (
                        <span className="text-[10px] text-gray-500 line-through block">
                          {prod.price.toLocaleString('en-PK')}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                          prod.quantity <= 3
                            ? 'bg-red-950/60 text-red-400 border border-red-800/40'
                            : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                        }`}
                      >
                        {prod.quantity} units ({prod.stockStatus})
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => onSelectProduct(prod.id)}
                        className="p-1.5 hover:bg-[#252525] rounded text-gray-400 hover:text-white"
                        title="View on site"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="p-1.5 hover:bg-[#252525] rounded text-gray-400 hover:text-[#D4AF37]"
                        title="Edit watch"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="p-1.5 hover:bg-red-950/40 rounded text-gray-400 hover:text-red-400"
                        title="Delete watch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              placeholder="Search by order ID, customer, city..."
              className="w-full bg-[#161616] border border-[#282828] pl-9 pr-3 py-2 rounded-lg text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="bg-[#121212] border border-[#222222] rounded-2xl overflow-hidden overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#171717] border-b border-[#222222] uppercase tracking-wider text-[10px] text-gray-400">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer & City</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {displayedOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#161616] transition-colors">
                    <td className="p-3.5">
                      <span className="font-serif font-bold text-[#D4AF37] block">{ord.id}</span>
                      <span className="text-[10px] text-gray-500">{ord.createdAt}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-white block">{ord.customer?.fullName}</span>
                      <span className="text-[10px] text-gray-400">
                        {ord.customer?.city} • {ord.customer?.phone}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-gray-300 font-medium">
                        {ord.items.length} {ord.items.length === 1 ? 'watch' : 'watches'}
                      </span>
                      <p className="text-[10px] text-gray-500 truncate max-w-[150px]">
                        {ord.items.map((i) => i.productName).join(', ')}
                      </p>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-white block">
                        PKR {ord.total.toLocaleString('en-PK')}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase">{ord.paymentMethod}</span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={ord.paymentStatus}
                        onChange={(e) =>
                          handleUpdatePaymentStatus(ord.id, e.target.value as PaymentStatus)
                        }
                        className="bg-[#1C1C1C] border border-[#303030] text-[11px] p-1.5 rounded text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="Unpaid (COD)">Unpaid (COD)</option>
                        <option value="Pending Verification">Pending Verification</option>
                        <option value="Verified & Paid">Verified & Paid</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)
                        }
                        className="bg-[#1C1C1C] border border-[#303030] text-[11px] p-1.5 rounded text-[#D4AF37] font-semibold focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: STORE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-[#121212] border border-[#222222] rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-white">
              Pakistan Store Logistics & Financial Accounts
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Configure shipping fees, free delivery qualifications, and merchant mobile wallet numbers.
            </p>
          </div>

          {settingsSaved && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 text-xs flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Store settings saved successfully.
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1">Standard Delivery Fee (PKR)</label>
                <input
                  type="number"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(Number(e.target.value))}
                  className="w-full bg-[#181818] border border-[#2C2C2C] p-2.5 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Free Shipping Threshold (PKR)</label>
                <input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                  className="w-full bg-[#181818] border border-[#2C2C2C] p-2.5 rounded text-white"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#202020] space-y-3">
              <h3 className="font-semibold text-white">Easypaisa Merchant Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Account Title</label>
                  <input
                    type="text"
                    value={easypaisaTitle}
                    onChange={(e) => setEasypaisaTitle(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2C2C2C] p-2.5 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Mobile Account Number</label>
                  <input
                    type="text"
                    value={easypaisaNumber}
                    onChange={(e) => setEasypaisaNumber(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2C2C2C] p-2.5 rounded text-white"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#202020] space-y-3">
              <h3 className="font-semibold text-white">JazzCash Merchant Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Account Title</label>
                  <input
                    type="text"
                    value={jazzcashTitle}
                    onChange={(e) => setJazzcashTitle(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2C2C2C] p-2.5 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">JazzCash Account Number</label>
                  <input
                    type="text"
                    value={jazzcashNumber}
                    onChange={(e) => setJazzcashNumber(e.target.value)}
                    className="w-full bg-[#181818] border border-[#2C2C2C] p-2.5 rounded text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="gold-button px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save Store Configuration
            </button>
          </form>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center overflow-y-auto">
          <div onClick={() => setShowProductModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative bg-[#141414] border border-[#2E2E2E] rounded-2xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#242424]">
              <h3 className="text-base font-serif font-bold text-white">
                {editingProductId ? 'Edit Timepiece' : 'Add New Timepiece'}
              </h3>
              <button onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block text-gray-300 mb-1">Watch Model Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Zikala Royal Skeleton"
                  className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                    className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                  >
                    <option value="Mens">Men's Watches</option>
                    <option value="Womens">Women's Watches</option>
                    <option value="Automatic">Automatic Mechanical</option>
                    <option value="Chronograph">Chronograph</option>
                    <option value="Luxury">Luxury & Tourbillon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">Movement Calibre</label>
                  <input
                    type="text"
                    value={prodMovement}
                    onChange={(e) => setProdMovement(e.target.value)}
                    placeholder="e.g. Automatic NH35A"
                    className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Price in PKR *</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">Discount Price (PKR)</label>
                  <input
                    type="number"
                    value={prodDiscountPrice || ''}
                    onChange={(e) =>
                      setProdDiscountPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="Optional sale price"
                    className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={prodQuantity}
                    onChange={(e) => setProdQuantity(Number(e.target.value))}
                    className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Primary Image URL</label>
                <input
                  type="url"
                  required
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  value={prodShortDesc}
                  onChange={(e) => setProdShortDesc(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  required
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#333333] p-2 rounded text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full gold-button py-2.5 rounded font-bold uppercase tracking-wider text-xs"
              >
                {editingProductId ? 'Update Timepiece' : 'Publish Timepiece'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
