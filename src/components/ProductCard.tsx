import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Eye, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product, preselectedColor?: string) => void;
  onQuickView?: (product: Product, preselectedColor?: string) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  index = 0
}) => {
  // Guarantee default selected color from available colors (Black as default or first)
  const defaultColor = product.colors.find(c => c.name.toLowerCase() === 'black')?.name || product.colors[0]?.name || 'Black';
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '32');
  const [selectedColor, setSelectedColor] = useState<string>(defaultColor);
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [heartAnimated, setHeartAnimated] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Helper to resolve color photo with case-insensitivity
  const getColorImage = (colorName: string): string => {
    if (!product.colorImages) return product.images[0];
    if (product.colorImages[colorName]) return product.colorImages[colorName];
    const key = Object.keys(product.colorImages).find(
      (k) => k.toLowerCase() === colorName.toLowerCase()
    );
    return key ? product.colorImages[key] : product.images[0];
  };

  // State to track currently displayed photograph
  const [displayedImage, setDisplayedImage] = useState<string>(() => getColorImage(defaultColor));

  // Sync displayed image when color changes
  useEffect(() => {
    const img = getColorImage(selectedColor);
    setDisplayedImage(img);
    // Find index of this image in product.images if present
    const idx = product.images.indexOf(img);
    if (idx !== -1) {
      setCurrentImageIndex(idx);
    }
  }, [selectedColor]);

  // Previous image navigation
  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images.length <= 1) return;
    const nextIdx = currentImageIndex > 0 ? currentImageIndex - 1 : product.images.length - 1;
    setCurrentImageIndex(nextIdx);
    setDisplayedImage(product.images[nextIdx]);
  };

  // Next image navigation
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images.length <= 1) return;
    const nextIdx = currentImageIndex < product.images.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(nextIdx);
    setDisplayedImage(product.images[nextIdx]);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, selectedColor);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartAnimated(true);
    setTimeout(() => setHeartAnimated(false), 500);
    onToggleWishlist(product);
  };

  const handleColorClick = (e: React.MouseEvent, colorName: string) => {
    e.stopPropagation();
    setSelectedColor(colorName);
  };

  return (
    <div
      onClick={() => onOpenDetails(product, selectedColor)}
      style={{ animationDelay: `${(index % 8) * 50}ms` }}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-[#1455D9] overflow-hidden shadow-xs hover:shadow-[0_12px_28px_rgba(20,85,217,0.18)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer animate-fade-in"
    >
      {/* 1. Image Container (Clean 3:4 portrait ratio for full garment showcase with ZERO cropping) */}
      <div className="relative aspect-[3/4] bg-[#F8F9FA] overflow-hidden flex items-center justify-center">
        <img
          key={displayedImage} // Key triggers smooth CSS fade transition
          src={displayedImage}
          alt={`${product.name} in ${selectedColor}`}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Previous / Next Arrow Controls (Visible on hover on desktop, touch friendly) */}
        {product.images && product.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Pagination Dots Indicator */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {product.images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentImageIndex ? 'w-4 bg-[#1455D9]' : 'w-1.5 bg-white/80 shadow-xs'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Subtle Discount & Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge && (
            <span className="text-[10px] font-bold tracking-wider uppercase bg-[#080B12] text-white px-2 py-0.5 rounded shadow-xs">
              {product.badge}
            </span>
          )}
          <span className="text-[10px] sm:text-[11px] font-extrabold text-white bg-rose-600 px-1.5 sm:px-2 py-0.5 rounded shadow-xs w-max">
            {product.discount}% OFF
          </span>
        </div>

        {/* Animated Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-10 shadow-xs ${
            heartAnimated ? 'animate-heart-pop' : ''
          } ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-500 scale-105'
              : 'bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white hover:scale-110'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Floating Quick View button on hover (desktop only) */}
        <div className="absolute inset-x-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center justify-center z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) {
                onQuickView(product, selectedColor);
              } else {
                onOpenDetails(product, selectedColor);
              }
            }}
            className="w-full bg-white/95 hover:bg-white text-slate-900 font-bold text-xs py-2 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 backdrop-blur-xs transition-colors hover:text-[#1455D9]"
          >
            <Eye className="w-3.5 h-3.5 text-[#1455D9]" /> Quick View
          </button>
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="capitalize font-medium tracking-wide">
              {product.category === 'pajamas'
                ? "Men's Pajamas"
                : product.category === 'pants'
                ? "Men's Pants"
                : product.category === 'jackets'
                ? "Men's Jackets"
                : "Men's Track Suits"}
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <span className="text-amber-500">★</span> {product.rating}
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </span>
          </div>

          {/* Product Title */}
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading line-clamp-1 group-hover:text-[#1455D9] transition-colors">
            {product.name}
          </h4>

          {/* Size Pills */}
          <div className="flex items-center gap-1 mt-1.5 overflow-x-auto py-0.5 no-scrollbar">
            <span className="text-[10px] text-slate-400 mr-0.5 shrink-0">Size:</span>
            {product.sizes.slice(0, 5).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(sz);
                }}
                className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border transition-colors shrink-0 ${
                  selectedSize === sz
                    ? 'bg-[#080B12] text-white border-[#080B12]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Pricing, Colour Selection, & Add to Cart Footer */}
        <div className="pt-2.5 mt-2.5 border-t border-slate-100 space-y-2">
          
          {/* Price Block */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-[#080B12] tabular-nums font-heading">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400 line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-emerald-600 font-bold">
              Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
            </span>
          </div>

          {/* MANDATORY THREE COLOUR OPTIONS DISPLAY (BLACK, WHITE, GREY) */}
          <div className="flex items-center justify-between pt-1 border-t border-dashed border-slate-100">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                {product.colors.map((color) => {
                  const isSelected = selectedColor.toLowerCase() === color.name.toLowerCase();
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={(e) => handleColorClick(e, color.name)}
                      title={`${color.name} (Click to switch image)`}
                      className={`relative w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-[#1455D9] ring-offset-1 sm:ring-offset-2 scale-110 shadow-xs'
                          : 'border border-slate-300 hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: color.hex,
                        boxShadow: color.name.toLowerCase() === 'white' ? 'inset 0 0 0 1px #cbd5e1' : undefined
                      }}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              color.name.toLowerCase() === 'white' ? 'bg-[#1455D9]' : 'bg-white'
                            }`}
                          />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] font-bold text-slate-600 capitalize truncate max-w-[55px]">
                {selectedColor}
              </span>
            </div>

            {/* Quick Add CTA */}
            <button
              onClick={handleQuickAdd}
              disabled={isAddedRecently}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer shrink-0 ${
                isAddedRecently
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1455D9] hover:bg-[#0F42A8] text-white shadow-xs'
              }`}
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Add
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
