import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, Layers } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeroProps {
  onShopNow: () => void;
  onExploreCollection: (tab: ActiveTab) => void;
  onOpenWholesale?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow, onExploreCollection, onOpenWholesale }) => {
  return (
    <section className="relative overflow-hidden bg-[#080B12] text-white">
      {/* 1. Cinematic Fashion Background Image with Slow Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/src/assets/images/hero_mens_fashion_lifestyle_1793694584426.jpg"
          alt="Raghav Garments modern men's fashion lifestyle collection"
          className="w-full h-full object-cover object-top opacity-55 lg:opacity-70 transition-transform duration-1000 animate-hero-zoom will-change-transform"
          referrerPolicy="no-referrer"
        />
        {/* Measured dark gradient overlays for maximum contrast and electric-blue ambient lighting */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080B12] via-[#080B12]/85 to-[#080B12]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-transparent to-transparent lg:hidden" />
        
        {/* Electric-Blue Radial Glow Center */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1455D9]/25 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* 2. Floating Fashion Graphic Elements (Subtle animated blue lines & geometric accents) */}
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        {/* Floating Orb 1 */}
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-600/15 rounded-full blur-[90px] animate-float-slow" />
        {/* Floating Orb 2 */}
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-[#1455D9]/20 rounded-full blur-[100px] animate-float-reverse" />

        {/* Subtle Decorative Geometric Lines & Grid Crosshairs */}
        <div className="absolute top-12 right-12 hidden lg:flex flex-col items-end gap-2 opacity-35">
          <div className="w-32 h-[1px] bg-gradient-to-l from-[#1455D9] to-transparent animate-pulse" />
          <div className="w-20 h-[1px] bg-gradient-to-l from-blue-400 to-transparent" />
          <span className="text-[10px] tracking-[0.25em] text-blue-300 font-mono">EST. 2026 // PREMIUM MENSWEAR</span>
        </div>

        {/* Vertical floating accent line */}
        <div className="absolute left-8 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-[#1455D9]/30 to-transparent hidden xl:block" />
      </div>

      {/* 3. Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-2xl space-y-6 animate-slide-up">
          
          {/* Official Brand Badge / Tagline with Electric-Blue Pulse */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#080B12]/80 backdrop-blur-md border border-[#1455D9]/40 rounded-full text-xs font-semibold text-blue-200 tracking-wider uppercase shadow-[0_0_15px_rgba(20,85,217,0.3)] transition-transform hover:scale-105">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1455D9] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
            </span>
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>RAGHAV GARMENTS &bull; STYLE THAT DEFINES YOU</span>
          </div>

          {/* Animated Main Headline: "ELEVATE YOUR STYLE." */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight leading-[1.08] text-white uppercase drop-shadow-md">
            ELEVATE YOUR{' '}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-[#1455D9] to-sky-300">
              STYLE.
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-[#1455D9] to-transparent rounded-full" />
            </span>
          </h1>

          {/* Animated Supporting Text: "Premium Men's Wear. Wholesale Prices." */}
          <div className="space-y-2 animate-fade-in">
            <p className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight font-heading">
              Premium Men&apos;s Wear. Wholesale Prices.
            </p>
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              Engineered for everyday durability, tailored silhouettes, and supreme comfort across Pajamas, Casual Pants, Bomber Jackets, and Premium Track Suits.
            </p>
          </div>

          {/* 4. Animated CTA Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Button 1: EXPLORE COLLECTION */}
            <button
              onClick={() => onExploreCollection('all')}
              className="group relative inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#1455D9] to-[#0F42A8] hover:from-[#1d64f2] hover:to-[#1455D9] text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_10px_25px_rgba(20,85,217,0.4)] transform hover:-translate-y-1 active:scale-95 overflow-hidden border border-blue-400/30"
            >
              {/* Shimmer sweep animation */}
              <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
              <Layers className="w-4 h-4 text-blue-200" />
              <span>EXPLORE COLLECTION</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>

            {/* Button 2: SHOP NOW */}
            <button
              onClick={onShopNow}
              className="inline-flex items-center justify-center gap-2 bg-[#080B12]/80 hover:bg-white/10 text-white border border-slate-700 hover:border-blue-400 backdrop-blur-md px-7 py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 shadow-md cursor-pointer"
            >
              <span>SHOP NOW</span>
            </button>

            {/* Button 3: WHOLESALE INQUIRY */}
            {onOpenWholesale && (
              <button
                onClick={onOpenWholesale}
                className="inline-flex items-center justify-center gap-2 bg-[#1455D9]/20 hover:bg-[#1455D9]/30 text-blue-300 border border-blue-400/50 backdrop-blur-md px-6 py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 shadow-md cursor-pointer"
              >
                <span>WHOLESALE B2B</span>
              </button>
            )}
          </div>

          {/* 5. Trust Metrics Strip */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs">
            <div className="transition-transform hover:translate-y-[-2px]">
              <div className="text-xl sm:text-2xl font-black font-heading text-white">4.9 ★</div>
              <div className="text-slate-400 mt-0.5 text-[11px]">15,000+ Men Styled</div>
            </div>
            <div className="transition-transform hover:translate-y-[-2px]">
              <div className="text-xl sm:text-2xl font-black font-heading text-white">100%</div>
              <div className="text-slate-400 mt-0.5 text-[11px]">Pure Combed Cottons</div>
            </div>
            <div className="transition-transform hover:translate-y-[-2px]">
              <div className="text-xl sm:text-2xl font-black font-heading text-white">₹0</div>
              <div className="text-slate-400 mt-0.5 text-[11px]">Free Shipping &gt; ₹999</div>
            </div>
          </div>

        </div>
      </div>

      {/* 6. Feature Highlights Bar with subtle hover transitions */}
      <div className="relative z-10 border-t border-slate-800/80 bg-[#06080E]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-3 group">
              <Truck className="w-5 h-5 text-[#1455D9] flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-bold text-white">Free Fast Shipping</p>
                <p className="text-[11px] text-slate-400">On all orders above ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3 group">
              <RefreshCw className="w-5 h-5 text-[#1455D9] flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-bold text-white">Easy 7-Day Returns</p>
                <p className="text-[11px] text-slate-400">Zero hassle doorstep exchange</p>
              </div>
            </div>

            <div className="flex items-center gap-3 group">
              <ShieldCheck className="w-5 h-5 text-[#1455D9] flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-bold text-white">Genuine Brand Quality</p>
                <p className="text-[11px] text-slate-400">100% inspected garments</p>
              </div>
            </div>

            <div className="flex items-center gap-3 group">
              <Sparkles className="w-5 h-5 text-[#1455D9] flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-bold text-white">Direct Factory Prices</p>
                <p className="text-[11px] text-slate-400">Save up to 50% vs retail</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
