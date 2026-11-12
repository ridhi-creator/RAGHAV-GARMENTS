import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Check, 
  Ruler, 
  MapPin, 
  Share2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsModalProps {
  product: Product | null;
  preselectedColor?: string;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onBuyNow: (product: Product, size: string, color: string, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  preselectedColor,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist
}) => {
  if (!product) return null;

  // Initialize selected color (respect preselectedColor if passed, else Black or first color)
  const initialColor = preselectedColor || product.colors.find(c => c.name.toLowerCase() === 'black')?.name || product.colors[0]?.name || 'Black';
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [pincode, setPincode] = useState<string>('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'care'>('desc');
  const [isCopied, setIsCopied] = useState(false);
  const [heartBounce, setHeartBounce] = useState(false);

  // Derive active image from selected color or fallback
  const getColorImage = (colorName: string): string => {
    if (!product.colorImages) return product.images[0];
    if (product.colorImages[colorName]) return product.colorImages[colorName];
    const key = Object.keys(product.colorImages).find(
      k => k.toLowerCase() === colorName.toLowerCase()
    );
    return key ? product.colorImages[key] : product.images[0];
  };

  const [selectedImage, setSelectedImage] = useState<string>(() => getColorImage(initialColor));

  // Sync state when product or preselectedColor changes
  useEffect(() => {
    const target = preselectedColor || product.colors.find(c => c.name.toLowerCase() === 'black')?.name || product.colors[0]?.name || 'Black';
    setSelectedColor(target);
    setSelectedImage(getColorImage(target));
  }, [product.id, preselectedColor]);

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    const newImg = getColorImage(colorName);
    setSelectedImage(newImg);
  };

  // Image Navigation inside modal
  const currentModalImgIndex = product.images.indexOf(selectedImage);
  const handlePrevModalImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!product.images || product.images.length <= 1) return;
    const current = currentModalImgIndex !== -1 ? currentModalImgIndex : 0;
    const prevIdx = current > 0 ? current - 1 : product.images.length - 1;
    setSelectedImage(product.images[prevIdx]);
  };

  const handleNextModalImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!product.images || product.images.length <= 1) return;
    const current = currentModalImgIndex !== -1 ? currentModalImgIndex : 0;
    const nextIdx = current < product.images.length - 1 ? current + 1 : 0;
    setSelectedImage(product.images[nextIdx]);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode.trim())) {
      setPincodeResult('✓ Delivery in 2–4 Business Days | Cash on Delivery Available');
    } else {
      setPincodeResult('Please enter a valid 6-digit Indian PIN Code');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleWishlistToggle = () => {
    setHeartBounce(true);
    setTimeout(() => setHeartBounce(false), 500);
    onToggleWishlist(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      {/* Container Box */}
      <div 
        className="relative bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-md backdrop-blur-xs transition-colors hover:scale-105 cursor-pointer"
            title={isCopied ? 'Link copied!' : 'Share product link'}
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleWishlistToggle}
            className={`p-2.5 rounded-full shadow-md backdrop-blur-xs transition-all cursor-pointer ${
              heartBounce ? 'animate-heart-pop' : ''
            } ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 ring-2 ring-rose-500 scale-105'
                : 'bg-white/90 text-slate-700 hover:text-rose-600 hover:scale-105'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-2.5 bg-white/90 hover:bg-slate-100 text-slate-700 rounded-full shadow-md backdrop-blur-xs transition-colors hover:scale-105 cursor-pointer"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Image Gallery Column (lg: 7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Main Active Image with Portrait Frame & Chevrons */}
              <div className="relative aspect-[3/4] max-h-[520px] rounded-2xl overflow-hidden bg-[#F8F9FA] border border-slate-200 shadow-xs group flex items-center justify-center">
                <img
                  key={selectedImage}
                  src={selectedImage}
                  alt={`${product.name} in ${selectedColor}`}
                  className="w-full h-full object-contain p-3 transition-all duration-300 animate-fade-in"
                  referrerPolicy="no-referrer"
                />
                
                {/* Previous / Next Arrow Controls in Modal */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevModalImage}
                      aria-label="Previous photograph"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg backdrop-blur-xs flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextModalImage}
                      aria-label="Next photograph"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg backdrop-blur-xs flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    {/* Photo index indicator */}
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md z-10">
                      {currentModalImgIndex !== -1 ? currentModalImgIndex + 1 : 1} / {product.images.length}
                    </div>
                  </>
                )}

                {product.badge && (
                  <span className="absolute top-4 left-4 bg-[#080B12] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm z-10">
                    {product.badge}
                  </span>
                )}

                {/* Active colour watermarker */}
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-lg border border-white/10 z-10">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-white/60"
                    style={{ backgroundColor: product.colors.find(c => c.name.toLowerCase() === selectedColor.toLowerCase())?.hex || '#111827' }}
                  />
                  <span>Colour: <strong className="uppercase text-blue-300">{selectedColor}</strong></span>
                </div>
              </div>

              {/* All Individual Gallery Photographs (Thumbnail Navigation) */}
              {product.images && product.images.length > 1 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Product Photographs & Angles ({product.images.length}):
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {product.images.map((imgUrl, idx) => {
                      const isSelected = selectedImage === imgUrl;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(imgUrl)}
                          className={`group relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-white cursor-pointer shrink-0 ${
                            isSelected
                              ? 'border-[#1455D9] ring-2 ring-blue-100 scale-102 shadow-sm'
                              : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                          }`}
                          title={`View angle ${idx + 1}`}
                        >
                          <img
                            src={imgUrl}
                            alt={`${product.name} angle ${idx + 1}`}
                            className="w-full h-full object-cover object-top rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color-Variant Interactive Thumbnails */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  All Colour Variants ({product.colors.length}):
                </span>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((color) => {
                    const colorImg = getColorImage(color.name);
                    const isSelected = selectedColor.toLowerCase() === color.name.toLowerCase();
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => handleColorSelect(color.name)}
                        className={`group relative w-20 sm:w-24 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white cursor-pointer ${
                          isSelected
                            ? 'border-[#1455D9] ring-2 ring-blue-100 scale-102 shadow-md'
                            : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                        }`}
                        title={`View ${color.name} variant`}
                      >
                        <div className="w-full h-16 sm:h-20 rounded-lg overflow-hidden bg-[#F8F9FA]">
                          <img
                            src={colorImg}
                            alt={`${product.name} in ${color.name}`}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex items-center justify-center gap-1.5 pt-1.5 pb-0.5 text-[11px] font-bold text-slate-800">
                          <span
                            className="w-2 h-2 rounded-full border border-black/20"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="capitalize">{color.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quality & Craftsmanship Badges */}
              <div className="mt-2 bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-3 gap-3 text-center text-xs">
                <div>
                  <Sparkles className="w-4 h-4 text-[#1455D9] mx-auto mb-1" />
                  <span className="font-bold text-slate-800">Long-Staple Fabric</span>
                  <p className="text-[10px] text-slate-500">Zero pill guarantee</p>
                </div>
                <div>
                  <ShieldCheck className="w-4 h-4 text-[#1455D9] mx-auto mb-1" />
                  <span className="font-bold text-slate-800">Pre-Shrunk</span>
                  <p className="text-[10px] text-slate-500">Retains shape wash after wash</p>
                </div>
                <div>
                  <Truck className="w-4 h-4 text-[#1455D9] mx-auto mb-1" />
                  <span className="font-bold text-slate-800">Express Delivery</span>
                  <p className="text-[10px] text-slate-500">Air dispatched in 24 hrs</p>
                </div>
              </div>
            </div>

            {/* RIGHT: Contiguous Purchase Module (lg: 5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="uppercase tracking-widest font-bold text-[#1455D9]">
                  Raghav Menswear Collection
                </span>
                <span className="flex items-center gap-1 font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <span className="text-amber-500">★</span> {product.rating}
                  <span className="text-slate-400 font-normal">({product.reviewsCount} reviews)</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#080B12] font-heading leading-tight">
                {product.name}
              </h1>

              {/* Price & Savings */}
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-[#080B12] tabular-nums font-heading">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-slate-400 line-through tabular-nums">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold block mt-0.5">
                    Inclusive of all taxes · Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({product.discount}%)
                  </span>
                </div>
                <div className="bg-rose-100 text-rose-700 font-extrabold text-xs px-2.5 py-1.5 rounded-lg">
                  {product.discount}% OFF
                </div>
              </div>

              {/* MANDATORY PROMINENT "SELECT COLOUR" SECTION */}
              <div className="mt-6 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1455D9]" />
                    SELECT COLOUR: <strong className="text-[#1455D9] text-sm uppercase">{selectedColor}</strong>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Click to change variant</span>
                </div>

                {/* Clickable Colour Options (Black, White, Grey compulsory + optional) */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor.toLowerCase() === color.name.toLowerCase();
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => handleColorSelect(color.name)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#1455D9] bg-white shadow-md ring-2 ring-blue-200 scale-102'
                            : 'border-slate-200 bg-white hover:border-slate-300 opacity-85 hover:opacity-100'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/20 flex-shrink-0 shadow-xs"
                          style={{
                            backgroundColor: color.hex,
                            boxShadow: color.name.toLowerCase() === 'white' ? 'inset 0 0 0 1px #cbd5e1' : undefined
                          }}
                        />
                        <span className={`text-xs font-bold uppercase truncate ${isSelected ? 'text-[#1455D9]' : 'text-slate-800'}`}>
                          {color.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector + Size Guide Modal Link */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800 uppercase tracking-wider">SELECT SIZE</span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-[#1455D9] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Ruler className="w-3.5 h-3.5" /> Size Guide
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#080B12] text-white shadow-sm ring-2 ring-slate-800 scale-102'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/60'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {/* Size guide table popup */}
                {showSizeGuide && (
                  <div className="mt-3 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-slate-700 animate-slide-up">
                    <p className="font-bold text-slate-900 mb-1">Standard Indian Menswear Measurements (Inches):</p>
                    <div className="grid grid-cols-5 text-center text-[11px] gap-1 font-mono">
                      <div className="bg-white p-1.5 rounded border border-blue-100">S: 36-38"</div>
                      <div className="bg-white p-1.5 rounded border border-blue-100">M: 38-40"</div>
                      <div className="bg-white p-1.5 rounded border border-blue-100">L: 40-42"</div>
                      <div className="bg-white p-1.5 rounded border border-blue-100">XL: 42-44"</div>
                      <div className="bg-white p-1.5 rounded border border-blue-100">XXL: 44-46"</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">QUANTITY</span>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 text-sm font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-black text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 text-sm font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Wholesale Volume Pricing Tier */}
              <div className="mt-5 p-3.5 bg-gradient-to-r from-blue-50/80 to-slate-50 border border-blue-200/80 rounded-2xl">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#080B12] flex items-center gap-1.5">
                    <PackageCheck className="w-4 h-4 text-[#1455D9]" />
                    Wholesale B2B Pricing Available
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    MOQ: 10 Pcs
                  </span>
                </div>
                <div className="flex items-baseline justify-between text-xs text-slate-600 mt-2">
                  <span>Bulk Rate (10+ pcs):</span>
                  <span className="font-black text-[#1455D9] text-sm">
                    ₹{Math.round(product.price * 0.85).toLocaleString('en-IN')}/piece
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Tax invoice with GST input credit and pan-India bilty freight transport provided.
                </p>
              </div>

              {/* CTAs: Add to Cart & Buy Now */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onAddToCart(product, selectedSize, selectedColor, quantity)}
                  className="w-full bg-white hover:bg-slate-50 text-[#080B12] border-2 border-[#080B12] py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#1455D9]" /> Add To Cart
                </button>

                <button
                  type="button"
                  onClick={() => onBuyNow(product, selectedSize, selectedColor, quantity)}
                  className="w-full bg-[#1455D9] hover:bg-[#0F42A8] text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-800/20 transition-all hover:scale-101 active:scale-95 cursor-pointer"
                >
                  Buy Now
                </button>
              </div>

              {/* Pincode Delivery Check */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <form onSubmit={handlePincodeCheck} className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1455D9]" /> Delivery Options & Cash on Delivery
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit PIN Code (e.g. 110001)"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1455D9]"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Check
                    </button>
                  </div>
                  {pincodeResult && (
                    <p className={`text-xs mt-1 font-medium ${pincodeResult.includes('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {pincodeResult}
                    </p>
                  )}
                </form>
              </div>

              {/* Detailed Specs Tabs */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex border-b border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('desc')}
                    className={`pb-2 mr-4 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'desc' ? 'border-[#1455D9] text-[#1455D9]' : 'border-transparent text-slate-500'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2 mr-4 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'specs' ? 'border-[#1455D9] text-[#1455D9]' : 'border-transparent text-slate-500'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('care')}
                    className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'care' ? 'border-[#1455D9] text-[#1455D9]' : 'border-transparent text-slate-500'
                    }`}
                  >
                    Wash & Care
                  </button>
                </div>

                <div className="pt-3 text-xs text-slate-600 leading-relaxed">
                  {activeTab === 'desc' && (
                    <div>
                      <p className="mb-2">{product.description}</p>
                      <ul className="space-y-1 list-disc list-inside text-slate-700">
                        {product.features.map((feat, i) => (
                          <li key={i}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {activeTab === 'specs' && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-semibold text-slate-800">Fabric Composition:</span>
                        <span>{product.fabric}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-semibold text-slate-800">Fit Silhouette:</span>
                        <span>{product.fit}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-semibold text-slate-800">Selected Colourway:</span>
                        <span className="font-bold text-[#1455D9] uppercase">{selectedColor}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="font-semibold text-slate-800">Country of Origin:</span>
                        <span>India (Proudly Made)</span>
                      </div>
                    </div>
                  )}
                  {activeTab === 'care' && (
                    <div>
                      <p className="font-medium text-slate-800 mb-1">Care Instructions:</p>
                      <p>{product.care}</p>
                      <p className="mt-2 text-slate-500">
                        Color-fast dyes preserve deep Black, crisp White, and rich Heather Grey brilliance wash after wash.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer sticky bar on mobile */}
        <div className="lg:hidden p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-black text-[#080B12] tabular-nums font-heading">
              ₹{(product.price * quantity).toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">
              Colour: <span className="text-[#1455D9] uppercase">{selectedColor}</span> · Size: {selectedSize}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onAddToCart(product, selectedSize, selectedColor, quantity)}
              className="bg-white border border-[#080B12] text-[#080B12] text-xs font-bold py-2.5 px-3 rounded-xl"
            >
              Add to Bag
            </button>
            <button
              onClick={() => onBuyNow(product, selectedSize, selectedColor, quantity)}
              className="bg-[#1455D9] text-white text-xs font-bold py-2.5 px-4 rounded-xl"
            >
              Buy Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
