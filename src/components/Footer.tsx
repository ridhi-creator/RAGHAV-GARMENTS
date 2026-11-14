import React, { useState } from 'react';
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Send,
  Check,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ActiveTab, PageView } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ActiveTab) => void;
  onNavigatePage: (page: PageView) => void;
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onNavigatePage, onReplayIntro }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setIsSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#080B12] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Highlights */}
        <div className="pb-12 border-b border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <Truck className="w-8 h-8 text-[#1455D9] shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white font-heading">Free All-India Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5">On all prepaid &amp; COD orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <RotateCcw className="w-8 h-8 text-[#1455D9] shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white font-heading">7-Day Doorstep Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">Quick courier pickup, immediate refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <ShieldCheck className="w-8 h-8 text-[#1455D9] shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white font-heading">100% Genuine Apparel</h4>
              <p className="text-xs text-slate-400 mt-0.5">Direct from our specialized atelier in India</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo size="md" showText={true} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Raghav Garments is an Indian menswear brand dedicated to redefining everyday comfort with sharp tailoring, enduring fabrics, and direct wholesale pricing.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2">
                Join The Raghav Club
              </span>
              <p className="text-[11px] text-slate-400 mb-2">
                Subscribe for seasonal lookbooks and code RGARMENTS14 (10% off your order).
              </p>

              {isSubscribed ? (
                <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs px-3 py-2.5 rounded-xl">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Thank you! Your welcome code has been sent.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1455D9]"
                    />
                  </div>
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="bg-[#1455D9] hover:bg-[#0F42A8] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#1455D9] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#1455D9] transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#1455D9] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#1455D9] transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Categories Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Shop Collections</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onSelectCategory('all')} className="hover:text-white transition-colors cursor-pointer">
                  All Menswear Products
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('pajamas')} className="hover:text-white transition-colors cursor-pointer">
                  Men&apos;s Pajamas &amp; Loungewear
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('pants')} className="hover:text-white transition-colors cursor-pointer">
                  Men&apos;s Pants &amp; Flex Chinos
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('jackets')} className="hover:text-white transition-colors cursor-pointer">
                  Men&apos;s Jackets &amp; Bombers
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('tracksuits')} className="hover:text-white transition-colors cursor-pointer">
                  Men&apos;s Track Suits &amp; Athleisure
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('new-arrivals')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>New Season Arrivals</span>
                  <span className="text-[10px] bg-[#1455D9] text-white px-1.5 rounded uppercase font-bold">New</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('sale')}
                  className="hover:text-white transition-colors text-rose-400 cursor-pointer"
                >
                  Clearance &amp; Festive Sale
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('wholesale')}
                  className="hover:text-white transition-colors text-blue-400 font-semibold cursor-pointer"
                >
                  B2B Wholesale Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Account Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Customer Care</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigatePage('order-tracking')}
                  className="hover:text-white transition-colors text-slate-200 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1455D9]" />
                  <span>Track Your Order</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePage('orders')}
                  className="hover:text-white transition-colors text-slate-200 font-semibold cursor-pointer"
                >
                  My Orders
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('cart')} className="hover:text-white transition-colors cursor-pointer">
                  Shopping Cart
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('wishlist')} className="hover:text-white transition-colors cursor-pointer">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('login')} className="hover:text-white transition-colors cursor-pointer">
                  Login / Sign Up
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('about')} className="hover:text-white transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('faq')} className="hover:text-white transition-colors cursor-pointer">
                  FAQ &amp; Help Center
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('shipping-policy')} className="hover:text-white transition-colors cursor-pointer">
                  Shipping &amp; Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('returns-policy')} className="hover:text-white transition-colors cursor-pointer">
                  Easy 7-Day Returns
                </button>
              </li>
              <li>
                <button onClick={() => onNavigatePage('size-guide')} className="hover:text-white transition-colors cursor-pointer">
                  Size Chart &amp; Fitting
                </button>
              </li>
            </ul>

            <div className="pt-3 border-t border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                ADMINISTRATION
              </span>
              <button
                onClick={() => onNavigatePage('admin-login')}
                className="text-xs text-[#1455D9] hover:text-blue-400 font-semibold inline-flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1 group cursor-pointer"
              >
                <Lock className="w-3 h-3 text-[#1455D9] group-hover:text-blue-400 transition-colors" />
                <span>ADMIN LOGIN</span>
              </button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3 text-xs text-slate-400">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Store &amp; Atelier</h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#1455D9] shrink-0 mt-0.5" />
              <span>Raghav Garments, 24-B Fashion Boulevard, Ring Road, New Delhi, 110049, India</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#1455D9] shrink-0" />
              <span>+91 98712 34567 (10 AM - 7 PM)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#1455D9] shrink-0" />
              <span>care@raghavgarments.com</span>
            </div>
            <div className="pt-2">
              <span className="text-[11px] text-slate-500 block mb-1 font-semibold uppercase">
                Accepted Payment Methods
              </span>
              <div className="flex items-center gap-2 text-white font-mono text-[10px]">
                <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded">UPI</span>
                <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded">RuPay</span>
                <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded">Visa</span>
                <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded">Mastercard</span>
                <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded">COD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RAGHAV GARMENTS. All Rights Reserved. Style That Defines You.</p>
          <div className="flex flex-wrap items-center gap-4">
            {onReplayIntro && (
              <>
                <button
                  onClick={onReplayIntro}
                  className="text-[#1455D9] hover:text-blue-400 font-semibold transition-colors cursor-pointer"
                >
                  Replay Intro
                </button>
                <span>·</span>
              </>
            )}
            <button onClick={() => onNavigatePage('privacy-policy')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span>·</span>
            <button onClick={() => onNavigatePage('terms')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Terms of Service
            </button>
            <span>·</span>
            <button onClick={() => onNavigatePage('shipping-policy')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Shipping Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
