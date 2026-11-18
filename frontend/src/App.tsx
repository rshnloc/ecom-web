import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrdersPage } from './pages/OrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

import { Product, Order } from './types';

export const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const navigate = (page: string, data?: any) => {
    if (page === 'product-detail' && data) {
      setSelectedProduct(data);
    } else if (page === 'shop') {
      setSelectedCategory(data?.category);
    } else if (page === 'order-success' && data) {
      setConfirmedOrder(data);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar onNavigate={navigate} currentPage={currentPage} />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'shop' && (
          <ShopPage
            initialCategory={selectedCategory}
            onNavigate={navigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onNavigate={navigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onOrderSuccess={(order) => navigate('order-success', order)}
            onNavigate={navigate}
          />
        )}

        {currentPage === 'order-success' && confirmedOrder && (
          <OrderSuccessPage order={confirmedOrder} onNavigate={navigate} />
        )}

        {currentPage === 'orders' && <OrdersPage onNavigate={navigate} />}

        {currentPage === 'wishlist' && (
          <WishlistPage
            onNavigate={navigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentPage === 'admin' && <AdminDashboardPage onNavigate={navigate} />}
      </main>

      <Footer />

      {/* Slide-over cart drawer */}
      <CartDrawer
        onProceedToCheckout={() => navigate('checkout')}
        onViewProduct={async (id) => {
          // Find or fetch product and navigate to product detail
          try {
            const res = await fetch(`/api/products/${id}`);
            if (res.ok) {
              const p = await res.json();
              navigate('product-detail', p);
            }
          } catch (e) {
            navigate('shop');
          }
        }}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewDetails={(prod) => {
          setQuickViewProduct(null);
          navigate('product-detail', prod);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppContent />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
