/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { ProductGridSection } from './components/ProductGridSection';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { WholesaleModal } from './components/WholesaleModal';
import { StaticPages } from './components/StaticPages';
import { Footer } from './components/Footer';
import { LogoIntro } from './components/LogoIntro';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CustomerOrders } from './components/orders/CustomerOrders';
import { OrderTrackingPage } from './components/orders/OrderTrackingPage';
import { PaymentDetailsModal } from './components/orders/PaymentDetailsModal';

import { PRODUCTS } from './data/products';
import { Product, CartItem, OrderDetails, ActiveTab, PageView, AdminUser } from './types';
import { Check } from 'lucide-react';

export default function App() {
  // Brand Logo Intro Animation State
  const [showLogoIntro, setShowLogoIntro] = useState(true);

  // Navigation & Page State
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [currentPage, setCurrentPage] = useState<PageView>('shop');
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string>('RG-1042');
  const [receiptModalOrder, setReceiptModalOrder] = useState<OrderDetails | null>(null);

  // Interactive Modals / Drawers State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWholesaleOpen, setIsWholesaleOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColorForModal, setSelectedColorForModal] = useState<string | undefined>(undefined);

  // Cart bounce animation state
  const [cartBounce, setCartBounce] = useState(false);

  // Cart & Wishlist State (with localStorage persistence)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('raghav_garments_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('raghav_garments_wishlist');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => {
    return localStorage.getItem('raghav_garments_promo');
  });

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('raghav_garments_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [recentOrders, setRecentOrders] = useState<OrderDetails[]>(() => {
    try {
      const saved = localStorage.getItem('raghav_garments_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin Authentication State (session-backed)
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('raghav_admin_token');
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = sessionStorage.getItem('raghav_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Dynamic Live Products synced from server
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);

  const fetchLiveProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProductsList(data);
        }
      }
    } catch (err) {
      console.warn('Could not fetch products from server, using default:', err);
    }
  };

  // Verify admin session and fetch products on mount
  useEffect(() => {
    fetchLiveProducts();

    if (adminToken) {
      fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${adminToken}` }
      })
        .then((r) => r.json())
        .then((data) => {
          if (!data.valid) {
            sessionStorage.removeItem('raghav_admin_token');
            sessionStorage.removeItem('raghav_admin_user');
            setAdminToken(null);
            setAdminUser(null);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const triggerCartBounce = () => {
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 500);
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('raghav_garments_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('raghav_garments_wishlist', JSON.stringify(Array.from(wishlistIds)));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem('raghav_garments_promo', appliedPromo);
      } else {
        localStorage.removeItem('raghav_garments_promo');
      }
    } catch (e) {
      console.error(e);
    }
  }, [appliedPromo]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('raghav_garments_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('raghav_garments_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('raghav_garments_orders', JSON.stringify(recentOrders));
    } catch (e) {
      console.error(e);
    }
  }, [recentOrders]);

  // Scroll reveal observer for homepage sections & elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const elements = document.querySelectorAll('.reveal-init');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [currentPage, activeTab]);

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color: string, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.toLowerCase() === color.toLowerCase()
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, selectedSize: size, selectedColor: color, quantity }];
      }
    });

    triggerCartBounce();
    showToast(`Added ${product.name} (${color}) to cart`);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
    } else {
      setCart((prev) => {
        const next = [...prev];
        next[index].quantity = newQty;
        return next;
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from cart');
  };

  const handleApplyPromo = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'RGARMENTS14' || normalized === 'RAGHAV10') {
      setAppliedPromo(normalized);
      showToast('10% Festive Discount applied!');
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    showToast('Promo code removed');
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        showToast(`Removed from wishlist`);
      } else {
        next.add(product.id);
        showToast(`Saved to wishlist`);
      }
      return next;
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  };

  // Open Details Modal with Preselected Color
  const handleOpenProductDetails = (product: Product, preselectedColor?: string) => {
    setSelectedColorForModal(preselectedColor);
    setSelectedProduct(product);
  };

  // Buy Now flow
  const handleBuyNow = (product: Product, size: string, color: string, quantity = 1) => {
    handleAddToCart(product, size, color, quantity);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (order: OrderDetails) => {
    setRecentOrders((prev) => [order, ...prev]);
    showToast(`Order #${order.orderId} placed successfully!`);
    // Sync order with backend database
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    }).catch((err) => {
      console.warn('Could not sync order to backend:', err);
    });
  };

  // Scroll to catalog section helper
  const scrollToCatalog = () => {
    setCurrentPage('shop');
    const el = document.getElementById('products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Total cart items count
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filtered wishlist products
  const wishlistProducts = productsList.filter((p) => wishlistIds.has(p.id));

  // Render Admin Login page
  if (currentPage === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={(token, user) => {
          setAdminToken(token);
          setAdminUser(user);
          setCurrentPage('admin-dashboard');
          showToast(`Welcome, ${user.name}!`);
        }}
        onBackToStore={() => {
          setCurrentPage('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // Render Admin Dashboard
  if (currentPage === 'admin-dashboard') {
    if (!adminToken || !adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={(token, user) => {
            setAdminToken(token);
            setAdminUser(user);
            setCurrentPage('admin-dashboard');
            showToast(`Welcome, ${user.name}!`);
          }}
          onBackToStore={() => {
            setCurrentPage('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      );
    }

    return (
      <AdminDashboard
        token={adminToken}
        adminUser={adminUser}
        onLogout={async () => {
          try {
            await fetch('/api/admin/logout', {
              method: 'POST',
              headers: { Authorization: `Bearer ${adminToken}` }
            });
          } catch {}
          sessionStorage.removeItem('raghav_admin_token');
          sessionStorage.removeItem('raghav_admin_user');
          setAdminToken(null);
          setAdminUser(null);
          setCurrentPage('shop');
          showToast('Admin logged out successfully');
        }}
        onNavigateToStore={() => {
          setCurrentPage('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onProductsUpdated={() => {
          fetchLiveProducts();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#1455D9] selection:text-white">
      
      {/* Animated Brand Logo Introduction on initial visit */}
      {showLogoIntro && (
        <LogoIntro onDismiss={() => setShowLogoIntro(false)} />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#080B12] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-white/10 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Announcement Bar & 2. Brand Logo and Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          scrollToCatalog();
        }}
        currentPage={currentPage}
        onNavigatePage={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartTotalCount}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        cartBounce={cartBounce}
        onOpenWholesale={() => setIsWholesaleOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'shop' ? (
          <>
            {/* 3. Main Fashion Hero Banner */}
            <Hero
              onShopNow={scrollToCatalog}
              onExploreCollection={(tab) => {
                setActiveTab(tab);
                scrollToCatalog();
              }}
              onOpenWholesale={() => setIsWholesaleOpen(true)}
            />

            {/* 4. Four Shopping Categories with Scroll Reveal */}
            <div className="reveal-init">
              <CategoriesSection
                onSelectCategory={(cat) => {
                  setActiveTab(cat);
                  scrollToCatalog();
                }}
              />
            </div>

            {/* 5. New Arrivals, 6. Best Sellers, 7. Product Listings with Scroll Reveal */}
            <div className="reveal-init">
              <ProductGridSection
                products={productsList}
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                onOpenDetails={handleOpenProductDetails}
                onAddToCart={handleAddToCart}
                wishlistIds={wishlistIds}
                onToggleWishlist={handleToggleWishlist}
              />
            </div>

            {/* Wholesale Direct Callout Banner */}
            <div className="bg-[#080B12] text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                    B2B Wholesale & Bulk Supply
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-heading mt-1">
                    SUPPLYING PREMIUM MENSWEAR TO 500+ RETAILERS
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                    Direct manufacturer billing, MOQ 10 pieces with custom size ratios, GST tax credit, and dedicated freight transit across India.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsWholesaleOpen(true)}
                    className="bg-[#1455D9] hover:bg-[#0F42A8] text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/40 cursor-pointer"
                  >
                    Request Wholesale Catalog
                  </button>
                  <button
                    onClick={() => window.open('https://wa.me/919871234567?text=Hello%20Raghav%20Garments,%20I%20am%20interested%20in%20wholesale%20clothing%20catalog', '_blank')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    WhatsApp B2B
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : currentPage === 'orders' ? (
          /* Customer Order History Section */
          <CustomerOrders
            currentUser={currentUser}
            onBackToShop={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onTrackOrder={(orderId) => {
              setSelectedTrackingOrderId(orderId);
              setCurrentPage('order-tracking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenReceipt={(order) => setReceiptModalOrder(order)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        ) : currentPage === 'order-tracking' ? (
          /* Visual Order Tracking System with 7 Sequential Stages */
          <OrderTrackingPage
            initialOrderId={selectedTrackingOrderId}
            onBackToShop={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToMyOrders={() => {
              setCurrentPage('orders');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenReceipt={(order) => setReceiptModalOrder(order)}
          />
        ) : (
          /* 11. About Us & 12. Contact Us */
          <StaticPages
            page={currentPage}
            onBackToShop={() => {
              setCurrentPage('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* 13. Simple, Professional Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setCurrentPage('shop');
          setActiveTab(cat);
          scrollToCatalog();
        }}
        onNavigatePage={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onReplayIntro={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setShowLogoIntro(true);
        }}
      />

      {/* --- DRAWERS & MODALS (Strictly functional e-commerce components) --- */}
      
      {/* 8. Product Details Modal (PDP) */}
      <ProductDetailsModal
        product={selectedProduct}
        preselectedColor={selectedColorForModal}
        onClose={() => {
          setSelectedProduct(null);
          setSelectedColorForModal(undefined);
        }}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={selectedProduct ? wishlistIds.has(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* 9. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={(product, size, color) => {
          handleAddToCart(product, size, color);
          setIsCartOpen(true);
        }}
        onOpenProductDetails={(product) => handleOpenProductDetails(product)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={productsList}
        onOpenProductDetails={(product) => handleOpenProductDetails(product)}
      />

      {/* Account Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.name}!`);
        }}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Logged out successfully');
        }}
        onNavigateOrders={() => {
          setCurrentPage('orders');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateTracking={() => {
          setCurrentPage('order-tracking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 10. Checkout & Order Confirmation Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        appliedPromo={appliedPromo}
        onClearCart={() => setCart([])}
        onOrderPlaced={handleOrderPlaced}
        onTrackOrder={(orderId) => {
          setSelectedTrackingOrderId(orderId);
          setCurrentPage('order-tracking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onViewReceipt={(order) => setReceiptModalOrder(order)}
      />

      {/* Dedicated Itemized Tax Invoice & Receipt Modal */}
      <PaymentDetailsModal
        isOpen={!!receiptModalOrder}
        order={receiptModalOrder}
        onClose={() => setReceiptModalOrder(null)}
        onOpenTracking={(orderId) => {
          setSelectedTrackingOrderId(orderId);
          setCurrentPage('order-tracking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Wholesale & B2B Inquiry Modal */}
      <WholesaleModal
        isOpen={isWholesaleOpen}
        onClose={() => setIsWholesaleOpen(false)}
        showToast={showToast}
      />

    </div>
  );
}
