import React, { useState, useEffect } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
  Lock
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ActiveTab, PageView } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onGoHome: () => void;
  currentPage: PageView;
  isCatalogRoute?: boolean;
  onNavigatePage: (page: PageView) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  currentUser: { name: string; email: string } | null;
  cartBounce?: boolean;
  onOpenWholesale?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onGoHome,
  currentPage,
  isCatalogRoute = false,
  onNavigatePage,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenAuth,
  currentUser,
  cartBounce = false,
  onOpenWholesale
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: string; label: string; tab: ActiveTab; highlight?: boolean }[] = [
    { id: 'home', label: 'Home', tab: 'all' },
    { id: 'shop-all', label: 'Shop All', tab: 'all' },
    { id: 'pajamas', label: "Men's Pajamas", tab: 'pajamas' },
    { id: 'pants', label: 'Pants', tab: 'pants' },
    { id: 'jackets', label: 'Jackets', tab: 'jackets' },
    { id: 'tracksuits', label: 'Track Suits', tab: 'tracksuits' },
    { id: 'new-arrivals', label: 'New Arrivals', tab: 'new-arrivals' },
    { id: 'sale', label: 'Sale', tab: 'sale', highlight: true }
  ];

  const handleNavClick = (item: { id: string; tab: ActiveTab }) => {
    if (item.id === 'home') {
      onGoHome();
    } else {
      onSelectTab(item.tab);
    }
    setMobileMenuOpen(false);
  };

  const navigateAndClose = (page: PageView) => {
    onNavigatePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-[#080B12] text-white transition-all duration-300 ${
        isScrolled ? 'shadow-2xl shadow-black/80 border-b border-slate-800' : 'border-b border-slate-900'
      }`}
    >
      {/* 1. Top Announcement & Quick Links Bar */}
      <div className="bg-black text-slate-300 py-2 px-4 text-xs font-medium border-b border-slate-900/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-5 text-slate-300">
            <span className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Truck className="w-3.5 h-3.5 text-[#1455D9]" /> Free Shipping ₹999+
            </span>
            <span className="flex items-center gap-1.5 transition-colors hover:text-white">
              <RotateCcw className="w-3.5 h-3.5 text-[#1455D9]" /> 7-Day Returns
            </span>
          </div>

          <div className="w-full md:w-auto text-center md:text-right flex items-center justify-center md:justify-end gap-2 text-white font-semibold">
            <span className="bg-[#1455D9] text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider inline-flex items-center gap-1">
              Festive Offer
            </span>
            <span className="text-xs">
              Code <span className="text-yellow-400 font-extrabold underline decoration-yellow-400/50 underline-offset-2">RGARMENTS14</span> for 10% OFF
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-slate-400 text-[11px]">
            <button
              onClick={() => onNavigatePage('order-tracking')}
              className={`hover:text-white transition-colors flex items-center gap-1 font-semibold cursor-pointer ${
                currentPage === 'order-tracking' ? 'text-blue-400' : 'text-slate-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-[#1455D9]" />
              <span>Track Order</span>
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigatePage('orders')}
              className={`hover:text-white transition-colors cursor-pointer ${
                currentPage === 'orders' ? 'text-white font-semibold' : ''
              }`}
            >
              My Orders
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigatePage('about')}
              className={`hover:text-white transition-colors cursor-pointer ${
                currentPage === 'about' ? 'text-white font-semibold' : ''
              }`}
            >
              About Us
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigatePage('contact')}
              className={`hover:text-white transition-colors cursor-pointer ${
                currentPage === 'contact' ? 'text-white font-semibold' : ''
              }`}
            >
              Contact
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigatePage('faq')}
              className={`hover:text-white transition-colors cursor-pointer ${
                currentPage === 'faq' ? 'text-white font-semibold' : ''
              }`}
            >
              FAQ
            </button>
          </div>
        </div>
      </div>

      {/* 2. Premium Black Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 text-white hover:text-[#1455D9] rounded-lg focus:outline-none transition-colors cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Official Brand Logo on the Left */}
          <button
            onClick={onGoHome}
            className="group flex items-center focus:outline-none py-1 transition-transform hover:scale-102 cursor-pointer"
            title="RAGHAV GARMENTS Home"
          >
            <BrandLogo size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
            {navItems.map((item) => {
              const isActive =
                currentPage === 'shop' &&
                (item.id === 'home'
                  ? activeTab === 'all' && !isCatalogRoute
                  : item.id === 'shop-all'
                  ? activeTab === 'all' && isCatalogRoute
                  : activeTab === item.tab);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`nav-link-anim relative px-2.5 py-1.5 text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-[#1455D9] font-bold active'
                      : item.highlight
                      ? 'text-rose-400 hover:text-rose-300'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  {item.label}
                  {item.highlight && (
                    <span className="ml-1.5 text-[9px] bg-rose-600 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      Hot
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={onOpenWholesale ? onOpenWholesale : () => onNavigatePage('wholesale')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                currentPage === 'wholesale'
                  ? 'bg-[#1455D9] text-white border-[#1455D9]'
                  : 'text-blue-300 hover:text-white bg-blue-950/60 hover:bg-[#1455D9] border-blue-500/40'
              }`}
              title="Wholesale & Bulk Orders"
            >
              <span>B2B Wholesale</span>
            </button>

            <button
              onClick={() => onNavigatePage('order-tracking')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentPage === 'order-tracking'
                  ? 'bg-[#1455D9] text-white shadow-md'
                  : 'text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700'
              }`}
              title="Track Order"
            >
              <Truck className="w-3.5 h-3.5 text-[#1455D9]" />
              <span>Track</span>
            </button>

            <button
              onClick={onOpenSearch}
              aria-label="Search products"
              className="p-2 text-white hover:text-[#1455D9] hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 relative cursor-pointer"
              title="Search collection"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenWishlist}
              aria-label="View wishlist"
              className="p-2 text-white hover:text-rose-400 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 relative cursor-pointer"
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${currentPage === 'wishlist' ? 'text-rose-400 fill-current' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-heart-pop">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenAuth}
              aria-label="Customer account"
              className="p-2 text-white hover:text-[#1455D9] hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 relative cursor-pointer"
              title={currentUser ? `Logged in as ${currentUser.name}` : 'Login / Register'}
            >
              <User className="w-5 h-5" />
              {currentUser && (
                <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#080B12]" />
              )}
            </button>

            <button
              onClick={onOpenCart}
              aria-label="Shopping bag"
              className={`flex items-center gap-2 bg-[#1455D9] hover:bg-[#0F42A8] text-white px-3.5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-900/40 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer ${
                cartBounce ? 'animate-cart-bounce ring-4 ring-blue-400/80' : ''
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Cart</span>
              <span className="bg-white text-[#1455D9] text-xs font-black px-1.5 py-0.5 rounded-md min-w-[20px] text-center shadow-xs">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#080B12] text-white shadow-2xl flex flex-col z-50 border-r border-slate-800">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <BrandLogo size="sm" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
                Shopping Categories
              </div>
              {navItems.map((item) => {
                const isActive =
                  currentPage === 'shop' &&
                  (item.id === 'home'
                    ? activeTab === 'all' && !isCatalogRoute
                    : item.id === 'shop-all'
                    ? activeTab === 'all' && isCatalogRoute
                    : activeTab === item.tab);
                return (
                  <button
                    key={`mobile-${item.id}`}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/20 text-[#1455D9] font-bold border border-blue-500/30'
                        : 'text-slate-200 hover:bg-white/5 hover:text-[#1455D9]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                );
              })}

              <div className="pt-3 border-t border-slate-800 my-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
                  Orders, Account &amp; B2B
                </div>
                <button
                  onClick={() => navigateAndClose('cart')}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <span>Shopping Cart ({cartCount})</span>
                  <ShoppingBag className="w-4 h-4 text-[#1455D9]" />
                </button>
                <button
                  onClick={() => navigateAndClose('wishlist')}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <span>Wishlist ({wishlistCount})</span>
                  <Heart className="w-4 h-4 text-rose-400" />
                </button>
                <button
                  onClick={() => navigateAndClose('orders')}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <span>My Orders</span>
                  <Package className="w-4 h-4 text-[#1455D9]" />
                </button>
                <button
                  onClick={() => navigateAndClose('order-tracking')}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <span>Track Order</span>
                  <Truck className="w-4 h-4 text-[#1455D9]" />
                </button>
                <button
                  onClick={() => navigateAndClose('login')}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <span>{currentUser ? `Account (${currentUser.name})` : 'Login / Sign Up'}</span>
                  <User className="w-4 h-4 text-[#1455D9]" />
                </button>
                <button
                  onClick={() => navigateAndClose('wholesale')}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-blue-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <span>B2B Wholesale Portal</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-3 border-t border-slate-800 my-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
                  Company &amp; Policies
                </div>
                <button
                  onClick={() => navigateAndClose('about')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  About Raghav Garments
                </button>
                <button
                  onClick={() => navigateAndClose('size-guide')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  Size Chart &amp; Fitting
                </button>
                <button
                  onClick={() => navigateAndClose('shipping-policy')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  Shipping &amp; Delivery Policy
                </button>
                <button
                  onClick={() => navigateAndClose('returns-policy')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  Easy 7-Day Returns
                </button>
                <button
                  onClick={() => navigateAndClose('faq')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
                <button
                  onClick={() => navigateAndClose('contact')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  Contact Us
                </button>
                <button
                  onClick={() => navigateAndClose('admin-login')}
                  className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-semibold text-[#1455D9] hover:text-blue-400 hover:bg-white/5 rounded-lg cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" /> Admin Login
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-black/60 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-white font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#1455D9]" /> 100% Genuine Quality Guaranteed
              </div>
              <p className="text-[11px] text-slate-400">
                Customer Support: +91 98712 34567<br />
                Mon - Sat (10 AM - 7 PM IST)
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
