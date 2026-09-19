import React, { useEffect, useState } from 'react';
import { CartDrawer } from './components/CartDrawer.tsx';
import { Footer } from './components/Footer.tsx';
import { Navbar } from './components/Navbar.tsx';
import { QuickSearchModal } from './components/QuickSearchModal.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { ProductsProvider } from './context/ProductsContext.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { ForgotPasswordPage, LoginPage, RegisterPage } from './pages/AuthPages.tsx';
import { BlogPage } from './pages/BlogPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CategoryPage } from './pages/CategoryPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { PrivacyPolicyPage, ReturnPolicyPage, TermsPage } from './pages/LegalPages.tsx';
import { OrderTrackingPage } from './pages/OrderTrackingPage.tsx';
import { ProductDetailsPage } from './pages/ProductDetailsPage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { UserDashboardPage } from './pages/UserDashboardPage.tsx';
import { WishlistPage } from './pages/WishlistPage.tsx';

function MainApp() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('zik-01');
  const [activeTrackingId, setActiveTrackingId] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Hash-based routing synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      const [path, queryString] = hash.split('?');
      if (queryString) {
        const params = new URLSearchParams(queryString);
        const id = params.get('id');
        const tracking = params.get('tracking');
        if (id) setSelectedProductId(id);
        if (tracking) setActiveTrackingId(tracking);
      }
      setCurrentPage(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash) {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string, params?: { id?: string; trackingId?: string }) => {
    let hash = page;
    if (params?.id) {
      setSelectedProductId(params.id);
      hash += `?id=${params.id}`;
    }
    if (params?.trackingId) {
      setActiveTrackingId(params.trackingId);
      hash += `?tracking=${params.trackingId}`;
    }
    window.location.hash = hash;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId: string) => {
    navigateTo('product-details', { id: productId });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B] text-gray-100 selection:bg-[#D4AF37] selection:text-black">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onNavigate={navigateTo} onSelectProduct={handleSelectProduct} />
        )}

        {currentPage === 'shop' && (
          <ShopPage onSelectProduct={handleSelectProduct} />
        )}

        {currentPage === 'category-mens' && (
          <CategoryPage
            category="Mens"
            title="Men's Watch Collection"
            subtitle="Distinguished chronographs, executive dress watches, and robust diver architectures crafted in 316L steel."
            heroImage="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2000&q=85"
            onNavigate={navigateTo}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'category-womens' && (
          <CategoryPage
            category="Womens"
            title="Women's Watch Collection"
            subtitle="Petite silhouettes, iridescent natural mother-of-pearl dials, and diamond-cut bezel accents."
            heroImage="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=2000&q=85"
            onNavigate={navigateTo}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'category-automatic' && (
          <CategoryPage
            category="Automatic"
            title="Automatic Mechanical Horology"
            subtitle="Self-winding calibres powered by your natural wrist motion, exhibition casebacks, and 21,600 vph escapements."
            heroImage="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=2000&q=85"
            onNavigate={navigateTo}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'category-chronograph' && (
          <CategoryPage
            category="Chronograph"
            title="Precision Chronographs"
            subtitle="Dual-subdial stopwatch precision engineered for racing, timing, and bold wrist presence."
            heroImage="https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=2000&q=85"
            onNavigate={navigateTo}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'category-luxury' && (
          <CategoryPage
            category="Luxury"
            title="Luxury & Tourbillon Haute Horlogerie"
            subtitle="Our crowning artisanal masterpieces, open-worked skeleton apertures, and 18K gold electro-plating."
            heroImage="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&w=2000&q=85"
            onNavigate={navigateTo}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'product-details' && (
          <ProductDetailsPage
            productId={selectedProductId}
            onNavigate={navigateTo}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage onNavigate={navigateTo} onSelectProduct={handleSelectProduct} />
        )}

        {currentPage === 'checkout' && <CheckoutPage onNavigate={navigateTo} />}

        {currentPage === 'order-tracking' && (
          <OrderTrackingPage
            initialTrackingId={activeTrackingId}
            onNavigate={navigateTo}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'wishlist' && (
          <WishlistPage onNavigate={navigateTo} onSelectProduct={handleSelectProduct} />
        )}

        {currentPage === 'user-dashboard' && (
          <UserDashboardPage onNavigate={navigateTo} onSelectProduct={handleSelectProduct} />
        )}

        {currentPage === 'login' && <LoginPage onNavigate={navigateTo} />}
        {currentPage === 'register' && <RegisterPage onNavigate={navigateTo} />}
        {currentPage === 'forgot-password' && <ForgotPasswordPage onNavigate={navigateTo} />}

        {currentPage === 'admin' && (
          <AdminDashboardPage onNavigate={navigateTo} onSelectProduct={handleSelectProduct} />
        )}

        {currentPage === 'about' && <AboutPage onNavigate={navigateTo} />}
        {currentPage === 'contact' && <ContactPage onNavigate={navigateTo} />}
        {currentPage === 'blog' && <BlogPage onNavigate={navigateTo} />}

        {currentPage === 'privacy-policy' && <PrivacyPolicyPage onNavigate={navigateTo} />}
        {currentPage === 'terms' && <TermsPage onNavigate={navigateTo} />}
        {currentPage === 'return-policy' && <ReturnPolicyPage onNavigate={navigateTo} />}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Interactive Global Slide-in Cart Drawer */}
      <CartDrawer
        onCheckout={() => navigateTo('checkout')}
        onNavigateShop={() => navigateTo('shop')}
      />

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
