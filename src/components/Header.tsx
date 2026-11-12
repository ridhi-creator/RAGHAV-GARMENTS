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
  RotateCcw
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ActiveTab, PageView } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentPage: PageView;
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
  currentPage,
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

  const navItems: { label: string; tab: ActiveTab; highlight?: boolean }[] = [
    { label: 'Home', tab: 'all' },
    { label: 'Shop All', tab: 'all' },
    { label: "Men's Pajamas", tab: 'pajamas' },
    { label: 'Pants', tab: 'pants' },
    { label: 'Jackets', tab: 'jackets' },
    { label: 'Track Suits', tab: 'tracksuits' },
    { label: 'New Arrivals', tab: 'new-arrivals' },
    { label: 'Sale', tab: 'sale', highlight: true }
  ];

  const handleTabClick = (tab: ActiveTab) => {
    onNavigatePage('shop');
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-40 bg-[#080B12] text-white transition-all duration-300 ${
      isScrolled ? 'shadow-2xl shadow-black/80 border-b border-slate-800' : 'border-b border-slate-900'
    }`}>
      {/* 1. Top Announcement Bar */}
      <div className="bg-black text-slate-300 py-2 px-4 text-xs font-medium border-b border-slate-900/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-6 text-slate-300">
            <span className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Truck className="w-3.5 h-3.5 text-[#1455D9]" /> Free Shipping on Orders Above ₹999
            </span>
            <span className="flex items-center gap-1.5 transition-colors hover:text-white">
              <RotateCcw className="w-3.5 h-3.5 text-[#1455D9]" /> Easy 7-Day Hassle-Free Returns
            </span>
          </div>

          <div className="w-full md:w-auto text-center md:text-right flex items-center justify-center md:justify-end gap-2.5 text-white font-semibold">
            <span className="bg-[#1455D9] text-white text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider inline-flex items-center gap-1">
              Festive Offer
            </span>
            <span className="text-xs">
              Use Code <span className="text-yellow-400 font-extrabold underline decoration-yellow-400/50 underline-offset-2">RGARMENTS14</span> for Instant 10% OFF
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-slate-400 text-[11px]">
            <button 
              onClick={() => onNavigatePage('order-tracking')} 
              className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-slate-200"
            >
              <Truck className="w-3.5 h-3.5 text-[#1455D9]" />
              <span>Track Order</span>
            </button>
            <span>·</span>
            <button 
              onClick={() => onNavigatePage('orders')} 
              className="hover:text-white transition-colors"
            >
              My Orders
            </button>
            <span>·</span>
            <button 
              onClick={() => onNavigatePage('faq')} 
              className="hover:text-white transition-colors"
            >
              Need Help?
            </button>
            <span>·</span>
            <button 
              onClick={() => onNavigatePage('contact')} 
              className="hover:text-white transition-colors"
            >
              Store Locator
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
              className="p-2 text-white hover:text-[#1455D9] rounded-lg focus:outline-none transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Official Uploaded Logo on the Left */}
          <button
            onClick={() => {
              onNavigatePage('shop');
              onSelectTab('all');
            }}
            className="group flex items-center focus:outline-none py-1 transition-transform hover:scale-102"
            title="RAGHAV GARMENTS Home"
          >
            <BrandLogo size="md" />
          </button>

          {/* Desktop Navigation Links with Royal-Blue Sliding Underline Hover Effects */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
            {navItems.map((item) => {
              const isActive = currentPage === 'shop' && activeTab === item.tab;
              return (
                <button
                  key={`${item.label}-${item.tab}`}
                  onClick={() => handleTabClick(item.tab)}
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

          {/* Action Icons with Interactive Hover Pop */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* B2B Wholesale Action Button */}
            {onOpenWholesale && (
              <button
                onClick={onOpenWholesale}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-300 hover:text-white bg-blue-950/60 hover:bg-[#1455D9] border border-blue-500/40 transition-all cursor-pointer"
                title="Wholesale & Bulk Orders"
              >
                <span>B2B Wholesale</span>
              </button>
            )}

            {/* Direct Track Order Button */}
            <button
              onClick={() => onNavigatePage('order-tracking')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentPage === 'order-tracking'
                  ? 'bg-[#1455D9] text-white shadow-md'
                  : 'text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700'
              }`}
              title="Track Order"
            >
              <Truck className="w-3.5 h-3.5 text-[#1455D9]" />
              <span>Track</span>
            </button>

            {/* Search Icon */}
            <button
              onClick={onOpenSearch}
              aria-label="Search products"
              className="p-2 text-white hover:text-[#1455D9] hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 relative"
              title="Search collection"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              aria-label="View wishlist"
              className="p-2 text-white hover:text-rose-400 hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-heart-pop">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account Icon */}
            <button
              onClick={onOpenAuth}
              aria-label="Customer account"
              className="p-2 text-white hover:text-[#1455D9] hover:bg-white/10 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 relative"
              title={currentUser ? `Logged in as ${currentUser.name}` : 'Login / Register'}
            >
              <User className="w-5 h-5" />
              {currentUser && (
                <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#080B12]" />
              )}
            </button>

            {/* Shopping Bag Icon with Live Badge & Bounce Effect */}
            <button
              onClick={onOpenCart}
              aria-label="Shopping bag"
              className={`flex items-center gap-2 bg-[#1455D9] hover:bg-[#0F42A8] text-white px-3.5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-900/40 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
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

      {/* Mobile Drawer Navigation (Black / Dark Theme) */}
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
                className="p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
                Shopping Categories
              </div>
              {navItems.map((item) => (
                <button
                  key={`mobile-${item.label}`}
                  onClick={() => handleTabClick(item.tab)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    activeTab === item.tab
                      ? 'bg-blue-600/20 text-[#1455D9] font-bold border border-blue-500/30'
                      : 'text-slate-200 hover:bg-white/5 hover:text-[#1455D9]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
              ))}

              <div className="pt-4 border-t border-slate-800 my-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
                  Company & Support
                </div>
                <button
                  onClick={() => {
                    onNavigatePage('about');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  About Raghav Garments
                </button>
                <button
                  onClick={() => {
                    onNavigatePage('faq');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  Frequently Asked Questions
                </button>
                <button
                  onClick={() => {
                    onNavigatePage('contact');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
                >
                  Store & Contact Info
                </button>
              </div>
            </div>

            {/* Mobile Footer */}
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
