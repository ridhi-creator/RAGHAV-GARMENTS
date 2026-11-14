/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { ProductGridSection } from './components/ProductGridSection';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { CartPage, WishlistPage, CheckoutPage, AuthPage, WholesalePage } from './components/StorePages';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { WholesaleModal } from './components/WholesaleModal';
import { StaticPages } from './components/StaticPages';
import { FaqAndFeedbackSection } from './components/FaqAndFeedbackSection';
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

interface ParsedRoute {
  page: PageView;
  tab: ActiveTab;
  productId?: string;
  trackingOrderId?: string;
  scrollToCatalog?: boolean;
}

function normalizePathname(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '');
  return clean === '' ? '/' : clean.toLowerCase();
}

function parseRoute(pathname: string): ParsedRoute {
  const normalized = normalizePathname(pathname);

  if (normalized === '/' || normalized === '/home' || normalized === '/shop') {
    return { page: 'shop', tab: 'all' };
  }
  if (normalized === '/products' || normalized === '/all-products' || normalized === '/shop-all') {
    return { page: 'shop', tab: 'all', scrollToCatalog: true };
  }
  if (normalized === '/pajamas' || normalized === '/mens-pajamas' || normalized === '/payjamas') {
    return { page: 'shop', tab: 'pajamas', scrollToCatalog: true };
  }
  if (normalized === '/pants' || normalized === '/mens-pants') {
    return { page: 'shop', tab: 'pants', scrollToCatalog: true };
  }
  if (normalized === '/jackets' || normalized === '/mens-jackets') {
    return { page: 'shop', tab: 'jackets', scrollToCatalog: true };
  }
  if (normalized === '/tracksuits' || normalized === '/track-suits' || normalized === '/mens-tracksuits') {
    return { page: 'shop', tab: 'tracksuits', scrollToCatalog: true };
  }
  if (normalized === '/new-arrivals') {
    return { page: 'shop', tab: 'new-arrivals', scrollToCatalog: true };
  }
  if (normalized === '/sale') {
    return { page: 'shop', tab: 'sale', scrollToCatalog: true };
  }

  // Dynamic Product Details Page: /product/:id or /products/:id
  const productMatch = normalized.match(/^\/products?\/([^/]+)$/);
  if (productMatch) {
    return { page: 'product', tab: 'all', productId: decodeURIComponent(productMatch[1]) };
  }

  // Storefront transactional & account full pages
  if (normalized === '/cart') {
    return { page: 'cart', tab: 'all' };
  }
  if (normalized === '/wishlist') {
    return { page: 'wishlist', tab: 'all' };
  }
  if (normalized === '/checkout') {
    return { page: 'checkout', tab: 'all' };
  }
  if (normalized === '/login' || normalized === '/account') {
    return { page: 'login', tab: 'all' };
  }
  if (normalized === '/signup' || normalized === '/register') {
    return { page: 'signup', tab: 'all' };
  }
  if (normalized === '/wholesale' || normalized === '/b2b') {
    return { page: 'wholesale', tab: 'all' };
  }

  // Customer Order & Tracking pages
  if (normalized === '/orders' || normalized === '/my-orders') {
    return { page: 'orders', tab: 'all' };
  }
  if (normalized === '/order-tracking' || normalized === '/track-order') {
    return { page: 'order-tracking', tab: 'all' };
  }
  const trackMatch = pathname.replace(/\/+$/, '').match(/^\/(?:order-tracking|track-order)\/([^/]+)$/i);
  if (trackMatch) {
    return { page: 'order-tracking', tab: 'all', trackingOrderId: decodeURIComponent(trackMatch[1]).toUpperCase() };
  }

  // Informational & Policy pages
  if (normalized === '/about' || normalized === '/about-us') {
    return { page: 'about', tab: 'all' };
  }
  if (normalized === '/contact' || normalized === '/contact-us') {
    return { page: 'contact', tab: 'all' };
  }
  if (normalized === '/faq' || normalized === '/help') {
    return { page: 'faq', tab: 'all' };
  }
  if (normalized === '/feedback' || normalized === '/customer-feedback' || normalized === '/reviews') {
    return { page: 'feedback', tab: 'all' };
  }
  if (normalized === '/shipping-policy' || normalized === '/shipping') {
    return { page: 'shipping-policy', tab: 'all' };
  }
  if (normalized === '/returns-policy' || normalized === '/returns') {
    return { page: 'returns-policy', tab: 'all' };
  }
  if (normalized === '/size-guide' || normalized === '/sizing') {
    return { page: 'size-guide', tab: 'all' };
  }
  if (normalized === '/privacy-policy' || normalized === '/privacy') {
    return { page: 'privacy-policy', tab: 'all' };
  }
  if (normalized === '/terms-of-service' || normalized === '/terms') {
    return { page: 'terms', tab: 'all' };
  }

  // Admin portal routes
  if (normalized === '/admin' || normalized === '/admin-login') {
    return { page: 'admin-login', tab: 'all' };
  }
  if (normalized === '/admin-dashboard' || normalized === '/admin/dashboard') {
    return { page: 'admin-dashboard', tab: 'all' };
  }

  return { page: 'not-found', tab: 'all' };
}

function getTabPath(tab: ActiveTab): string {
  switch (tab) {
    case 'pajamas':
      return '/pajamas';
    case 'pants':
      return '/pants';
    case 'jackets':
      return '/jackets';
    case 'tracksuits':
      return '/tracksuits';
    case 'new-arrivals':
      return '/new-arrivals';
    case 'sale':
      return '/sale';
    default:
      return '/';
  }
}

function getPagePath(page: PageView, tab: ActiveTab = 'all', productId?: string): string {
  switch (page) {
    case 'product':
      return productId ? `/product/${encodeURIComponent(productId)}` : '/products';
    case 'cart':
      return '/cart';
    case 'wishlist':
      return '/wishlist';
    case 'checkout':
      return '/checkout';
    case 'login':
      return '/login';
    case 'signup':
      return '/signup';
    case 'wholesale':
      return '/wholesale';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'faq':
      return '/faq';
    case 'feedback':
      return '/feedback';
    case 'shipping-policy':
      return '/shipping-policy';
    case 'returns-policy':
      return '/returns-policy';
    case 'size-guide':
      return '/size-guide';
    case 'privacy-policy':
      return '/privacy-policy';
    case 'terms':
      return '/terms-of-service';
    case 'orders':
      return '/orders';
    case 'order-tracking':
      return '/order-tracking';
    case 'admin-login':
      return '/admin-login';
    case 'admin-dashboard':
      return '/admin-dashboard';
    case 'not-found':
      return '/404';
    case 'shop':
    default:
      return getTabPath(tab);
  }
}

export default function App() {
  const initialRoute = parseRoute(typeof window !== 'undefined' ? window.location.pathname : '/');

  const isHomeRoot = normalizePathname(typeof window !== 'undefined' ? window.location.pathname : '/') === '/';
  const [showLogoIntro, setShowLogoIntro] = useState(isHomeRoot);

  // Navigation & Page State initialized from current URL
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialRoute.tab);
  const [isCatalogRoute, setIsCatalogRoute] = useState<boolean>(Boolean(initialRoute.scrollToCatalog));
  const [currentPage, setCurrentPage] = useState<PageView>(initialRoute.page);
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string>(
    initialRoute.trackingOrderId || 'RG-1042'
  );
  const [receiptModalOrder, setReceiptModalOrder] = useState<OrderDetails | null>(null);

  // Full-Page Selected Product State
  const [pageProductId, setPageProductId] = useState<string | undefined>(initialRoute.productId);
  const [pagePreselectedColor, setPagePreselectedColor] = useState<string | undefined>(undefined);

  // Quick View / Drawer Overlays State (never blocks direct page routes)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewColor, setQuickViewColor] = useState<string | undefined>(undefined);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWholesaleOpen, setIsWholesaleOpen] = useState(false);

  const [cartBounce, setCartBounce] = useState(false);

  // Cart & Wishlist State (localStorage persisted)
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

  // Admin Authentication State
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

  const pushPath = useCallback((targetPath: string, replace = false) => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname === targetPath) return;
    if (replace) {
      window.history.replaceState(null, '', targetPath);
    } else {
      window.history.pushState(null, '', targetPath);
    }
  }, []);

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

  useEffect(() => {
    fetchLiveProducts();

    if (initialRoute.scrollToCatalog) {
      setTimeout(() => {
        const el = document.getElementById('products-catalog');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }

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

  // Browser Back / Forward navigation handler (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const next = parseRoute(window.location.pathname);
      setCurrentPage(next.page);
      setActiveTab(next.tab);
      setIsCatalogRoute(Boolean(next.scrollToCatalog));

      if (next.trackingOrderId) {
        setSelectedTrackingOrderId(next.trackingOrderId);
      }

      setPageProductId(next.productId);
      setPagePreselectedColor(undefined);

      setQuickViewProduct(null);
      setIsCartOpen(false);
      setIsWishlistOpen(false);
      setIsAuthOpen(false);
      setIsSearchOpen(false);
      setIsWholesaleOpen(false);

      if (next.scrollToCatalog) {
        setTimeout(() => {
          const el = document.getElementById('products-catalog');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const currentPageProduct = pageProductId
    ? productsList.find((p) => p.id.toLowerCase() === pageProductId.toLowerCase()) || null
    : null;

  // Keep document title synchronized with current view
  useEffect(() => {
    if (quickViewProduct) {
      document.title = `${quickViewProduct.name} | RAGHAV GARMENTS`;
    } else if (currentPage === 'product') {
      document.title = currentPageProduct
        ? `${currentPageProduct.name} | RAGHAV GARMENTS`
        : 'Product Not Found | RAGHAV GARMENTS';
    } else if (currentPage === 'cart') {
      document.title = 'Shopping Cart | RAGHAV GARMENTS';
    } else if (currentPage === 'wishlist') {
      document.title = 'Wishlist | RAGHAV GARMENTS';
    } else if (currentPage === 'checkout') {
      document.title = 'Checkout | RAGHAV GARMENTS';
    } else if (currentPage === 'login') {
      document.title = 'Login | RAGHAV GARMENTS';
    } else if (currentPage === 'signup') {
      document.title = 'Create Account | RAGHAV GARMENTS';
    } else if (currentPage === 'wholesale') {
      document.title = 'B2B Wholesale Portal | RAGHAV GARMENTS';
    } else if (currentPage === 'orders') {
      document.title = 'My Orders | RAGHAV GARMENTS';
    } else if (currentPage === 'order-tracking') {
      document.title = 'Order Tracking | RAGHAV GARMENTS';
    } else if (currentPage === 'about') {
      document.title = 'About Us | RAGHAV GARMENTS';
    } else if (currentPage === 'contact') {
      document.title = 'Contact Us | RAGHAV GARMENTS';
    } else if (currentPage === 'faq') {
      document.title = 'FAQ | RAGHAV GARMENTS';
    } else if (currentPage === 'feedback') {
      document.title = 'Customer Feedback & Reviews | RAGHAV GARMENTS';
    } else if (currentPage === 'shipping-policy') {
      document.title = 'Shipping Policy | RAGHAV GARMENTS';
    } else if (currentPage === 'returns-policy') {
      document.title = 'Returns & Exchange Policy | RAGHAV GARMENTS';
    } else if (currentPage === 'size-guide') {
      document.title = 'Size Guide | RAGHAV GARMENTS';
    } else if (currentPage === 'privacy-policy') {
      document.title = 'Privacy Policy | RAGHAV GARMENTS';
    } else if (currentPage === 'terms') {
      document.title = 'Terms of Service | RAGHAV GARMENTS';
    } else if (currentPage === 'admin-login') {
      document.title = 'Admin Login | RAGHAV GARMENTS';
    } else if (currentPage === 'admin-dashboard') {
      document.title = 'Admin Dashboard | RAGHAV GARMENTS';
    } else if (currentPage === 'not-found') {
      document.title = 'Page Not Found | RAGHAV GARMENTS';
    } else {
      const tabTitle: Record<ActiveTab, string> = {
        all: isCatalogRoute ? 'All Products | RAGHAV GARMENTS' : 'RAGHAV GARMENTS | Style That Defines You',
        pajamas: "Men's Pajamas | RAGHAV GARMENTS",
        pants: "Men's Pants | RAGHAV GARMENTS",
        jackets: "Men's Jackets | RAGHAV GARMENTS",
        tracksuits: "Men's Track Suits | RAGHAV GARMENTS",
        'new-arrivals': 'New Arrivals | RAGHAV GARMENTS',
        sale: 'Festive Sale | RAGHAV GARMENTS'
      };
      document.title = tabTitle[activeTab];
    }
  }, [currentPage, activeTab, isCatalogRoute, currentPageProduct, quickViewProduct]);

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

  // Scroll reveal observer
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
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    const elements = document.querySelectorAll('.reveal-init');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [currentPage, activeTab]);

  // Navigation helpers keeping state + URL history synced
  const closeAllOverlays = () => {
    setQuickViewProduct(null);
    setQuickViewColor(undefined);
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    setIsAuthOpen(false);
    setIsSearchOpen(false);
    setIsWholesaleOpen(false);
  };

  const navigateToPage = (page: PageView, options?: { trackingOrderId?: string; tab?: ActiveTab }) => {
    const nextTab = options?.tab ?? (page === 'shop' ? 'all' : activeTab);
    if (options?.trackingOrderId) {
      setSelectedTrackingOrderId(options.trackingOrderId);
    }
    if (options?.tab || page === 'shop') {
      setActiveTab(nextTab);
    }
    setIsCatalogRoute(false);
    setPageProductId(undefined);
    setPagePreselectedColor(undefined);
    closeAllOverlays();
    setCurrentPage(page);

    if (page === 'order-tracking' && options?.trackingOrderId) {
      pushPath(`/track-order/${encodeURIComponent(options.trackingOrderId)}`);
    } else {
      pushPath(getPagePath(page, nextTab));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    closeAllOverlays();
    setPageProductId(undefined);
    setActiveTab('all');
    setIsCatalogRoute(false);
    setCurrentPage('shop');
    pushPath('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCatalog = (nextTab?: ActiveTab) => {
    const targetTab = nextTab ?? activeTab;
    closeAllOverlays();
    setPageProductId(undefined);
    setCurrentPage('shop');
    setActiveTab(targetTab);
    setIsCatalogRoute(true);
    pushPath(targetTab === 'all' ? '/products' : getTabPath(targetTab));
    setTimeout(() => {
      const el = document.getElementById('products-catalog');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  // Open full Product Details Page (/product/:id)
  const handleOpenProductPage = (product: Product, preselectedColor?: string) => {
    closeAllOverlays();
    setPageProductId(product.id);
    setPagePreselectedColor(preselectedColor);
    setCurrentPage('product');
    pushPath(`/product/${encodeURIComponent(product.id)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Quick View modal overlay
  const handleOpenQuickView = (product: Product, preselectedColor?: string) => {
    setQuickViewColor(preselectedColor);
    setQuickViewProduct(product);
  };

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
        showToast('Removed from wishlist');
      } else {
        next.add(product.id);
        showToast('Saved to wishlist');
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

  // Buy Now flow -> navigates directly to Checkout Page
  const handleBuyNow = (product: Product, size: string, color: string, quantity = 1) => {
    handleAddToCart(product, size, color, quantity);
    navigateToPage('checkout');
  };

  const handleOrderPlaced = (order: OrderDetails) => {
    setRecentOrders((prev) => [order, ...prev]);
    showToast(`Order #${order.orderId} placed successfully!`);
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    }).catch((err) => {
      console.warn('Could not sync order to backend:', err);
    });
  };

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistProducts = productsList.filter((p) => wishlistIds.has(p.id));

  // Render Admin Login page
  if (currentPage === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={(token, user) => {
          setAdminToken(token);
          setAdminUser(user);
          setCurrentPage('admin-dashboard');
          pushPath('/admin-dashboard');
          showToast(`Welcome, ${user.name}!`);
        }}
        onBackToStore={handleGoHome}
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
            pushPath('/admin-dashboard');
            showToast(`Welcome, ${user.name}!`);
          }}
          onBackToStore={handleGoHome}
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
          handleGoHome();
          showToast('Admin logged out successfully');
        }}
        onNavigateToStore={handleGoHome}
        onProductsUpdated={() => {
          fetchLiveProducts();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#1455D9] selection:text-white">
      {showLogoIntro && <LogoIntro onDismiss={() => setShowLogoIntro(false)} />}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#080B12] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-white/10 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        isCatalogRoute={isCatalogRoute}
        onSelectTab={(tab) => scrollToCatalog(tab)}
        onGoHome={handleGoHome}
        currentPage={currentPage}
        onNavigatePage={(page) => navigateToPage(page)}
        cartCount={cartTotalCount}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        cartBounce={cartBounce}
        onOpenWholesale={() => navigateToPage('wholesale')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'shop' ? (
          <>
            <Hero
              onShopNow={() => scrollToCatalog('all')}
              onExploreCollection={(tab) => scrollToCatalog(tab)}
              onOpenWholesale={() => navigateToPage('wholesale')}
            />

            <div className="reveal-init">
              <CategoriesSection onSelectCategory={(cat) => scrollToCatalog(cat)} />
            </div>

            <ProductGridSection
              products={productsList}
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setIsCatalogRoute(tab === 'all' ? true : false);
                pushPath(tab === 'all' ? '/products' : getTabPath(tab));
              }}
              onOpenDetails={handleOpenProductPage}
              onQuickView={handleOpenQuickView}
              onAddToCart={handleAddToCart}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
            />

            <div className="bg-[#080B12] text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                    B2B Wholesale &amp; Bulk Supply
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
                    onClick={() => navigateToPage('wholesale')}
                    className="bg-[#1455D9] hover:bg-[#0F42A8] text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/40 cursor-pointer"
                  >
                    Open Wholesale Portal
                  </button>
                  <button
                    onClick={() =>
                      window.open(
                        'https://wa.me/919871234567?text=Hello%20Raghav%20Garments,%20I%20am%20interested%20in%20wholesale%20clothing%20catalog',
                        '_blank'
                      )
                    }
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    WhatsApp B2B
                  </button>
                </div>
              </div>
            </div>

            <FaqAndFeedbackSection
              mode="both"
              onNavigatePage={(page) => navigateToPage(page)}
              showToast={showToast}
            />
          </>
        ) : currentPage === 'product' ? (
          <ProductDetailsPage
            product={currentPageProduct}
            allProducts={productsList}
            preselectedColor={pagePreselectedColor}
            onBackToCategory={(tab) => scrollToCatalog(tab)}
            onOpenProduct={handleOpenProductPage}
            onQuickView={handleOpenQuickView}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onNavigatePage={(page) => navigateToPage(page)}
          />
        ) : currentPage === 'cart' ? (
          <CartPage
            cart={cart}
            appliedPromo={appliedPromo}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onApplyPromo={handleApplyPromo}
            onRemovePromo={handleRemovePromo}
            onProceedToCheckout={() => navigateToPage('checkout')}
            onBrowseCategory={(tab) => scrollToCatalog(tab)}
            onOpenProduct={handleOpenProductPage}
          />
        ) : currentPage === 'wishlist' ? (
          <WishlistPage
            wishlistProducts={wishlistProducts}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onMoveToCart={(product, size, color) => {
              handleAddToCart(product, size, color);
              navigateToPage('cart');
            }}
            onOpenProduct={handleOpenProductPage}
            onBrowseCategory={(tab) => scrollToCatalog(tab)}
          />
        ) : currentPage === 'checkout' ? (
          <CheckoutPage
            cart={cart}
            appliedPromo={appliedPromo}
            onClearCart={() => setCart([])}
            onOrderPlaced={handleOrderPlaced}
            onTrackOrder={(orderId) => navigateToPage('order-tracking', { trackingOrderId: orderId })}
            onViewReceipt={(order) => setReceiptModalOrder(order)}
            onBackToCart={() => navigateToPage('cart')}
            onBackToShop={() => scrollToCatalog('all')}
          />
        ) : currentPage === 'login' || currentPage === 'signup' ? (
          <AuthPage
            initialMode={currentPage === 'signup' ? 'signup' : 'login'}
            currentUser={currentUser}
            onLogin={(user) => {
              setCurrentUser(user);
              showToast(`Welcome back, ${user.name}!`);
            }}
            onLogout={() => {
              setCurrentUser(null);
              showToast('Logged out successfully');
            }}
            onNavigatePage={(page) => navigateToPage(page)}
            onBackToShop={handleGoHome}
          />
        ) : currentPage === 'wholesale' ? (
          <WholesalePage
            onBackToShop={handleGoHome}
            onBrowseCategory={(tab) => scrollToCatalog(tab)}
            showToast={showToast}
          />
        ) : currentPage === 'orders' ? (
          <CustomerOrders
            currentUser={currentUser}
            onBackToShop={handleGoHome}
            onTrackOrder={(orderId) => navigateToPage('order-tracking', { trackingOrderId: orderId })}
            onOpenReceipt={(order) => setReceiptModalOrder(order)}
            onOpenAuth={() => navigateToPage('login')}
          />
        ) : currentPage === 'order-tracking' ? (
          <OrderTrackingPage
            initialOrderId={selectedTrackingOrderId}
            onBackToShop={handleGoHome}
            onNavigateToMyOrders={() => navigateToPage('orders')}
            onOpenReceipt={(order) => setReceiptModalOrder(order)}
          />
        ) : (
          <StaticPages
            page={currentPage}
            onBackToShop={handleGoHome}
            onNavigatePage={(page) => navigateToPage(page)}
            onBrowseCategory={(tab) => scrollToCatalog(tab)}
            showToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => scrollToCatalog(cat)}
        onNavigatePage={(page) => navigateToPage(page)}
        onReplayIntro={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setShowLogoIntro(true);
        }}
      />

      {/* Quick View Modal Overlay */}
      <ProductDetailsModal
        product={quickViewProduct}
        preselectedColor={quickViewColor}
        onClose={() => {
          setQuickViewProduct(null);
          setQuickViewColor(undefined);
        }}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={quickViewProduct ? wishlistIds.has(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Quick Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => navigateToPage('checkout')}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Quick Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={(product, size, color) => {
          handleAddToCart(product, size, color);
          setIsWishlistOpen(false);
          setIsCartOpen(true);
        }}
        onOpenProductDetails={(product) => handleOpenProductPage(product)}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={productsList}
        onOpenProductDetails={(product) => handleOpenProductPage(product)}
      />

      {/* Quick Auth Modal */}
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
        onNavigateOrders={() => navigateToPage('orders')}
        onNavigateTracking={() => navigateToPage('order-tracking')}
      />

      {/* Itemized Tax Invoice & Receipt Modal */}
      <PaymentDetailsModal
        isOpen={!!receiptModalOrder}
        order={receiptModalOrder}
        onClose={() => setReceiptModalOrder(null)}
        onOpenTracking={(orderId) => navigateToPage('order-tracking', { trackingOrderId: orderId })}
      />

      {/* Optional Quick Wholesale Modal */}
      <WholesaleModal
        isOpen={isWholesaleOpen}
        onClose={() => setIsWholesaleOpen(false)}
        showToast={showToast}
      />
    </div>
  );
}
