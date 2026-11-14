import React, { useState, useMemo } from 'react';
import { ArrowUpDown, X, Palette } from 'lucide-react';
import { Product, ActiveTab } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridSectionProps {
  products: Product[];
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenDetails: (product: Product, preselectedColor?: string) => void;
  onQuickView?: (product: Product, preselectedColor?: string) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product) => void;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'discount' | 'rating';

export const ProductGridSection: React.FC<ProductGridSectionProps> = ({
  products,
  activeTab,
  onSelectTab,
  onOpenDetails,
  onQuickView,
  onAddToCart,
  wishlistIds,
  onToggleWishlist
}) => {
  const [collectionFilter, setCollectionFilter] = useState<'all' | 'new-arrivals' | 'best-sellers' | 'trending' | 'special-offers'>('all');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Sync tab with collection filter and reset when switching back to a standard category
  React.useEffect(() => {
    if (activeTab === 'new-arrivals') {
      setCollectionFilter('new-arrivals');
    } else if (activeTab === 'sale') {
      setCollectionFilter('special-offers');
    } else {
      setCollectionFilter('all');
    }
  }, [activeTab]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filtering
        if (activeTab === 'pajamas' && p.category !== 'pajamas') return false;
        if (activeTab === 'pants' && p.category !== 'pants') return false;
        if (activeTab === 'jackets' && p.category !== 'jackets') return false;
        if (activeTab === 'tracksuits' && p.category !== 'tracksuits') return false;

        // Collection filtering
        if (collectionFilter === 'new-arrivals' && p.badge !== 'New Arrival') return false;
        if (collectionFilter === 'best-sellers' && p.badge !== 'Best Seller') return false;
        if (collectionFilter === 'trending' && p.badge !== 'Trending') return false;
        if (collectionFilter === 'special-offers' && p.discount < 42) return false;

        // Size filtering
        if (selectedSizeFilter !== 'all' && !p.sizes.includes(selectedSizeFilter as any)) {
          return false;
        }

        // Color filtering
        if (selectedColorFilter !== 'all') {
          const hasColor = p.colors.some(
            (c) => c.name.toLowerCase() === selectedColorFilter.toLowerCase()
          );
          if (!hasColor) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'discount') return b.discount - a.discount;
        if (sortBy === 'rating') return b.rating - a.rating;
        // default featured
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [products, activeTab, collectionFilter, selectedSizeFilter, selectedColorFilter, sortBy]);

  const clearAllFilters = () => {
    onSelectTab('all');
    setCollectionFilter('all');
    setSelectedSizeFilter('all');
    setSelectedColorFilter('all');
    setSortBy('featured');
  };

  const isAnyFilterActive =
    activeTab !== 'all' ||
    collectionFilter !== 'all' ||
    selectedSizeFilter !== 'all' ||
    selectedColorFilter !== 'all' ||
    sortBy !== 'featured';

  return (
    <section id="products-catalog" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Top Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1455D9]">
            The Master Collection · {products.length} Original Store Styles
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#080B12] font-heading mt-1 tracking-tight">
            SIGNATURE APPAREL
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Every product photo displayed individually with 100% original unedited colors, direct factory pricing, and bulk wholesale rates (MOQ: 10 Pcs).
          </p>
        </div>

        {/* Collection Sub-navigation Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {[
            { id: 'all', label: 'All Essentials' },
            { id: 'original-pants', label: '★ 22 Original Pants' },
            { id: 'original-pajamas', label: '★ 18 Original Pajamas' },
            { id: 'original-tracksuits', label: '★ 11 Original Track Suits' },
            { id: 'best-sellers', label: 'Best Sellers' },
            { id: 'new-arrivals', label: 'New Arrivals' },
            { id: 'trending', label: 'Trending Styles' },
            { id: 'special-offers', label: 'Special Offers' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'original-pants') {
                  onSelectTab('pants');
                  setCollectionFilter('all');
                } else if (tab.id === 'original-pajamas') {
                  onSelectTab('pajamas');
                  setCollectionFilter('all');
                } else if (tab.id === 'original-tracksuits') {
                  onSelectTab('tracksuits');
                  setCollectionFilter('all');
                } else {
                  onSelectTab('all');
                  setCollectionFilter(tab.id as any);
                }
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                (tab.id === 'original-pants' && activeTab === 'pants' && collectionFilter === 'all') ||
                (tab.id === 'original-pajamas' && activeTab === 'pajamas' && collectionFilter === 'all') ||
                (tab.id === 'original-tracksuits' && activeTab === 'tracksuits' && collectionFilter === 'all') ||
                (tab.id === collectionFilter && activeTab === 'all')
                  ? 'bg-[#080B12] text-white shadow-sm scale-102 ring-2 ring-[#1455D9]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter & Sort Bar */}
        <div className="mt-8 mb-8 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Quick Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
            <span className="text-slate-400 mr-1 hidden sm:inline">Category:</span>
            {[
              { id: 'pants', label: `Men's Pants (${products.filter(p => p.category === 'pants').length} Original Photos)` },
              { id: 'pajamas', label: `Men's Pajamas (${products.filter(p => p.category === 'pajamas').length} Original Photos)` },
              { id: 'tracksuits', label: `Men's Track Suits (${products.filter(p => p.category === 'tracksuits').length} Original Photos)` },
              { id: 'jackets', label: `Men's Jackets (${products.filter(p => p.category === 'jackets').length})` },
              { id: 'all', label: `All Styles (${products.length})` }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectTab(cat.id as ActiveTab)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === cat.id
                    ? 'bg-[#1455D9] text-white font-bold shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Right Controls: Colour Filter, Size Filter & Sort */}
          <div className="flex items-center flex-wrap md:justify-end gap-2.5">
            
            {/* Colour Filter Dropdown */}
            <div className="flex items-center gap-1 text-xs">
              <Palette className="w-3.5 h-3.5 text-[#1455D9]" />
              <select
                value={selectedColorFilter}
                onChange={(e) => setSelectedColorFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
              >
                <option value="all">All Colours</option>
                <option value="black">Black Variant</option>
                <option value="white">White Variant</option>
                <option value="grey">Grey Variant</option>
                <option value="royal blue">Royal Blue Variant</option>
              </select>
            </div>

            {/* Size Filter Dropdown */}
            <div className="flex items-center gap-1 text-xs">
              <select
                value={selectedSizeFilter}
                onChange={(e) => setSelectedSizeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
              >
                <option value="all">All Sizes</option>
                <optgroup label="Waist (Pants)">
                  <option value="30">Waist 30</option>
                  <option value="32">Waist 32</option>
                  <option value="34">Waist 34</option>
                  <option value="36">Waist 36</option>
                  <option value="38">Waist 38</option>
                </optgroup>
                <optgroup label="Standard Sizes">
                  <option value="S">Size S</option>
                  <option value="M">Size M</option>
                  <option value="L">Size L</option>
                  <option value="XL">Size XL</option>
                  <option value="XXL">Size XXL</option>
                </optgroup>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>

            {/* Clear Filters if active */}
            {isAnyFilterActive && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

          </div>

        </div>

        {/* Results Counter & Wholesale Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 mb-6 gap-2">
          <span>
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> styles
            {selectedColorFilter !== 'all' && (
              <span className="ml-2 font-bold text-[#1455D9] capitalize">
                (Filtered: {selectedColorFilter})
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1455D9] font-bold text-[11px] border border-blue-200/60">
              ⚡ Wholesale MOQ: 10 Pcs Available
            </span>
            {activeTab !== 'all' && (
              <span className="text-[#1455D9] font-semibold">
                Category: {activeTab === 'pajamas' ? "Men's Pajamas" : activeTab === 'pants' ? "Men's Pants" : activeTab === 'jackets' ? "Men's Jackets" : "Men's Track Suits"}
              </span>
            )}
          </div>
        </div>

        {/* Products Grid (2 columns on mobile, 3 on md, 4 on desktop) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                index={idx}
                onOpenDetails={onOpenDetails}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                isWishlisted={wishlistIds.has(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Palette className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 font-heading">No Products Found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any products matching your active filters. Try resetting the size or category filter.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 bg-[#1455D9] hover:bg-[#0F42A8] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
