import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { ActiveTab } from '../types';

interface CategoriesSectionProps {
  onSelectCategory: (category: ActiveTab) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onSelectCategory }) => {
  return (
    <section id="categories" className="py-16 sm:py-20 bg-slate-900/10 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with smooth entrance styling */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1455D9] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Wardrobe Essentials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#080B12] font-heading tracking-tight">
              SHOP BY CATEGORY
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Explore our signature styles crafted with high-durability fabrics, breathable natural fibers, and contemporary tailored fits.
          </p>
        </div>

        {/* Categories Grid - 2 cols on mobile, 4 on desktop with Royal-Blue Hover Borders & Smooth Zoom */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {CATEGORIES.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as ActiveTab)}
              className="group relative bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-[#1455D9] shadow-xs hover:shadow-[0_12px_30px_rgba(20,85,217,0.22)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
              style={{ transitionDelay: `${idx * 40}ms` }}
            >
              {/* Image Frame with Portrait Aspect Ratio and Smooth Hover Zoom */}
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-top sm:object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                
                {/* Starting Price Tag */}
                <div className="absolute top-2.5 right-2.5 bg-black/85 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow-sm group-hover:bg-[#1455D9] group-hover:shadow-[0_0_12px_rgba(20,85,217,0.5)] transition-all duration-300">
                  From {cat.startingPrice}
                </div>

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-45 group-hover:opacity-65 transition-opacity duration-300" />
                
                {/* Overlay Category Tag for Mobile & Desktop */}
                <div className="absolute bottom-2.5 left-2.5 text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#080B12]/80 backdrop-blur-xs px-2 py-0.5 rounded border border-white/20">
                  {cat.itemCount}
                </div>
              </div>

              {/* Content Box with Royal-Blue Transition & Reveal */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="text-[#1455D9] font-bold uppercase text-[10px] tracking-wider">
                      Raghav Menswear
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#080B12] font-heading group-hover:text-[#1455D9] transition-colors duration-200">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {cat.tagline} {cat.description}
                  </p>
                </div>

                {/* Clickable CTA Button with animated translation */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1455D9] group-hover:text-[#0F42A8] flex items-center gap-1.5 transition-colors">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
